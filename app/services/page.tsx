"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, MapPin, Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import ServiceCatalogDirectory from "@/app/components/services/ServiceCatalogDirectory";
import { operatingCities, serviceCatalog } from "@/lib/serviceCatalog";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

export default function ServicesPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const totalCategories = serviceCatalog.length;
  const totalSubcategories = useMemo(
    () => serviceCatalog.reduce((sum, service) => sum + service.subcategories.length, 0),
    []
  );

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
    <div className="public-shell overflow-x-hidden text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="public-hero-glow absolute inset-x-0 top-0 h-[26rem]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">
            <motion.div {...reveal} className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Services
              </p>

              <h1 className="mt-4 display-font text-5xl leading-tight text-slate-950 md:text-6xl">
                Service Directory
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Browse services by category, review the available subcategories,
                and move directly into the required task page.
              </p>
            </motion.div>

            <motion.div
              {...reveal}
              className="surface-panel rounded-[2.2rem] border border-slate-200 p-6"
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Search
                  </p>
                  <div className="relative mt-4">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search AC, plumbing, cleaning, appliance..."
                      className="w-full rounded-full border border-slate-200 bg-slate-50 px-11 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {[
                    [`${totalCategories}`, "categories"],
                    [`${totalSubcategories}+`, "subcategories"],
                    [`${filteredServices.length}`, "visible results"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-2xl font-semibold text-slate-950">{value}</p>
                      <p className="mt-1 text-sm text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <p className="text-sm font-semibold text-slate-950">Service cities</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {operatingCities.map((city) => (
                    <span
                      key={city}
                      className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Categories and tasks
            </p>
            <h2 className="mt-3 display-font text-4xl text-slate-950">
              Service categories with direct subcategory access
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Open the category page for detail or use the plus actions to start
            building a booking directly from the directory.
          </p>
        </div>

        <div className="mt-10">
          <ServiceCatalogDirectory
            services={filteredServices}
            subcategoriesPerCard={5}
            variant="catalog"
          />
        </div>

        {!filteredServices.length && (
          <div className="surface-panel mt-10 rounded-[2rem] border border-slate-200 p-8 text-center">
            <h3 className="text-2xl font-semibold text-slate-950">
              No matching service found
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Try another keyword like plumbing, purifier, wardrobe, or CCTV.
            </p>
          </div>
        )}
      </section>

      <section className="border-t border-slate-200/80 bg-white/60">
        <div className="mx-auto flex max-w-7xl justify-center px-6 py-10 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
          >
            Back to homepage
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
