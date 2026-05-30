"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Clock3,
  Star,
  TriangleAlert,
} from "lucide-react";
import ServiceConfigurator from "@/app/components/services/ServiceConfigurator";
import { getServicePresentation } from "@/app/components/services/servicePresentation";
import { getServiceSubcategory } from "@/lib/serviceCatalog";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export default function ServiceSubcategoryPage() {
  const params = useParams<{ slug: string; subslug: string }>();
  const result = getServiceSubcategory(
    String(params.slug || ""),
    String(params.subslug || "")
  );

  if (!result) {
    return (
      <div className="bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center premium-card">
          <h1 className="text-3xl font-semibold text-slate-950">
            Subcategory not found
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            This task page is not available right now. Browse the service
            category to choose another option.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const { service, subcategory } = result;
  const recommendedPackage =
    service.packages.find((pkg) => pkg.name === subcategory.recommendedPackage) ||
    service.packages[0];
  const presentation = getServicePresentation(
    `${service.slug} ${subcategory.slug} ${subcategory.name}`,
    service.image
  );
  const ServiceIcon = presentation.icon;

  return (
    <div className="bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,106,0,0.08),_transparent_44%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div {...reveal} className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <Link href="/" className="transition hover:text-slate-900">
                  Home
                </Link>
                <span>/</span>
                <Link href="/services" className="transition hover:text-slate-900">
                  Services
                </Link>
                <span>/</span>
                <Link
                  href={`/services/${service.slug}`}
                  className="transition hover:text-slate-900"
                >
                  {service.name}
                </Link>
                <span>/</span>
                <span className="text-slate-900">{subcategory.name}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/85 px-4 py-2 text-sm text-slate-700">
                <ServiceIcon className="h-4 w-4 text-orange-500" />
                Task detail
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {service.name} / {subcategory.name}
                </p>
                <h1 className="mt-3 display-font text-5xl leading-tight text-slate-950 md:text-6xl">
                  {subcategory.tagline}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                  {subcategory.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 premium-card">
                  <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                  {service.rating}
                </span>
                <span className="rounded-full bg-white px-4 py-2 premium-card">
                  Starts at Rs. {subcategory.starterPrice}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 premium-card">
                  <Clock3 className="h-4 w-4 text-orange-500" />
                  {subcategory.turnaround}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.8rem] border border-slate-200 bg-white p-5 premium-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Recommended package
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                    {recommendedPackage.name}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {recommendedPackage.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#fff2df] px-3 py-2 text-xs font-semibold text-orange-700">
                      Rs. {recommendedPackage.price}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                      {recommendedPackage.turnaround}
                    </span>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-[#FF6A00]/20 bg-[#fff7ef] p-5 premium-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF6A00]">
                    Best when
                  </p>
                  <div className="mt-4 space-y-2">
                    {subcategory.problemSignals.map((signal) => (
                      <div
                        key={signal}
                        className="flex items-start gap-2 text-sm leading-6 text-slate-700"
                      >
                        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                        {signal}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 premium-card">
                <div className="relative h-[23rem] overflow-hidden rounded-[1.55rem] bg-slate-100">
                  <Image
                    src={presentation.image}
                    alt={`${subcategory.name} service visual`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                </div>

                <div className="mt-3 rounded-[1.35rem] border border-[#FF6A00]/20 bg-[#fff7ef] p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-[#07111F]">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6A00] opacity-30" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF6A00]" />
                      </span>
                      Verified SpeedFix crew
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6A00]">
                      Live task status
                    </p>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Included in this task
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {subcategory.included.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div {...reveal} className="lg:sticky lg:top-24">
              <ServiceConfigurator service={service} subcategory={subcategory} />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <motion.article
            {...reveal}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Included
            </p>
            <h2 className="mt-3 display-font text-4xl text-slate-950">
              What the service visit covers
            </h2>
            <div className="mt-6 space-y-3">
              {subcategory.included.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 text-sm leading-7 text-slate-600"
                >
                  <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            {...reveal}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Why customers pick this
            </p>
            <h2 className="mt-3 display-font text-4xl text-slate-950">
              Premium task-specific clarity
            </h2>
            <div className="mt-6 space-y-3">
              {subcategory.highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 text-sm leading-7 text-slate-600"
                >
                  <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </motion.article>
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white/70">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Other tasks in {service.name}
              </p>
              <h2 className="mt-3 display-font text-4xl text-slate-950">
                Continue exploring within this category
              </h2>
            </div>
            <Link
              href={`/services/${service.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Back to {service.name}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {service.subcategories
              .filter((item) => item.slug !== subcategory.slug)
              .map((item) => (
                <motion.article
                  key={item.slug}
                  {...reveal}
                  className="rounded-[2rem] border border-slate-200 bg-white p-5 premium-card"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {item.turnaround}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                    {item.name}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                  <Link
                    href={`/services/${service.slug}/${item.slug}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Open task
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.article>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
