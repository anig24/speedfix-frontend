"use client";

import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, BriefcaseBusiness, Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/firebase";
import { syncWorkspaceSessionCookies } from "@/lib/clientAuthSession";
import { getClientUserProfile } from "@/lib/clientUserProfile";
import {
  canAccessWorkspace,
  getCorporateHomeHref,
} from "@/lib/portalAccess";

export default function CorporateLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nextPath = searchParams.get("next");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const data = await getClientUserProfile(result.user);

      if (!canAccessWorkspace(data, "corporate", result.user.email || email)) {
        await signOut(auth);
        throw new Error(
          "This workspace is only for active SpeedFix employees using @speedfix.co.in email. Agents and customers use their own login flow."
        );
      }

      localStorage.setItem("loginTime", Date.now().toString());
      await syncWorkspaceSessionCookies(data, result.user.email || email);

      router.push(nextPath || getCorporateHomeHref(data, result.user.email || email));
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] px-6 py-16 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2.2rem] border border-white/10 bg-white/5 p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyan-200">
            <BriefcaseBusiness className="h-4 w-4 text-cyan-300" />
            Corporate login
          </div>
          <h1 className="mt-5 text-5xl font-semibold leading-tight text-white">
            Company workspace for internal SpeedFix teams
          </h1>
          <p className="mt-5 text-sm leading-8 text-slate-300">
            Use this path for HR, operations, finance, quality, recruiter, and
            leadership work. Access is reserved for active company accounts ending with
            {" "}
            <span className="font-semibold text-white">@speedfix.co.in</span>.
          </p>
        </section>

        <section className="rounded-[2.2rem] border border-white/10 bg-[#050913] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
            Work email access
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@speedfix.co.in"
              autoComplete="email"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-cyan-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Open corporate workspace"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-[1.4rem] bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
