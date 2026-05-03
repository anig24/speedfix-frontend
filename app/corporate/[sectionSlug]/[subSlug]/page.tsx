import { notFound } from "next/navigation";
import CorporateWorkflowBoard from "@/app/components/corporate/CorporateWorkflowBoard";
import EmployeeAccessManager from "@/app/components/hr/EmployeeAccessManager";
import { cleanCopy } from "@/lib/cleanCopy";
import { getCorporateSubcategory } from "@/lib/corporatePortal";

export default async function CorporateSubcategoryPage({
  params,
}: {
  params: Promise<{ sectionSlug: string; subSlug: string }>;
}) {
  const { sectionSlug, subSlug } = await params;
  const result = getCorporateSubcategory(sectionSlug, subSlug);

  if (!result) {
    notFound();
  }

  const { section, subcategory } = result;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          {cleanCopy(section.title)} / {cleanCopy(subcategory.title)}
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-slate-950">
          {cleanCopy(subcategory.summary)}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600">
          {cleanCopy(subcategory.description)}
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Responsibilities
          </p>
          <div className="mt-5 space-y-3">
            {subcategory.responsibilities.map((item) => (
              <div
                key={item}
                className="rounded-[1.2rem] bg-slate-50 px-4 py-3 text-sm text-slate-600"
              >
                {cleanCopy(item)}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Insights
          </p>
          <div className="mt-5 space-y-3">
            {subcategory.insights.map((item) => (
              <div
                key={item}
                className="rounded-[1.2rem] bg-slate-50 px-4 py-3 text-sm text-slate-600"
              >
                {cleanCopy(item)}
              </div>
            ))}
          </div>
        </article>
      </section>

      <CorporateWorkflowBoard
        sectionSlug={section.slug}
        subSlug={subcategory.slug}
        title={cleanCopy(subcategory.title)}
        quickActions={subcategory.quickActions.map(cleanCopy)}
      />

      {section.slug === "hr" && subcategory.slug === "access-control" && (
        <EmployeeAccessManager />
      )}
    </div>
  );
}
