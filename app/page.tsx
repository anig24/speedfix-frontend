"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Search,
  ShieldCheck,
  ShoppingBag,
  Wrench,
} from "lucide-react";
import { useDeferredValue, useMemo, useState, useSyncExternalStore } from "react";
import LocationGate from "@/app/components/LocationGate";
import ServiceCatalogDirectory from "@/app/components/services/ServiceCatalogDirectory";
import { getServicePresentation } from "@/app/components/services/servicePresentation";
import {
  getFeaturedSubcategories,
  operatingCities,
  serviceCatalog,
} from "@/lib/serviceCatalog";
import { readStoredCity, subscribeToStoredCity } from "@/lib/locationStorage";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

export default function HomePage() {
  const city = useSyncExternalStore(subscribeToStoredCity, readStoredCity, () => "");
  const [query, setQuery] = useState("");
  const [showLocationGate, setShowLocationGate] = useState(false);
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

  const heroServices = useMemo(() => filteredServices.slice(0, 6), [filteredServices]);

  const featuredTasks = useMemo(() => {
    const tasks = getFeaturedSubcategories(6);

    if (!deferredQuery) {
      return tasks;
    }

    return tasks.filter(({ service, subcategory }) =>
      [service.name, subcategory.name, subcategory.tagline, subcategory.description]
        .join(" ")
        .toLowerCase()
        .includes(deferredQuery)
    );
  }, [deferredQuery]);

  return (
    <div className="public-shell overflow-x-hidden text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="public-hero-glow absolute inset-x-0 top-0 h-[26rem]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <motion.div {...reveal} className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700">
                <ShieldCheck className="h-4 w-4 text-orange-500" />
                Verified field teams and structured booking
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                  SpeedFix
                </p>
                <h1 className="display-font max-w-4xl text-5xl leading-tight text-slate-950 md:text-6xl">
                  Home Services
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Repairs, cleaning, maintenance, and installations through
                  category-based booking, standardized task flows, and customer support.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Browse services
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                >
                  Open cart
                  <ShoppingBag className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  [`${totalCategories}`, "service categories"],
                  [`${totalSubcategories}+`, "task options"],
                  [`${operatingCities.length}`, "service cities"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="surface-panel rounded-[1.8rem] border border-slate-200 p-5"
                  >
                    <p className="display-font text-4xl text-slate-950">{value}</p>
                    <p className="mt-2 text-sm text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              {...reveal}
              className="surface-panel rounded-[2.25rem] border border-slate-200 p-6"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Search and booking
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                      Find the right category and task
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Search services, select the required category, and open the exact task page.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowLocationGate(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
                  >
                    <MapPin className="h-4 w-4 text-orange-500" />
                    {city || "Choose city"}
                  </button>
                </div>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search AC repair, leak fix, deep cleaning..."
                    className="w-full rounded-full border border-slate-200 bg-slate-50 px-11 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {heroServices.map((service) => {
                    const presentation = getServicePresentation(service.slug, service.image);
                    const ServiceIcon = presentation.icon;

                    return (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="rounded-[1.35rem] border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${presentation.iconWrap}`}
                            >
                              <ServiceIcon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-950">
                                {service.name}
                              </p>
                              <p className="mt-1 truncate text-xs text-slate-500">
                                {service.tagline}
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 text-xs font-semibold text-slate-500">
                            Rs. {service.basePrice}+
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/80 bg-white/70">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Why SpeedFix
              </p>
              <h2 className="mt-3 display-font text-4xl text-slate-950">
                Standardized service delivery
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              The customer journey is organized around category discovery, task selection,
              booking support, and field execution.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Category-based booking",
                text: "Customers begin with the required service category and move into the exact task.",
              },
              {
                title: "Verified field teams",
                text: "Service delivery is aligned to assigned professionals and controlled workflows.",
              },
              {
                title: "Task-level pricing",
                text: "Task pages are structured around specific requirements and service scope.",
              },
              {
                title: "Customer support",
                text: "Booking, cart, address, and checkout remain within one connected flow.",
              },
            ].map((item) => (
              <motion.article
                key={item.title}
                {...reveal}
                className="surface-panel rounded-[2rem] border border-slate-200 p-6"
              >
                <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Categories
            </p>
            <h2 className="mt-3 display-font text-4xl text-slate-950">
              Browse categories and open the required work
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            The directory is structured to help customers identify the right category
            and proceed into the exact service task.
          </p>
        </div>

        <div className="mt-10">
          <ServiceCatalogDirectory
            services={filteredServices}
            maxItems={4}
            subcategoriesPerCard={3}
            variant="home"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
          >
            View full service directory
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white/70">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                City coverage
              </p>
              <h2 className="mt-3 display-font text-4xl text-slate-950">
                Operating cities
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Services are organized by supported city and routed through the same booking flow.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {operatingCities.map((item) => (
              <motion.div
                key={item}
                {...reveal}
                className="surface-panel rounded-[1.6rem] border border-slate-200 p-5"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <p className="text-sm font-semibold text-slate-950">{item}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Task pages
            </p>
            <h2 className="mt-3 display-font text-4xl text-slate-950">
              Common service requirements
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            These direct task pages are useful when the customer already knows the required work.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredTasks.map(({ service, subcategory }) => {
            const presentation = getServicePresentation(service.slug, service.image);
            const ServiceIcon = presentation.icon;

            return (
              <motion.article
                key={`${service.slug}-${subcategory.slug}`}
                {...reveal}
                whileHover={{ y: -6 }}
                className="surface-panel rounded-[2rem] border border-slate-200 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${presentation.iconWrap}`}
                  >
                    <ServiceIcon className="h-4 w-4" />
                    {service.name}
                  </span>
                  <span className="rounded-full bg-[#fff2df] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">
                    {subcategory.turnaround}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-semibold text-slate-950">
                  {subcategory.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {subcategory.description}
                </p>

                <div className="mt-5 space-y-2">
                  {subcategory.problemSignals.slice(0, 2).map((signal) => (
                    <div
                      key={signal}
                      className="flex items-start gap-2 text-sm leading-6 text-slate-600"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {signal}
                    </div>
                  ))}
                </div>

                <Link
                  href={`/services/${service.slug}/${subcategory.slug}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Open task page
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <motion.div
          {...reveal}
          className="dark-panel rounded-[2.25rem] px-8 py-10 text-white md:px-12 md:py-12"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Customer flow
              </p>
              <h2 className="mt-3 display-font text-4xl">
                Continue to the service directory or cart
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Service selection, cart, address collection, and checkout remain within one customer flow.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Browse services
                <Wrench className="h-4 w-4" />
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30"
              >
                Open cart
                <ShoppingBag className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {showLocationGate && <LocationGate onClose={() => setShowLocationGate(false)} />}
    </div>
  );
}
