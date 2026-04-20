"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ✅ SESSION (24 HOURS)
  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");

    if (auth.currentUser && loginTime) {
      const diff = Date.now() - parseInt(loginTime);

      if (diff < 24 * 60 * 60 * 1000) {
        router.push("/dashboard");
      }
    }
  }, [router]);

  // 🔥 REDIRECT BASED ON ROLE
  const redirectUser = (role: string) => {
    switch (role) {
      case "FOUNDER":
        router.push("/executive");
        break;
      case "MANAGEMENT":
        router.push("/management");
        break;
      case "STAFF":
        router.push("/corporateStaff");
        break;
      case "OPERATIONS":
        router.push("/operations");
        break;
      case "SUPPORT":
        router.push("/support");
        break;
      default:
        router.push("/customer");
    }
  };

  // 🔐 LOGIN
  const handleLogin = async () => {
    setError("");

    if (!captchaValue) {
      setError("Please verify reCAPTCHA");
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      localStorage.setItem("loginTime", Date.now().toString());

      const snap = await getDoc(doc(db, "users", res.user.uid));
      redirectUser(snap.data()?.role || "CUSTOMER");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  // 🆕 SIGNUP
  const handleSignup = async () => {
    setError("");

    if (!captchaValue) {
      setError("Please verify reCAPTCHA");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      localStorage.setItem("loginTime", Date.now().toString());

      await setDoc(doc(db, "users", res.user.uid), {
        name: form.name,
        email: form.email,
        role: "CUSTOMER",
        createdAt: new Date(),
      });

      router.push("/customer");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    }
  };

  // 🔥 GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      localStorage.setItem("loginTime", Date.now().toString());

      const ref = doc(db, "users", res.user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          name: res.user.displayName,
          email: res.user.email,
          role: "CUSTOMER",
          createdAt: new Date(),
        });
      }

      router.push("/customer");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220]">

      <div className="w-[950px] h-[550px] bg-[#020617] rounded-2xl shadow-2xl flex overflow-hidden">

        {/* LEFT SIDE */}
        <div className="w-1/2 flex items-center justify-center p-10">

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <h2 className="text-2xl text-white mb-6">Sign In</h2>

                <input
                  placeholder="Email"
                  className="input"
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />

                {/* PASSWORD */}
                <div className="relative mt-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="input pr-12"
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />

                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6A00]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* CAPTCHA */}
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={(val: string | null) => setCaptchaValue(val)}
                  className="mt-4"
                />

                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}

                <button onClick={handleLogin} className="btn mt-6">
                  Login
                </button>

                {/* GOOGLE */}
                <button
                  onClick={handleGoogleLogin}
                  className="google"
                >
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    className="w-5 h-5"
                  />
                  Continue with Google
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <h2 className="text-2xl text-white mb-6">
                  Create Account
                </h2>

                <input
                  placeholder="Full Name"
                  className="input"
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />

                <input
                  placeholder="Email"
                  className="input mt-3"
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="input mt-3"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />

                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={(val: string | null) => setCaptchaValue(val)}
                  className="mt-4"
                />

                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}

                <button onClick={handleSignup} className="btn mt-6">
                  Create Account
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT SIDE */}
        <motion.div
          className="w-1/2 flex items-center justify-center text-white px-10 bg-gradient-to-br from-orange-500 to-orange-700"
          animate={{ scale: isLogin ? 1 : 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              {isLogin ? "Welcome Back!" : "Hello, Dear Friend!"}
            </h2>

            <p className="text-sm mb-6">
              {isLogin
                ? "Let's login to continue your journey with SpeedFix"
                : "Create your account and start booking your services instantly"}
            </p>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="border px-6 py-2 rounded hover:bg-white hover:text-black transition"
            >
              {isLogin ? "Create Account" : "Login"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
        }

        .btn {
          background: #ff6a00;
          padding: 12px;
          border-radius: 8px;
          width: 100%;
          font-weight: 500;
        }

        .google {
          margin-top: 10px;
          width: 100%;
          padding: 12px;
          background: white;
          color: black;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
