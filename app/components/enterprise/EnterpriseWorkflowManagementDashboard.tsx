"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeIndianRupee,
  BarChart3,
  Boxes,
  ClipboardList,
  Gauge,
  Headset,
  Layers3,
  MapPinned,
  PackageCheck,
  ShieldAlert,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  getEnterpriseWorkflowFunctions,
  type EnterpriseWorkflowAudience,
} from "@/lib/enterpriseWorkflow";
import { type WorkspaceKey } from "@/lib/portalAccess";

type EnterpriseWorkflowManagementDashboardProps = {
  workspace?: WorkspaceKey;
  audience?: EnterpriseWorkflowAudience;
  title?: string;
  description?: string;
  compact?: boolean;
  limit?: number;
};

const iconMap: Record<string, LucideIcon> = {
  demand: PackageCheck,
  fulfillment: MapPinned,
  workforce: UsersRound,
  customer: Headset,
  finance: BadgeIndianRupee,
  catalog: Layers3,
  risk: ShieldAlert,
  assets: Boxes,
  analytics: BarChart3,
  partner: ClipboardList,
};

const pipeline = ["Intake", "Approval", "Execution", "Exception", "Closure"];

export default function EnterpriseWorkflowManagementDashboard({
  workspace = "corporate",
  audience = "employee",
  title = "Multi-function Workflow Management",
  description = "A Reliance-scale, Flipkart-style control layer for work moving across demand, people, operations, finance, support, quality, catalog, field force, and leadership.",
  compact = false,
  limit,
}: EnterpriseWorkflowManagementDashboardProps) {
  const workflows = getEnterpriseWorkflowFunctions({
    workspace,
    audience,
    limit,
  });
  const visiblePipeline = compact ? pipeline.slice(0, 4) : pipeline;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[#07111f] text-white shadow-[0_28px_90px_rgba(2,10,24,0.24)]">
      <div className="grid gap-0 xl:grid-cols-[0.86fr_1.14fr]">
        <div className="border-b border-white/10 p-6 lg:p-8 xl:border-b-0 xl:border-r">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">
            <Gauge className="h-4 w-4" />
            Enterprise workflow OS
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight lg:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300">
            {description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <WorkflowMetric label="Functions" value={`${workflows.length}`} />
            <WorkflowMetric label="Stages" value={`${pipeline.length}`} />
            <WorkflowMetric label="Systems" value="Connected" />
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Operating model
            </p>
            <div className="mt-4 grid gap-2">
              {visiblePipeline.map((stage, index) => (
                <div
                  key={stage}
                  className="grid grid-cols-[36px_1fr_auto] items-center gap-3 rounded-[1rem] bg-white/[0.05] px-3 py-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-white">{stage}</span>
                  <span className="text-xs text-white/45">
                    {workflows[index % Math.max(workflows.length, 1)]?.signal || "Live control"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="grid gap-4 lg:grid-cols-2">
            {workflows.map((workflow, index) => {
              const Icon = iconMap[workflow.iconKey] || ClipboardList;

              return (
                <motion.article
                  key={workflow.key}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.035 }}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="rounded-2xl bg-white/10 p-3 text-orange-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                        {workflow.owner} / {workflow.cadence}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-white">
                        {workflow.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {workflow.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {workflow.lanes.slice(0, 5).map((lane) => (
                      <span
                        key={lane}
                        className="rounded-full bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70"
                      >
                        {lane}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {workflow.metrics.slice(0, 4).map((metric) => (
                      <div
                        key={metric}
                        className="rounded-[1rem] border border-white/10 bg-slate-950/35 px-3 py-2 text-xs text-slate-300"
                      >
                        {metric}
                      </div>
                    ))}
                  </div>

                  <Link
                    href={workflow.route}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  >
                    Open workflow
                  </Link>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Connected systems
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from(new Set(workflows.flatMap((workflow) => workflow.systems)))
                .slice(0, compact ? 10 : 18)
                .map((system) => (
                  <span
                    key={system}
                    className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/70"
                  >
                    {system}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkflowMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-white/10 bg-white/[0.06] px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
