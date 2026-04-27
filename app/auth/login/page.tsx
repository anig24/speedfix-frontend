"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { Eye, EyeOff } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { getDefaultWorkspaceHref } from "@/lib/portalAccess";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");

    if (!auth.currentUser || !loginTime) {
      return;
    }

    const diff = Date.now() - parseInt(loginTime, 10);

    if (diff >= 24 * 60 * 60 * 1000) {
      return;
    }

    const syncExistingSession = async () => {
      const snapshot = await getDoc(doc(db, "users", auth.currentUser!.uid));
      const data = snapshot.exists()
        ? snapshot.data()
        : {
            email: auth.currentUser?.email || "",
            role: "CUSTOMER",
          };

      router.push(getDefaultWorkspaceHref(data, auth.currentUser?.email));
    };

    syncExistingSession().catch(() => {
      router.push("/customer");
    });
  }, [router]);

  const redirectUser = (record: unknown, email?: string | null) => {
    router.push(getDefaultWorkspaceHref(record, email));
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!captchaValue) {
      setError("Please verify reCAPTCHA");
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(auth, form.email, form.password);
      localStorage.setItem("loginTime", Date.now().toString());

      const snapshot = await getDoc(doc(db, "users", res.user.uid));
      redirectUser(
        snapshot.exists()
          ? snapshot.data()
          : {
              email: res.user.email || form.email,
              role: "CUSTOMER",
            },
        res.user.email
      );
    } catch (loginError: unknown) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    }
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

      redirectUser(
        {
          name: form.name,
          email: form.email,
          role: "CUSTOMER",
        },
        form.email
      );
    } catch (signupError: unknown) {
      setError(signupError instanceof Error ? signupError.message : "Signup failed");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      localStorage.setItem("loginTime", Date.now().toString());

      const ref = doc(db, "users", res.user.uid);
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()) {
        await setDoc(ref, {
          name: res.user.displayName,
          email: res.user.email,
          role: "CUSTOMER",
          createdAt: new Date(),
        });
      }

      redirectUser(
        snapshot.exists()
          ? snapshot.data()
          : {
              name: res.user.displayName,
              email: res.user.email,
              role: "CUSTOMER",
            },
        res.user.email
      );
    } catch (googleError: unknown) {
      setError(
        googleError instanceof Error ? googleError.message : "Google login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220]">
      <div className="w-[950px] h-[550px] bg-[#020617] rounded-2xl shadow-2xl flex overflow-hidden">
        <div className="w-1/2 flex items-center justify-center p-10">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4 }}
                className="w-full"
                onSubmit={handleLogin}
              >
                <h2 className="text-2xl text-white mb-6">Sign In</h2>

                <input
                  placeholder="Email"
                  className="input"
                  autoComplete="email"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                />

                <div className="relative mt-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="input pr-12"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6A00]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={(value: string | null) => setCaptchaValue(value)}
                  className="mt-4"
                />

                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

                <button type="submit" className="btn mt-6">
                  Login
                </button>

                <button type="button" onClick={handleGoogleLogin} className="google">
                  <Image
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                  Continue with Google
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="w-full"
                onSubmit={handleSignup}
              >
                <h2 className="text-2xl text-white mb-6">Create Account</h2>

                <input
                  placeholder="Full Name"
                  className="input"
                  autoComplete="name"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                />

                <input
                  placeholder="Email"
                  className="input mt-3"
                  autoComplete="email"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                />

                <div className="relative mt-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="new-password"
                    className="input pr-12"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6A00]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={(value: string | null) => setCaptchaValue(value)}
                  className="mt-4"
                />

                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

                <button type="submit" className="btn mt-6">
                  Create Account
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

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
              type="button"
              onClick={() => setIsLogin((current) => !current)}
              className="border px-6 py-2 rounded hover:bg-white hover:text-black transition"
            >
              {isLogin ? "Create Account" : "Login"}
            </button>
          </div>
        </motion.div>
      </div>

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
