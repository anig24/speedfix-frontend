import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  workspaceBlueprints,
  workspaceNavigation,
} from "@/lib/workspaceCatalog";
import { type WorkspaceKey } from "@/lib/portalAccess";

type WorkspaceDashboardProps = {
  workspace: WorkspaceKey;
};

export default function WorkspaceDashboard({
  workspace,
}: WorkspaceDashboardProps) {
  const blueprint = workspaceBlueprints[workspace];
  const currentWorkspace = workspaceNavigation.find((item) => item.key === workspace);

  if (!currentWorkspace) {
    return null;
  }

  const founderLinks = workspaceNavigation.filter(
    (item) => workspace === "founder" && item.key !== "founder"
  );

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 premium-card">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          {blueprint.badge}
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-slate-950">
          {blueprint.title}
        </h2>
        <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-600">
          {blueprint.description}
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {blueprint.stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-[1.8rem] border border-slate-200 bg-white p-6 premium-card"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {stat.label}
            </p>
            <h3 className="mt-4 text-3xl font-semibold text-slate-950">
              {stat.value}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{stat.hint}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Quick actions
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">
              Open the right path without touching legacy pages
            </h3>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Every action below links into a real route so teams can move from
            overview to daily execution immediately.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {blueprint.actions.map((action) => (
            <Link
              key={action.href + action.label}
              href={action.href}
              className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white"
            >
              <h4 className="text-lg font-semibold text-slate-950">
                {action.label}
              </h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {action.note}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                Open now
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {founderLinks.length > 0 && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            All-access portals
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {founderLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white"
                >
                  <div className="inline-flex rounded-2xl bg-white p-3 text-slate-900 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-slate-950">
                    {item.shortLabel}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-2">
        {blueprint.lanes.map((lane) => (
          <article
            key={lane.title}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Daily lane
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">
              {lane.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {lane.description}
            </p>
            <div className="mt-5 space-y-3">
              {lane.items.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 rounded-[1.2rem] bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Guardrails
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {blueprint.notes.map((note) => (
            <div
              key={note}
              className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600"
            >
              {note}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
