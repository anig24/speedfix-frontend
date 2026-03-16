"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const executeRecaptcha = async (action: string) => {
    return new Promise<string>((resolve, reject) => {
      if (!window.grecaptcha) {
        reject("reCAPTCHA not loaded");
        return;
      }

      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            { action }
          );
          resolve(token);
        } catch (err) {
          reject(err);
        }
      });
    });
  };

  const verifyWithServer = async (token: string) => {
    const res = await fetch("/api/verify-recaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message);
    }
  };

  const redirectByRole = async (uid: string) => {
    const snap = await getDoc(doc(db, "users", uid));

    if (!snap.exists()) {
      router.push("/dashboard");
      return;
    }

    const role = snap.data().role;

    if (role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  const handleSignup = async () => {
    try {
      setError("");

      const token = await executeRecaptcha("signup");
      await verifyWithServer(token);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: "",
        email: userCredential.user.email,
        role: "CUSTOMER",
        cityId: "chandannagar",
        status: "ACTIVE",
        createdAt: serverTimestamp(),
      });

      router.push("/dashboard");

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      setError("");

      const token = await executeRecaptcha("login");
      await verifyWithServer(token);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await redirectByRole(userCredential.user.uid);

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");

      const token = await executeRecaptcha("google_login");
      await verifyWithServer(token);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const snap = await getDoc(doc(db, "users", result.user.uid));

      if (!snap.exists()) {
        await setDoc(doc(db, "users", result.user.uid), {
          name: result.user.displayName || "",
          email: result.user.email,
          role: "CUSTOMER",
          cityId: "chandannagar",
          status: "ACTIVE",
          createdAt: serverTimestamp(),
        });
      }

      await redirectByRole(result.user.uid);

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-8">
          Login / Signup
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border p-3 rounded-lg pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-orange-500 text-white py-3 rounded-lg mb-4"
        >
          Sign Up
        </button>

        <button
          onClick={handleLogin}
          className="w-full bg-gray-900 text-white py-3 rounded-lg mb-4"
        >
          Login
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 py-3 rounded-lg"
        >
          Continue with Google
        </button>

      </div>
    </section>
  );
}