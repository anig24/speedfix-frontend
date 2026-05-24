"use client";

import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import EnterpriseEmployeeDashboard from "@/app/components/enterprise/EnterpriseEmployeeDashboard";
import EnterpriseWorkflowManagementDashboard from "@/app/components/enterprise/EnterpriseWorkflowManagementDashboard";
import { cleanCopy } from "@/lib/cleanCopy";
import { getCorporateSubcategoriesForScope } from "@/lib/corporateWorkspaceAccess";
import { useCorporateAccess } from "@/app/components/corporate/CorporateAccessContext";

export default function CorporateRoleDashboard() {
  const { scope, sections, quickLinks } = useCorporateAccess();

  const visibleWorkflows = sections.flatMap((section) =>
    getCorporateSubcategoriesForScope(section, scope).map((subcategory) => ({
      section,
      subcategory,
    }))
  );

  return (
    <div className="space-y-8">
      <EnterpriseEmployeeDashboard
        workspace="corporate"
        fallbackLabel={scope.label}
      />

      <EnterpriseWorkflowManagementDashboard
        workspace="corporate"
        audience={scope.key === "executive" ? "founder" : "employee"}
        title={`${scope.label} Workflow Management`}
        description="A multi-function command dashboard for demand, fulfillment, people, finance, support, catalog, risk, assets, analytics, and field force work. Founder sees the full operating grid; each employee role sees the lanes they are allowed to run."
      />

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {scope.badge}
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-slate-950">
              {scope.label}
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-600">
              {scope.description}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="Assigned sections" value={`${sections.length}`} />
            <MetricCard
              label="Role workflows"
              value={`${visibleWorkflows.length}`}
            />
            <MetricCard
              label="Quick options"
              value={`${quickLinks.length}`}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <Layers3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Role sections
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-950">
                Open only the lanes assigned to this designation
              </h3>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const subcategories = getCorporateSubcategoriesForScope(
                section,
                scope
              );

              return (
                <Link
                  key={section.slug}
                  href={`/corporate/${section.slug}`}
                  className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white"
                >
                  <div className="inline-flex rounded-2xl bg-white p-3 text-slate-700 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {cleanCopy(section.eyebrow)}
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold text-slate-950">
                    {cleanCopy(section.title)}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {cleanCopy(section.description)}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {subcategories.map((subcategory) => (
                      <span
                        key={subcategory.slug}
                        className="rounded-full bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600"
                      >
                        {cleanCopy(subcategory.title)}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Workflow entry
            </p>
            <div className="mt-5 space-y-3">
              {visibleWorkflows.map(({ section, subcategory }) => (
                <Link
                  key={`${section.slug}-${subcategory.slug}`}
                  href={`/corporate/${section.slug}/${subcategory.slug}`}
                  className="flex items-center justify-between rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white"
                >
                  <div>
                    <p className="font-semibold text-slate-950">
                      {cleanCopy(subcategory.title)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {cleanCopy(section.title)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Role options
            </p>
            <div className="mt-5 space-y-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white"
                >
                  <div>
                    <p className="font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.href}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
    </article>
  );
}
