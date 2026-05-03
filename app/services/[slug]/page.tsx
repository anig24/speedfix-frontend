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
  ShieldCheck,
  Star,
} from "lucide-react";
import ServiceConfigurator from "@/app/components/services/ServiceConfigurator";
import { getServicePresentation } from "@/app/components/services/servicePresentation";
import { getServiceBySlug } from "@/lib/serviceCatalog";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export default function ServiceCategoryPage() {
  const params = useParams<{ slug: string }>();
  const service = getServiceBySlug(String(params.slug || ""));

  if (!service) {
    return (
      <div className="bg-[#f6efe4] px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center premium-card">
          <h1 className="text-3xl font-semibold text-slate-950">
            Service not found
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            This category is not available yet. Browse the full services catalog
            to continue exploring.
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

  const presentation = getServicePresentation(service.slug, service.image);
  const ServiceIcon = presentation.icon;

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
                <span className="text-slate-900">{service.name}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/85 px-4 py-2 text-sm text-slate-700">
                <ServiceIcon className="h-4 w-4 text-orange-500" />
                Category overview
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {service.name}
                </p>
                <h1 className="mt-3 display-font text-5xl leading-tight text-slate-950 md:text-6xl">
                  {service.tagline}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                  {service.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 premium-card">
                  <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                  {service.rating}
                </span>
                <span className="rounded-full bg-white px-4 py-2 premium-card">
                  {service.reviews}
                </span>
                <span className="rounded-full bg-white px-4 py-2 premium-card">
                  {service.jobsCompleted}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 premium-card">
                  <Clock3 className="h-4 w-4 text-orange-500" />
                  {service.responseTime}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.8rem] border border-slate-200 bg-white p-5 premium-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Coverage
                  </p>
                  <p className="mt-3 text-lg font-semibold text-slate-950">
                    {service.coverage}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Open the subcategory you need, compare package levels, and
                    move into booking without losing context.
                  </p>
                </div>

                <div className="rounded-[1.8rem] border border-slate-200 bg-slate-950 p-5 text-white premium-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Current offer
                  </p>
                  <p className="mt-3 text-lg font-semibold">{service.offer}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Add the right package to cart here, or drill down into a
                    specific subcategory before checkout.
                  </p>
                </div>
              </div>

              <div className="relative h-[24rem] overflow-hidden rounded-[2rem] premium-card">
                <Image
                  src={presentation.image}
                  alt={`${service.name} category visual`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                  {service.subcategories.slice(0, 4).map((subcategory) => (
                    <Link
                      key={subcategory.slug}
                      href={`/services/${service.slug}/${subcategory.slug}`}
                      className="rounded-full bg-white/92 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-800"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div {...reveal} className="lg:sticky lg:top-24">
              <ServiceConfigurator service={service} />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Subcategories
            </p>
            <h2 className="mt-3 display-font text-4xl text-slate-950">
              Choose the exact task you want to book
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Each subcategory opens its own page with better context, included
            items, problem signals, recommended package, and a working cart flow.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {service.subcategories.map((subcategory) => (
            <motion.article
              key={subcategory.slug}
              {...reveal}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 premium-card"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {subcategory.turnaround}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                    {subcategory.name}
                  </h3>
                </div>
                <div className="rounded-full bg-[#fff2df] px-3 py-2 text-sm font-semibold text-orange-700">
                  Rs. {subcategory.starterPrice}+
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {subcategory.description}
              </p>

              <div className="mt-5 space-y-2">
                {subcategory.highlights.slice(0, 3).map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-2 text-sm leading-6 text-slate-600"
                  >
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {highlight}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {subcategory.problemSignals.slice(0, 2).map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700"
                  >
                    {signal}
                  </span>
                ))}
              </div>

              <Link
                href={`/services/${service.slug}/${subcategory.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open subcategory
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white/70">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {service.packages.map((pkg) => (
              <motion.article
                key={pkg.name}
                {...reveal}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {pkg.turnaround}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                      {pkg.name}
                    </h3>
                  </div>
                  <div className="rounded-full bg-slate-950 px-3 py-2 text-sm font-semibold text-white">
                    Rs. {pkg.price}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {pkg.description}
                </p>

                <div className="mt-5 space-y-2">
                  {pkg.checklist.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-sm leading-6 text-slate-600"
                    >
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-[2.2rem] bg-slate-950 px-8 py-10 text-white premium-card md:px-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Ready to book
              </p>
              <h2 className="mt-3 display-font text-4xl">
                Add this service to cart now or drill into a task first
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                The full checkout flow supports address entry, coupon
                application, payment method selection, and Razorpay payment.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                View cart
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/services/${service.slug}/${service.subcategories[0]?.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30"
              >
                Explore top subcategory
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
