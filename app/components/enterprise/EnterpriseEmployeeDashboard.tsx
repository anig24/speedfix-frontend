"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, LoaderCircle } from "lucide-react";
import LiveOperationsAnimation from "@/app/components/enterprise/LiveOperationsAnimation";
import { auth } from "@/lib/firebase";
import {
  enterpriseModules,
  type EnterpriseKpi,
  type EnterpriseModuleKey,
} from "@/lib/enterpriseManagement";
import { type WorkspaceKey } from "@/lib/portalAccess";

type EnterpriseEmployeeDashboardProps = {
  workspace: WorkspaceKey;
  fallbackLabel: string;
};

type EnterpriseDashboardResponse = {
  profile: {
    email: string;
    role: string;
    name: string;
    workspace: WorkspaceKey;
  };
  kpis: EnterpriseKpi[];
  summaries: {
    employees: {
      total: number;
      active: number;
      inactive: number;
      byDepartment: Record<string, number>;
    };
    bookings: {
      total: number;
      pending: number;
      confirmed: number;
      inProgress: number;
      completed: number;
      cancelled: number;
    };
    work: {
      total: number;
      active: number;
      open: number;
      working: number;
      blocked: number;
      done: number;
    };
    workers: {
      total: number;
      verified: number;
      active: number;
      onJob: number;
    };
  };
  modules: Array<{
    key: EnterpriseModuleKey;
    title: string;
    owner: string;
    description: string;
    controlLevel: string;
    workflows: string[];
    approvals: string[];
    metrics: string[];
  }>;
  orgLayers: Array<{
    title: string;
    roles: string[];
    command: string;
  }>;
  recentWorkItems: Array<Record<string, unknown> & { id: string }>;
  recentBookings: Array<Record<string, unknown> & { id: string }>;
  recentAuditEvents: Array<Record<string, unknown> & { id: string }>;
};

export default function EnterpriseEmployeeDashboard({
  workspace,
  fallbackLabel,
}: EnterpriseEmployeeDashboardProps) {
  const [dashboard, setDashboard] = useState<EnterpriseDashboardResponse | null>(
    null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const token = await auth.currentUser?.getIdToken();
        const headers: HeadersInit = token
          ? { Authorization: `Bearer ${token}` }
          : {};
        const response = await fetch(
          `/api/enterprise/employee-dashboard?workspace=${workspace}`,
          { headers }
        );
        const data = (await response.json()) as {
          error?: string;
          dashboard?: EnterpriseDashboardResponse;
        };

        if (!response.ok || !data.dashboard) {
          throw new Error(data.error || "Unable to load enterprise dashboard.");
        }

        if (active) {
          setDashboard(data.dashboard);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load enterprise dashboard."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [workspace]);

  const moduleIconMap = useMemo(() => {
    return new Map(enterpriseModules.map((module) => [module.key, module.icon]));
  }, []);

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-slate-700" />
        <p className="mt-4 text-sm text-slate-600">
          Loading enterprise command data...
        </p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-rose-700">
        {error || "Unable to load enterprise dashboard."}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {dashboard.profile.role || fallbackLabel}
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-slate-950">
            Enterprise Management Command
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-600">
            A role-gated operating layer for employees, customers, field force,
            finance, audit, HR, and leadership. Every card below is backed by
            Firestore collections and management APIs, not placeholder-only UI.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <ControlMetric label="Employees" value={`${dashboard.summaries.employees.active}`} />
            <ControlMetric label="Bookings" value={`${dashboard.summaries.bookings.total}`} />
            <ControlMetric label="Work items" value={`${dashboard.summaries.work.active}`} />
            <ControlMetric label="Workers" value={`${dashboard.summaries.workers.active}`} />
          </div>
        </motion.div>
        <LiveOperationsAnimation compact />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboard.kpis.map((kpi, index) => (
          <motion.article
            key={`${kpi.label}-${index}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {kpi.label}
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-950">
              {kpi.value}
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{kpi.trend}</p>
          </motion.article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Enterprise modules
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
              Board-to-branch control model
            </h3>
          </div>
          <Building2 className="h-6 w-6 text-slate-400" />
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {dashboard.modules.map((module) => {
            const Icon = moduleIconMap.get(module.key) || CheckCircle2;

            return (
              <motion.article
                key={module.key}
                whileHover={{ y: -3 }}
                className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="rounded-2xl bg-white p-3 text-slate-800 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {module.controlLevel} / {module.owner}
                    </p>
                    <h4 className="mt-2 text-xl font-semibold text-slate-950">
                      {module.title}
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {module.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {module.workflows.slice(0, 4).map((workflow) => (
                    <span
                      key={workflow}
                      className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600"
                    >
                      {workflow}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Organization hierarchy
          </p>
          <div className="mt-5 space-y-3">
            {dashboard.orgLayers.map((layer) => (
              <div
                key={layer.title}
                className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4"
              >
                <h4 className="font-semibold text-slate-950">{layer.title}</h4>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {layer.command}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {layer.roles.join(" / ")}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Live work queues
          </p>
          <div className="mt-5 space-y-3">
            {dashboard.recentWorkItems.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div>
                  <p className="font-semibold text-slate-950">
                    {String(item.taskTitle || item.title || "Management work item")}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {String(item.city || "All cities")} / {String(item.ownerName || "Unassigned")}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600">
                  {String(item.status || "OPEN")}
                </span>
              </div>
            ))}
            {!dashboard.recentWorkItems.length && (
              <div className="rounded-[1.4rem] border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                No live work items yet.
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Deep operating routes
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
              Continue into daily execution
            </h3>
          </div>
          <Link
            href="/corporate/command-center/task-board"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Open command board
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ControlMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
