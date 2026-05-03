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
} from "@/lib/corporateAuth";
import {
  canAccessWorkspace,
  normalizeRole,
} from "@/lib/portalAccess";
import {
  corporateQuickLinks,
  corporateSidebarFooterLinks,
} from "@/lib/corporatePortal";
import {
  canAccessCorporatePath,
  getCorporateDashboardScope,
  getCorporateSectionsForScope,
} from "@/lib/corporateWorkspaceAccess";
import {
  CorporateAccessProvider,
  type CorporateAccessContextValue,
} from "@/app/components/corporate/CorporateAccessContext";
import EmployeeHierarchyPanel from "@/app/components/employee/EmployeeHierarchyPanel";

type CorporateShellProps = {
  children: ReactNode;
};

type CorporateProfile = {
  name: string;
  email: string;
  role: string;
  roleKey: string;
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
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CorporateProfile | null>(null);
  const [scope, setScope] = useState<ReturnType<typeof getCorporateDashboardScope>>(
    null
  );

  const sections = useMemo(
    () => (scope ? getCorporateSectionsForScope(scope) : []),
    [scope]
  );

  const activeSection = useMemo(() => {
    return sections.find(
      (section) =>
        pathname === `/corporate/${section.slug}` ||
        pathname.startsWith(`/corporate/${section.slug}/`)
    );
  }, [pathname, sections]);

  const quickLinks = useMemo(() => {
    if (!scope) {
      return [];
    }

    return corporateQuickLinks.filter((item) =>
      canAccessCorporatePath(item.href, scope)
    );
  }, [scope]);

  const footerLinks = useMemo(() => {
    if (!scope) {
      return [];
    }

    return corporateSidebarFooterLinks.filter((item) =>
      canAccessCorporatePath(item.href, scope)
    );
  }, [scope]);

  const routeAllowed = useMemo(() => {
    if (!scope) {
      return true;
    }

    return canAccessCorporatePath(pathname, scope);
  }, [pathname, scope]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await clearCorporateSession();
        setProfile(null);
        setScope(null);
        setLoading(false);
        router.replace(`/corporate-login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      const snapshot = await getDoc(doc(db, "users", user.uid));
      const data = snapshot.exists() ? snapshot.data() : null;

      if (!canAccessWorkspace(data, "corporate", user.email || data?.email)) {
        await clearCorporateSession();
        setProfile(null);
        setScope(null);
        setLoading(false);
        router.replace("/corporate-login?reason=employee-only");
        return;
      }

      const nextScope = getCorporateDashboardScope(
        data,
        user.email || data?.email
      );

      if (!nextScope) {
        await clearCorporateSession();
        setProfile(null);
        setScope(null);
        setLoading(false);
        router.replace("/corporate-login?reason=employee-only");
        return;
      }

      setProfile({
        name:
          typeof data?.name === "string" && data.name.trim()
            ? data.name
            : user.displayName || "SpeedFix Employee",
        email:
          typeof data?.email === "string" && data.email.trim()
            ? data.email
            : user.email || "",
        role: getCorporateRoleLabel(data?.role),
        roleKey: normalizeRole(data?.role),
      });
      setScope(nextScope);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  useEffect(() => {
    if (!scope || !profile) {
      return;
    }

    if (!routeAllowed) {
      router.replace(scope.homeHref);
    }
  }, [profile, routeAllowed, router, scope]);

  const handleLogout = async () => {
    await clearCorporateSession();
    await signOut(auth);
    setProfile(null);
    setScope(null);
    router.replace("/corporate-login");
  };

  if (loading || !routeAllowed) {
    return (
      <div className="min-h-screen bg-[#f3f5f9] text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-4 shadow-sm">
            <LoaderCircle className="h-6 w-6 animate-spin text-slate-700" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold">
            Opening your role workspace
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
            Checking company access, employee role, and the dashboard path
            assigned to this designation.
          </p>
        </div>
      </div>
    );
  }

  if (!profile || !scope) {
    return null;
  }

  const contextValue: CorporateAccessContextValue = {
    profile,
    scope,
    sections,
    quickLinks,
    footerLinks,
  };

  return (
    <CorporateAccessProvider value={contextValue}>
      <div className="min-h-screen bg-[#edf2f8] text-slate-900">
        <div className="grid min-h-screen xl:grid-cols-[320px_1fr]">
          <aside className="border-b border-white/10 bg-[#07111f] px-6 py-8 text-white shadow-[0_28px_80px_rgba(2,10,24,0.28)] xl:border-b-0 xl:border-r">
            <Link href="/corporate" className="inline-flex items-center gap-3">
              <span className="text-2xl font-semibold tracking-tight text-white">
                <span className="text-white">Speed</span>
                <span className="text-[#FF6A00]">Fix</span>
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                Corporate
              </span>
            </Link>

            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Active employee
              </p>
              <h2 className="mt-3 text-xl font-semibold text-white">
                {profile.name}
              </h2>
              <p className="mt-1 text-sm text-white/62">{profile.email}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/12 px-3 py-2 text-xs font-medium text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                {profile.role}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <SidebarMetric label="Lanes" value={`${sections.length}`} />
                <SidebarMetric label="Tools" value={`${quickLinks.length}`} />
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Role workspace
              </p>
              <Link
                href={scope.homeHref}
                className={`mt-4 flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
                  pathname === "/corporate"
                    ? "bg-white text-slate-950"
                    : "bg-white/5 text-white/88 hover:bg-white/10"
                }`}
              >
                <span>{scope.label}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <div className="mt-3 space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const active = activeSection?.slug === section.slug;

                  return (
                    <Link
                      key={section.slug}
                      href={`/corporate/${section.slug}`}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
                        active
                          ? "bg-[#13233b] text-white"
                          : "text-white/72 hover:bg-white/6 hover:text-white"
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
            </div>

            {quickLinks.length > 0 && (
              <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                  Role options
                </p>
                <div className="mt-4 grid gap-3">
                  {quickLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/82 transition hover:border-white/15 hover:bg-white/10"
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-white/45" />
                          {item.title}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-white/40" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {footerLinks.length > 0 && (
              <div className="mt-8 flex flex-col gap-2">
                {footerLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/6 hover:text-white"
                    >
                      <Icon className="h-4 w-4 text-white/35" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </aside>

          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/88 px-6 py-5 backdrop-blur">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {scope.badge}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                    {activeSection ? activeSection.title : scope.label}
                  </h1>
                  <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
                    {activeSection ? activeSection.description : scope.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <ToplineMetric label="Sections" value={`${sections.length}`} />
                  <ToplineMetric label="Role tools" value={`${quickLinks.length}`} />
                  <EmployeeHierarchyPanel
                    currentEmail={profile.email}
                    currentRole={profile.roleKey}
                  />
                  {quickLinks.slice(0, 2).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </header>

            <main className="dashboard-grid flex-1 px-6 py-8">{children}</main>
          </div>
        </div>
      </div>
    </CorporateAccessProvider>
  );
}

function SidebarMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.15rem] border border-white/10 bg-[#0c1a31] px-3 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function ToplineMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
      <span className="font-semibold text-slate-950">{value}</span>
      <span className="ml-2 text-slate-500">{label}</span>
    </div>
  );
}
