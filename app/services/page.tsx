import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ChevronRight, Star } from "lucide-react";
import { serviceCatalog } from "@/lib/serviceCatalog";

export default function ServicesPage() {
  return (
    <div className="bg-[#f6efe4] text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Service catalog
        </p>
        <h1 className="mt-3 display-font text-5xl text-slate-950">
          Browse every home service category in one place.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          These pages now share the same catalog used by the homepage request
          form and the backend intake API, so pricing, copy and service slugs
          stay aligned.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-20 lg:grid-cols-2 lg:px-8 xl:grid-cols-3">
        {serviceCatalog.map((service) => (
          <article
            key={service.slug}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)]"
          >
            <div className="relative h-56 overflow-hidden">
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    {service.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {service.tagline}
                  </p>
                </div>

                <div className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                  Rs. {service.basePrice}+
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                  {service.rating}
                </span>
                <span>{service.reviews}</span>
                <span>{service.jobsCompleted}</span>
              </div>

              <div className="mt-5 space-y-2">
                {service.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {highlight}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View service
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/#lead-form"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  Quick request
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
