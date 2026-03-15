"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
const redirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ SIGN UP
  const handleSignup = async () => {
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      if (redirect) {
  router.push(`/services/${redirect}`);
} else {
  router.push("/dashboard");
}
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ✅ LOGIN
  const handleLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (redirect) {
  router.push(`/services/${redirect}`);
} else {
  router.push("/dashboard");
}
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ✅ GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    setError("");
    try {
        console.log("Google login clicked");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log("Google login success");
   if (redirect) {
  router.push(`/services/${redirect}`);
} else {
  router.push("/dashboard");
}
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md">

        {redirect && (
  <div className="mb-6 bg-orange-50 border border-orange-200 text-orange-600 p-4 rounded-lg text-sm">
    Please login to continue booking your service.
  </div>
)}

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

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-orange-500 text-white py-3 rounded-lg mb-4 hover:bg-orange-600 transition"
        >
          Sign Up
        </button>

        <button
          onClick={handleLogin}
          className="w-full bg-gray-900 text-white py-3 rounded-lg mb-4 hover:bg-black transition"
        >
          Login
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Continue with Google
        </button>

      </div>
    </section>
  );
}