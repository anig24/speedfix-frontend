"use client";

import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Headset } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { canAccessWorkspace } from "@/lib/portalAccess";

export default function AgentLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nextPath = searchParams.get("next") || "/agent";

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const snapshot = await getDoc(doc(db, "users", result.user.uid));
      const data = snapshot.exists() ? snapshot.data() : null;

      if (!canAccessWorkspace(data, "agent", result.user.email || email)) {
        await signOut(auth);
        throw new Error(
          "This workspace is only for active SpeedFix agent accounts. If you are an admin or corporate user, please use your assigned dashboard."
        );
      }

      await fetch("/api/agent-session", {
        method: "POST",
      });

      router.push(nextPath);
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6efe4] px-6 py-16 text-slate-900">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2.2rem] border border-slate-200 bg-white p-8 premium-card">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
            <Headset className="h-4 w-4 text-orange-500" />
            Agent login
          </div>
          <h1 className="mt-5 text-5xl font-semibold leading-tight text-slate-950">
            Daily calls, follow-ups, and customer desk for SpeedFix agents
          </h1>
          <p className="mt-5 text-sm leading-8 text-slate-600">
            Use this path for calling queues, support follow-ups, reschedule
            handling, payment reminders, and escalation routing. Access is
            reserved for active company accounts ending with
            {" "}
            <span className="font-semibold">@speedfix.co.in</span>.
          </p>
        </section>

        <section className="rounded-[2.2rem] border border-slate-200 bg-white p-8 premium-card">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Work email access
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@speedfix.co.in"
              autoComplete="email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Open agent workspace"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-[1.4rem] bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
