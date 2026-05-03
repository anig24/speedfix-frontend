"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, Plus, Star } from "lucide-react";
import { quickAddServiceToCart } from "@/lib/serviceQuickAdd";
import type { ServiceCatalogItem, ServiceSubcategory } from "@/lib/serviceCatalog";
import { getServicePresentation } from "@/app/components/services/servicePresentation";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

type ServiceCatalogDirectoryProps = {
  services: ServiceCatalogItem[];
  maxItems?: number;
  subcategoriesPerCard?: number;
  variant?: "home" | "catalog";
};

export default function ServiceCatalogDirectory({
  services,
  maxItems,
  subcategoriesPerCard = 5,
  variant = "catalog",
}: ServiceCatalogDirectoryProps) {
  const [noticeKey, setNoticeKey] = useState("");
  const visibleServices = maxItems ? services.slice(0, maxItems) : services;
  const isHomeVariant = variant === "home";

  const handleQuickAdd = (
    service: ServiceCatalogItem,
    subcategory?: ServiceSubcategory
  ) => {
    quickAddServiceToCart(service, subcategory);
    const key = `${service.slug}:${subcategory?.slug || "category"}`;
    setNoticeKey(key);

    window.setTimeout(() => {
      setNoticeKey((current) => (current === key ? "" : current));
    }, 1800);
  };

  return (
    <div
      className={
        isHomeVariant
          ? "grid gap-5 xl:grid-cols-2"
          : "grid gap-5 xl:grid-cols-2"
      }
    >
      {visibleServices.map((service) => {
        const presentation = getServicePresentation(service.slug, service.image);
        const ServiceIcon = presentation.icon;

        if (isHomeVariant) {
          return (
            <motion.article
              key={service.slug}
              {...reveal}
              whileHover={{ y: -8 }}
              className={`overflow-hidden rounded-[1.9rem] border bg-white shadow-[0_22px_65px_rgba(15,23,42,0.06)] ${presentation.border} group/service`}
            >
              <div className="relative h-72 overflow-hidden bg-slate-100">
                <Image
                  src={service.image}
                  alt={`${service.name} service team`}
                  fill
                  sizes="(max-width: 1280px) 100vw, 50vw"
                  className={`object-cover transition duration-700 group-hover/service:scale-105 ${presentation.imagePosition}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/38 via-slate-950/4 to-transparent" />
                <div
                  className={`absolute left-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/94 shadow-[0_10px_30px_rgba(15,23,42,0.12)] ${presentation.iconWrap}`}
                >
                  <ServiceIcon className="h-5 w-5" />
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(service)}
                  className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/94 text-slate-700 transition hover:border-slate-300 hover:bg-white"
                  aria-label={`Add ${service.name} to cart`}
                >
                  {noticeKey === `${service.slug}:category` ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
                <span
                  className={`absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${presentation.iconWrap}`}
                >
                  <ServiceIcon className="h-4 w-4" />
                  Category
                </span>
                <div className="absolute bottom-4 right-4 rounded-[1.2rem] border border-white/55 bg-white/88 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    SpeedFix crew
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {service.name}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[1.6rem] font-semibold text-slate-950">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {service.tagline}
                    </p>
                  </div>
                  <div className="rounded-full bg-[#fff2df] px-3 py-2 text-sm font-semibold text-orange-700">
                    Rs. {service.basePrice}+
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                    {service.rating}
                  </span>
                  <span>{service.responseTime}</span>
                </div>

                <div className="mt-5 rounded-[1.45rem] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Subcategories
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Open the exact task directly from the category.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {service.subcategories
                      .slice(0, subcategoriesPerCard)
                      .map((subcategory) => {
                        const subcategoryKey = `${service.slug}:${subcategory.slug}`;

                        return (
                          <motion.div
                            key={subcategory.slug}
                            className="flex min-h-[92px] items-center gap-3 rounded-[1.1rem] border border-slate-200 bg-white px-3 py-3"
                            whileHover={{ x: 4 }}
                          >
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/services/${service.slug}/${subcategory.slug}`}
                                className="block text-sm font-semibold leading-5 text-slate-900 transition hover:text-orange-600"
                              >
                                {subcategory.name}
                              </Link>
                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                Rs. {subcategory.starterPrice}+ | {subcategory.turnaround}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleQuickAdd(service, subcategory)}
                              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                              aria-label={`Add ${subcategory.name} to cart`}
                            >
                              {noticeKey === subcategoryKey ? (
                                <Check className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </button>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    View category
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {service.subcategories[0] && (
                    <Link
                      href={`/services/${service.slug}/${service.subcategories[0].slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                    >
                      Open top task
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.article>
          );
        }

        return (
          <motion.article
            key={service.slug}
            {...reveal}
            whileHover={{ y: -8 }}
            className={`overflow-hidden rounded-[1.75rem] border bg-white shadow-[0_22px_65px_rgba(15,23,42,0.06)] ${
              presentation.border
            } group/service`}
          >
            <div
              className={`grid gap-4 bg-gradient-to-br ${presentation.tint} p-4 lg:grid-cols-[280px_1fr]`}
            >
              <div className="flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${presentation.iconWrap}`}
                  >
                    <ServiceIcon className="h-4 w-4" />
                    Category
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(service)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    aria-label={`Add ${service.name} to cart`}
                  >
                    {noticeKey === `${service.slug}:category` ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="text-[1.45rem] font-semibold text-slate-950">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {service.tagline}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                    {service.rating}
                  </span>
                  <span>{service.responseTime}</span>
                </div>

                <div
                  className="relative h-72 overflow-hidden rounded-[1.35rem] border border-white/80 bg-white/70"
                >
                  <Image
                    src={service.image}
                    alt={`${service.name} service team`}
                    fill
                    sizes="280px"
                    className={`object-cover transition duration-700 group-hover/service:scale-105 ${presentation.imagePosition}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-950/10 to-transparent" />
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    className={`absolute left-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/92 shadow-[0_10px_30px_rgba(15,23,42,0.12)] ${presentation.iconWrap}`}
                  >
                    <ServiceIcon className="h-5 w-5" />
                  </motion.div>
                </div>
              </div>

              <div className="rounded-[1.45rem] border border-white/80 bg-white/88 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Subcategories
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Choose the exact task and add it directly from here.
                    </p>
                  </div>
                  <div className="rounded-full bg-[#fff2df] px-3 py-2 text-sm font-semibold text-orange-700">
                    Rs. {service.basePrice}+
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {service.subcategories
                    .slice(0, subcategoriesPerCard)
                    .map((subcategory) => {
                      const subcategoryKey = `${service.slug}:${subcategory.slug}`;

                      return (
                        <motion.div
                          key={subcategory.slug}
                          className="flex min-h-[92px] items-center gap-3 rounded-[1.1rem] border border-slate-200 bg-slate-50 px-3 py-3"
                          whileHover={{ x: 4 }}
                        >
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/services/${service.slug}/${subcategory.slug}`}
                              className="block text-sm font-semibold leading-5 text-slate-900 transition hover:text-orange-600"
                            >
                              {subcategory.name}
                            </Link>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              Rs. {subcategory.starterPrice}+ | {subcategory.turnaround}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(service, subcategory)}
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                            aria-label={`Add ${subcategory.name} to cart`}
                          >
                            {noticeKey === subcategoryKey ? (
                              <Check className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </button>
                        </motion.div>
                      );
                    })}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    View category
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {service.subcategories[0] && (
                    <Link
                      href={`/services/${service.slug}/${service.subcategories[0].slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                    >
                      Open top task
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
