import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { cleanCopy } from "@/lib/cleanCopy";
import { getCorporateSectionBySlug } from "@/lib/corporatePortal";

export default async function CorporateSectionPage({
  params,
}: {
  params: Promise<{ sectionSlug: string }>;
}) {
  const { sectionSlug } = await params;
  const section = getCorporateSectionBySlug(sectionSlug);

  if (!section) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          {cleanCopy(section.eyebrow)}
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-slate-950">
          {cleanCopy(section.title)}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600">
          {cleanCopy(section.description)}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {section.summaryStats.map((stat) => (
            <span
              key={stat}
              className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
            >
              {cleanCopy(stat)}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {section.subcategories.map((subcategory) => (
          <article
            key={subcategory.slug}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Workflow lane
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">
              {cleanCopy(subcategory.title)}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {cleanCopy(subcategory.description)}
            </p>

            <div className="mt-5 space-y-2">
              {subcategory.responsibilities.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] bg-slate-50 px-4 py-3 text-sm text-slate-600"
                >
                  {cleanCopy(item)}
                </div>
              ))}
            </div>

            <Link
              href={`/corporate/${section.slug}/${subcategory.slug}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open workflow
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
