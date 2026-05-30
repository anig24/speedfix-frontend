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
  Bell,
  Search,
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
  const [scope, setScope] = useState<ReturnType<typeof getCorporateDashboardScope>>(null);

  const sections = useMemo(() => (scope ? getCorporateSectionsForScope(scope) : []), [scope]);

  const activeSection = useMemo(() => {
    return sections.find(
      (section) =>
        pathname === `/corporate/${section.slug}` ||
        pathname.startsWith(`/corporate/${section.slug}/`)
    );
  }, [pathname, sections]);

  const quickLinks = useMemo(() => {
    if (!scope) return [];
    return corporateQuickLinks.filter((item) => canAccessCorporatePath(item.href, scope));
  }, [scope]);

  const footerLinks = useMemo(() => {
    if (!scope) return [];
    return corporateSidebarFooterLinks.filter((item) => canAccessCorporatePath(item.href, scope));
  }, [scope]);

  const routeAllowed = useMemo(() => {
    if (!scope) return true;
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

      const nextScope = getCorporateDashboardScope(data, user.email || data?.email);

      if (!nextScope) {
        await clearCorporateSession();
        setProfile(null);
        setScope(null);
        setLoading(false);
        router.replace("/corporate-login?reason=employee-only");
        return;
      }

      setProfile({
        name: typeof data?.name === "string" && data.name.trim() ? data.name : user.displayName || "SpeedFix Employee",
        email: typeof data?.email === "string" && data.email.trim() ? data.email : user.email || "",
        role: getCorporateRoleLabel(data?.role),
        roleKey: normalizeRole(data?.role),
      });
      setScope(nextScope);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  useEffect(() => {
    if (!scope || !profile) return;
    if (!routeAllowed) router.replace(scope.homeHref);
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 font-sans">
        <div className="flex flex-col items-center text-center">
          <LoaderCircle className="h-10 w-10 animate-spin text-[#FF6A00]" />
          <h1 className="mt-6 text-2xl font-bold text-slate-900 tracking-tight">Authenticating Workspace</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">Verifying corporate credentials and access level...</p>
        </div>
      </div>
    );
  }

  if (!profile || !scope) return null;

  const contextValue: CorporateAccessContextValue = { profile, scope, sections, quickLinks, footerLinks };

  return (
    <CorporateAccessProvider value={contextValue}>
      <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
        
        {/* SOLID WHITE, HIGH-CONTRAST SIDEBAR (Zero Lag, Max Visibility) */}
        <aside className="hidden w-[280px] flex-col border-r border-slate-200 bg-white lg:flex z-20 flex-shrink-0">
          
          {/* Logo Area */}
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100">
            <Link href="/corporate" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                Speed<span className="text-[#FF6A00]">Fix</span>
              </span>
              <span className="ml-2 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase text-slate-600">
                Corporate
              </span>
            </Link>
          </div>

          {/* Scrollable Navigation Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
            
            {/* Clear Profile Card */}
            <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0A1128] text-lg font-bold text-white shadow-sm">
                  {profile.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{profile.name}</p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="truncate">{profile.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Workspaces */}
            <nav className="space-y-1">
               <p className="mb-3 px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                 Role Workspaces
               </p>
               
               <Link
                href={scope.homeHref}
                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  pathname === "/corporate" 
                    ? "bg-[#FF6A00]/10 text-[#FF6A00]" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{scope.label} Home</span>
                {pathname === "/corporate" && <ChevronRight className="h-4 w-4" />}
              </Link>

              {sections.map((section) => {
                const Icon = section.icon;
                const active = activeSection?.slug === section.slug;
                return (
                  <Link
                    key={section.slug}
                    href={`/corporate/${section.slug}`}
                    className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      active 
                        ? "bg-slate-900 text-white shadow-sm" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={`h-4.5 w-4.5 ${active ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
                      {section.title}
                    </span>
                    {active && <ChevronRight className="h-4 w-4 text-slate-400" />}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Access Tools */}
            {quickLinks.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Quick Actions
                </p>
                <div className="space-y-1">
                  {quickLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-4.5 w-4.5 text-slate-400" />
                          {item.title}
                        </span>
                        <ArrowUpRight className="h-3 w-3 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer / Logout */}
          <div className="shrink-0 border-t border-slate-100 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Sign out securely
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA (Isolated scrolling prevents full-page repaints) */}
        <div className="flex flex-1 flex-col min-w-0 h-screen">
          
          {/* Solid White Top Header */}
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 md:px-8">
            <div className="flex items-center gap-4">
               <div>
                 <p className="mb-0.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">
                   {scope.badge} Control
                 </p>
                 <h1 className="text-lg font-bold text-slate-900 leading-none">
                   {activeSection ? activeSection.title : scope.label}
                 </h1>
               </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6">
               <EmployeeHierarchyPanel currentEmail={profile.email} currentRole={profile.roleKey} />
               
               <div className="hidden h-6 w-px bg-slate-200 md:block"></div>
               
               <div className="flex items-center gap-2">
                 <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900">
                   <Search className="h-5 w-5" />
                 </button>
                 <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 relative">
                   <Bell className="h-5 w-5" />
                   <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 border-2 border-white"></span>
                 </button>
               </div>
            </div>
          </header>
          
          {/* Scrollable Page Body */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
          
        </div>
      </div>
    </CorporateAccessProvider>
  );
}
