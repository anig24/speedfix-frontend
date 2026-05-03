"use client";

import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { LoaderCircle, LogOut, ShieldCheck } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import {
  canAccessWorkspace,
  formatRoleLabel,
  getDefaultWorkspaceHref,
  normalizeRole,
  type WorkspaceKey,
} from "@/lib/portalAccess";
import {
  getAccessibleWorkspaceLinks,
  workspaceBlueprints,
  workspaceNavigation,
} from "@/lib/workspaceCatalog";
import EmployeeHierarchyPanel from "@/app/components/employee/EmployeeHierarchyPanel";

type ProtectedWorkspaceShellProps = {
  workspace: WorkspaceKey;
  children: ReactNode;
};

type WorkspaceProfile = {
  name: string;
  email: string;
  role: string;
  roleKey: string;
};

export default function ProtectedWorkspaceShell({
  workspace,
  children,
}: ProtectedWorkspaceShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<WorkspaceProfile | null>(null);
  const [links, setLinks] = useState(workspaceNavigation);

  const currentWorkspace = useMemo(() => {
    return workspaceNavigation.find((item) => item.key === workspace);
  }, [workspace]);

  const currentBlueprint = workspaceBlueprints[workspace];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      const snapshot = await getDoc(doc(db, "users", user.uid));
      const data = snapshot.exists()
        ? snapshot.data()
        : {
            name: user.displayName || "SpeedFix User",
            email: user.email || "",
            role: "CUSTOMER",
          };

      if (!canAccessWorkspace(data, workspace, user.email || data.email)) {
        setProfile(null);
        setLoading(false);
        router.replace(getDefaultWorkspaceHref(data, user.email || data.email));
        return;
      }

      setLinks(getAccessibleWorkspaceLinks(data, user.email || data.email));
      setProfile({
        name:
          typeof data.name === "string" && data.name.trim()
            ? data.name
            : user.displayName || "SpeedFix User",
        email:
          typeof data.email === "string" && data.email.trim()
            ? data.email
            : user.email || "",
        role: formatRoleLabel(data.role),
        roleKey: normalizeRole(data.role),
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router, workspace]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("loginTime");
    router.replace("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef1f5] text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-4 premium-card">
            <LoaderCircle className="h-6 w-6 animate-spin text-slate-700" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold">Opening your workspace</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
            Verifying account access, company email rules, and portal permissions.
          </p>
        </div>
      </div>
    );
  }

  if (!profile || !currentWorkspace) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#eef1f5] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-200 bg-white px-6 py-8 premium-card lg:border-b-0 lg:border-r">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="brand-wordmark text-2xl font-semibold tracking-tight text-slate-950">
              <span className="text-slate-950">Speed</span>
              <span className="text-[#FF6A00]">Fix</span>
            </span>
            <span className="rounded-full bg-[#fff2df] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-700">
              {currentWorkspace.shortLabel}
            </span>
          </Link>

          <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Active account
            </p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">{profile.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{profile.email}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              {profile.role}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Available workspaces
            </p>
            <div className="mt-4 space-y-2">
              {links.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                      active
                        ? "bg-slate-950 text-white"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.shortLabel}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-white/90 px-6 py-5 backdrop-blur">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {currentBlueprint.badge}
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-950">
                  {currentWorkspace.label}
                </h1>
                <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
                  {currentBlueprint.description}
                </p>
              </div>

              {workspace !== "customer" && (
                <EmployeeHierarchyPanel
                  currentEmail={profile.email}
                  currentRole={profile.roleKey}
                />
              )}
            </div>
          </header>

          <main className="flex-1 px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
