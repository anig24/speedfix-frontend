"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDeferredValue, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { serviceCatalog } from "@/lib/serviceCatalog";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export default function ServicesPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredServices = useMemo(() => {
    if (!deferredQuery) {
      return serviceCatalog;
    }

    return serviceCatalog.filter((service) => {
      const haystack = [
        service.name,
        service.tagline,
        service.description,
        service.offer,
        ...service.searchTerms,
        ...service.subcategories.flatMap((subcategory) => [
          subcategory.name,
          subcategory.tagline,
          subcategory.description,
        ]),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(deferredQuery);
    });
  }, [deferredQuery]);

  return (
    <div className="bg-[#f6efe4] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,106,0,0.18),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.14),_transparent_34%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <motion.div {...reveal} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700">
              <Sparkles className="h-4 w-4 text-orange-500" />
              Premium categories with real subcategory pages
            </div>

            <h1 className="mt-5 display-font text-5xl leading-tight text-slate-950 md:text-6xl">
              Every category now opens into a sharper, more clickable service
              journey.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Explore premium service categories, jump into subcategories, add
              the exact package to your cart, and move to checkout without
              leaving the discovery flow.
            </p>
          </motion.div>

          <motion.div
            {...reveal}
            className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 premium-card">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Search the catalog
              </p>
              <div className="relative mt-5">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Try AC, leak, kitchen, fan, cleaning..."
                  className="w-full rounded-full border border-slate-200 bg-slate-50 px-11 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Search matches category names, task keywords, and subcategories.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["6", "premium categories"],
                ["24", "clickable subcategories"],
                ["30%", "off first booking"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 premium-card"
                >
                  <p className="display-font text-4xl text-slate-950">{value}</p>
                  <p className="mt-2 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              All services
            </p>
            <h2 className="mt-3 display-font text-4xl text-slate-950">
              Category pages with subcategory depth built in
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Every card below links to a proper category page, and every
            subcategory chip opens its own detail page with packages, add-ons,
            cart flow, and checkout.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <motion.article
              key={service.slug}
              {...reveal}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white premium-card"
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute left-5 top-5 rounded-full bg-white/92 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                  {service.offer}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-950">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {service.tagline}
                    </p>
                  </div>
                  <div className="rounded-full bg-[#fff2df] px-3 py-2 text-sm font-semibold text-orange-700">
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
                  {service.highlights.slice(0, 3).map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-2 text-sm leading-6 text-slate-600"
                    >
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {highlight}
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Subcategories
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {service.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.slug}
                        href={`/services/${service.slug}/${subcategory.slug}`}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    View category
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href={`/services/${service.slug}/${service.subcategories[0]?.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                  >
                    Open top task
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {!filteredServices.length && (
          <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 text-center premium-card">
            <h3 className="text-2xl font-semibold text-slate-950">
              No matching service found
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Try another keyword like plumbing, jet cleaning, kitchen, or fan.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
