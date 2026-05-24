"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { LoaderCircle, LogOut, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/firebase";
import { clearWorkspaceSessionCookies } from "@/lib/clientAuthSession";
import { getClientUserProfile } from "@/lib/clientUserProfile";
import {
  AGENT_SESSION_COOKIE,
  getAgentRoleLabel,
} from "@/lib/agentAuth";
import { canAccessWorkspace, normalizeRole } from "@/lib/portalAccess";
import { agentQuickLinks } from "@/lib/agentPortal";
import EmployeeHierarchyPanel from "@/app/components/employee/EmployeeHierarchyPanel";

type AgentShellProps = {
  children: ReactNode;
};

type AgentProfile = {
  name?: string;
  email?: string;
  role?: string;
  roleKey?: string;
};

async function clearAgentSession() {
  await clearWorkspaceSessionCookies();

  document.cookie = `${AGENT_SESSION_COOKIE}=; max-age=0; path=/`;
  localStorage.removeItem("loginTime");
}

export default function AgentShell({ children }: AgentShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AgentProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await clearAgentSession();
        setProfile(null);
        setLoading(false);
        router.replace(`/agent-login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      const data = await getClientUserProfile(user);

      if (!canAccessWorkspace(data, "agent", user.email || data.email)) {
        await clearAgentSession();
        await signOut(auth);
        setProfile(null);
        setLoading(false);
        router.replace("/agent-login?reason=agent-only");
        return;
      }

      setProfile({
        name: typeof data?.name === "string" ? data.name : user.displayName || "SpeedFix Agent",
        email: typeof data?.email === "string" ? data.email : user.email || "",
        role: getAgentRoleLabel(data?.role),
        roleKey: normalizeRole(data?.role),
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    await clearAgentSession();
    await signOut(auth);
    setProfile(null);
    router.replace("/agent-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6efe4] text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-4 premium-card">
            <LoaderCircle className="h-6 w-6 animate-spin text-slate-700" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold">Opening the agent workspace</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
            Checking active role access, session status, and support workflow visibility.
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f6efe4] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-200 bg-white px-6 py-8 premium-card lg:border-b-0 lg:border-r">
          <Link href="/agent" className="inline-flex items-center gap-2">
            <span className="text-2xl font-semibold tracking-tight text-slate-950">
              <span className="text-slate-950">Speed</span>
              <span className="text-[#FF6A00]">Fix</span>
            </span>
            <span className="rounded-full bg-[#fff2df] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-700">
              Agent
            </span>
          </Link>

          <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Active agent
            </p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">{profile.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{profile.email}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              {profile.role}
            </div>
          </div>

          <div className="mt-8 space-y-2">
            {agentQuickLinks.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

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
                  {item.label}
                </Link>
              );
            })}
          </div>

          <button
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
                  Agent workspace
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-950">
                  Customer calls and daily support execution
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                  This portal is only for agents handling calls, customer follow-ups,
                  booking clarifications, and escalation handoff.
                </p>
              </div>

              {profile.roleKey && profile.email && (
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
