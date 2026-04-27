import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  corporateHighlights,
  corporateQuickLinks,
  corporateSections,
} from "@/lib/corporatePortal";
import { cleanCopy } from "@/lib/cleanCopy";

export default function CorporateOverviewPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Higher operations portal
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-white">
          Daily control room for leadership and higher operations
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300">
          This portal is built only for higher positions handling day-to-day
          service operations, internal control, category oversight, quality, and
          finance coordination. It intentionally does not replace your separate
          employee-management website for salary, leaves, or designation control.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {corporateHighlights.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
            >
              <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-white">
                {cleanCopy(item.title)}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {cleanCopy(item.description)}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Core sections
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {corporateSections.map((section) => {
              const Icon = section.icon;

              return (
                <Link
                  key={section.slug}
                  href={`/corporate/${section.slug}`}
                  className="rounded-[1.7rem] border border-white/10 bg-[#0c1424] p-5 transition hover:border-cyan-400/40 hover:bg-[#0d172a]"
                >
                  <div className="inline-flex rounded-2xl bg-white/5 p-3 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {cleanCopy(section.eyebrow)}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {cleanCopy(section.title)}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {cleanCopy(section.description)}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {section.summaryStats.map((stat) => (
                      <span
                        key={stat}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300"
                      >
                        {cleanCopy(stat)}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Quick entry points
          </p>
          <div className="mt-5 space-y-3">
            {corporateQuickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-[1.4rem] border border-white/10 bg-[#0c1424] px-4 py-4 text-sm text-slate-200 transition hover:border-cyan-400/40"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-cyan-300" />
                    {cleanCopy(item.title)}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
