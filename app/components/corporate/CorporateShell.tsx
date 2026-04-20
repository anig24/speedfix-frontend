"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  ArrowUpRight,
  ChevronRight,
  LoaderCircle,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import {
  CORPORATE_SESSION_COOKIE,
  getCorporateRoleLabel,
  isActiveCorporateEmployee,
} from "@/lib/corporateAuth";
import {
  corporateQuickLinks,
  corporateSections,
  corporateSidebarFooterLinks,
} from "@/lib/corporatePortal";

type CorporateShellProps = {
  children: ReactNode;
};

type CorporateProfile = {
  name?: string;
  email?: string;
  role?: string;
};

async function clearCorporateSession() {
  await fetch("/api/corporate-session", {
    method: "DELETE",
  });

  document.cookie = `${CORPORATE_SESSION_COOKIE}=; max-age=0; path=/`;
  localStorage.removeItem("loginTime");
}

export default function CorporateShell({ children }: CorporateShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginRoute = pathname === "/corporate/login";
  const [loading, setLoading] = useState(!isLoginRoute);
  const [profile, setProfile] = useState<CorporateProfile | null>(null);

  const activeSection = useMemo(() => {
    return corporateSections.find((section) =>
      pathname === `/corporate/${section.slug}` ||
      pathname.startsWith(`/corporate/${section.slug}/`)
    );
  }, [pathname]);

  useEffect(() => {
    if (isLoginRoute) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await clearCorporateSession();
        setProfile(null);
        setLoading(false);
        router.replace(`/corporate/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      const snapshot = await getDoc(doc(db, "users", user.uid));
      const data = snapshot.exists() ? snapshot.data() : null;

      if (!isActiveCorporateEmployee(data)) {
        await clearCorporateSession();
        await signOut(auth);
        setProfile(null);
        setLoading(false);
        router.replace("/corporate/login?reason=employee-only");
        return;
      }

      setProfile({
        name: typeof data?.name === "string" ? data.name : user.displayName || "SpeedFix Employee",
        email: typeof data?.email === "string" ? data.email : user.email || "",
        role: getCorporateRoleLabel(data?.role),
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isLoginRoute, pathname, router]);

  const handleLogout = async () => {
    await clearCorporateSession();
    await signOut(auth);
    setProfile(null);
    router.replace("/corporate/login");
  };

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-4">
            <LoaderCircle className="h-6 w-6 animate-spin text-cyan-400" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold">
            Opening the corporate workspace
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
            Checking employee access, company role, and active session status.
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-white">
      <div className="grid min-h-screen lg:grid-cols-[300px_1fr]">
        <aside className="border-b border-white/10 bg-[#050913] px-6 py-8 lg:border-b-0 lg:border-r">
          <Link href="/corporate" className="inline-flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">SpeedFix</span>
            <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Corporate
            </span>
          </Link>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Active employee
            </p>
            <h2 className="mt-3 text-xl font-semibold">{profile.name}</h2>
            <p className="mt-1 text-sm text-slate-300">{profile.email}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              {profile.role}
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <Link
              href="/corporate"
              className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
                pathname === "/corporate"
                  ? "bg-white text-slate-950"
                  : "text-slate-200 hover:bg-white/5"
              }`}
            >
              Command overview
              <ChevronRight className="h-4 w-4" />
            </Link>

            {corporateSections.map((section) => {
              const Icon = section.icon;
              const active = activeSection?.slug === section.slug;

              return (
                <Link
                  key={section.slug}
                  href={`/corporate/${section.slug}`}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
                    active
                      ? "bg-cyan-400/10 text-cyan-200"
                      : "text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {section.title}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              );
            })}
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Quick links
            </p>
            <div className="mt-4 grid gap-3">
              {corporateQuickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-cyan-300" />
                      {item.title}
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {corporateSidebarFooterLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5"
                >
                  <Icon className="h-4 w-4 text-slate-400" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-white/10 bg-[#090d16]/90 px-6 py-5 backdrop-blur">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Company workspace
                </p>
                <h1 className="mt-2 text-2xl font-semibold">
                  {activeSection ? activeSection.title : "Corporate overview"}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
                  {activeSection
                    ? activeSection.description
                    : "Use /corporate as the single company entry point. Every major task category now lives here with clickable subcategories and employee-only access."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {corporateQuickLinks.slice(0, 3).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
