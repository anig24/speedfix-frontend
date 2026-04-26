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
  Sparkles,
  Star,
  TriangleAlert,
} from "lucide-react";
import ServiceConfigurator from "@/app/components/services/ServiceConfigurator";
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
      <div className="bg-[#f6efe4] px-6 py-20 text-slate-900">
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

  return (
    <div className="bg-[#f6efe4] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,106,0,0.18),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.13),_transparent_36%)]" />

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
                <Sparkles className="h-4 w-4 text-orange-500" />
                Task page with a proper add-to-cart flow
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

                <div className="rounded-[1.8rem] border border-slate-200 bg-slate-950 p-5 text-white premium-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Best when
                  </p>
                  <div className="mt-4 space-y-2">
                    {subcategory.problemSignals.map((signal) => (
                      <div
                        key={signal}
                        className="flex items-start gap-2 text-sm leading-6 text-slate-300"
                      >
                        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                        {signal}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative h-[24rem] overflow-hidden rounded-[2rem] premium-card">
                <Image
                  src={service.image}
                  alt={subcategory.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-[1.6rem] bg-white/90 p-5">
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
