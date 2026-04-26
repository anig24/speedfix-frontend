"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDeferredValue, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import LocationGate from "@/app/components/LocationGate";
import {
  getFeaturedSubcategories,
  operatingCities,
  serviceCatalog,
} from "@/lib/serviceCatalog";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

export default function HomePage() {
  const [city, setCity] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("city") || "" : ""
  );
  const [query, setQuery] = useState("");
  const [showLocationGate, setShowLocationGate] = useState(false);
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

  const featuredTasks = useMemo(() => {
    const tasks = getFeaturedSubcategories(8);

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

  const syncLocation = () => {
    setCity(localStorage.getItem("city") || "");
    setShowLocationGate(false);
  };

  return (
    <div className="bg-[#f6efe4] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="hero-grid absolute inset-0 opacity-80" />
        <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,106,0,0.22),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.16),_transparent_36%)]" />
        <div className="absolute left-[8%] top-32 hidden h-28 w-28 rounded-full bg-orange-200/50 blur-3xl lg:block" />
        <div className="absolute right-[10%] top-20 hidden h-40 w-40 rounded-full bg-slate-300/30 blur-3xl lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-14 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <motion.div {...reveal} className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700">
                <Sparkles className="h-4 w-4 text-orange-500" />
                Premium home services with cart, checkout, and task pages
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                  SpeedFix premium marketplace
                </p>
                <h1 className="display-font max-w-4xl text-5xl leading-tight text-slate-950 md:text-6xl lg:text-[4.8rem]">
                  Premium home service booking for every room, repair, and routine.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Browse categories, open subcategories, add the exact package to
                  your cart, enter your address, apply `WELCOME30`, and complete
                  checkout with Razorpay or pay-after-service.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Explore services
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
                  ["24", "subcategories live"],
                  ["30%", "off first booking"],
                  ["2", "payment options"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-[1.9rem] border border-white/80 bg-white/85 p-5 premium-card"
                  >
                    <p className="display-font text-4xl text-slate-950">{value}</p>
                    <p className="mt-2 text-sm text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white/88 p-5 premium-card">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Service area
                    </p>
                    <p className="text-sm text-slate-500">
                      Booking for {city || "your city"} with premium task pages.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLocationGate(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
                  >
                    <MapPin className="h-4 w-4 text-orange-500" />
                    {city || "Choose location"}
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {operatingCities.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[#fff2df] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div {...reveal} className="relative lg:pl-4">
              <div className="float-slow absolute -left-4 top-10 hidden h-24 w-24 rounded-full border border-white/60 bg-white/60 lg:block" />
              <div className="float-delayed absolute right-8 top-2 hidden h-16 w-16 rounded-full border border-white/60 bg-[#fff2df]/80 lg:block" />

              <div className="overflow-hidden rounded-[2.4rem] border border-slate-200 bg-slate-950 p-1 premium-card">
                <div className="soft-gradient rounded-[2.2rem] p-6 sm:p-7">
                  <div className="rounded-[1.8rem] bg-slate-950 px-5 py-4 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                          First booking offer
                        </p>
                        <h2 className="mt-2 display-font text-4xl">WELCOME30</h2>
                      </div>
                      <div className="offer-shimmer rounded-full border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                        30% off
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-300">
                      Add any category to cart, enter your address at checkout,
                      and apply the coupon to unlock your first-booking discount.
                    </p>
                  </div>

                  <div className="mt-5 rounded-[1.8rem] border border-slate-200 bg-white p-5">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search AC repair, kitchen cleaning, leak..."
                        className="w-full rounded-full border border-slate-200 bg-slate-50 px-11 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                      />
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {serviceCatalog.slice(0, 4).map((service) => (
                        <Link
                          key={service.slug}
                          href={`/services/${service.slug}`}
                          className="group rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-14 w-14 overflow-hidden rounded-2xl">
                              <Image
                                src={service.image}
                                alt={service.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-950">
                                {service.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                From Rs. {service.basePrice}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 transition group-hover:text-slate-900">
                            View category
                            <ChevronRight className="h-3.5 w-3.5" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.8rem] border border-slate-200 bg-white p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Most booked
                      </p>
                      <div className="mt-4 space-y-3">
                        {featuredTasks.slice(0, 3).map(({ service, subcategory }) => (
                          <Link
                            key={subcategory.slug}
                            href={`/services/${service.slug}/${subcategory.slug}`}
                            className="flex items-center justify-between gap-3 rounded-[1.1rem] bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:bg-white"
                          >
                            <span>{subcategory.name}</span>
                            <span className="font-semibold text-slate-950">
                              Rs. {subcategory.starterPrice}+
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.8rem] border border-slate-200 bg-white p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Checkout flow
                      </p>
                      <div className="mt-4 space-y-3">
                        {[
                          "Choose service and subcategory",
                          "Add package to cart",
                          "Enter address and coupon",
                          "Pay with Razorpay or later",
                        ].map((step) => (
                          <div
                            key={step}
                            className="flex items-start gap-2 text-sm leading-6 text-slate-700"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
              Category discovery
            </p>
            <h2 className="mt-3 display-font text-4xl text-slate-950">
              Every category now carries clickable subcategories
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            This homepage now behaves more like a premium marketplace: category
            cards, task chips, working page routes, cart flow, and a stronger
            visual hierarchy.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <motion.article
              key={service.slug}
              {...reveal}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white premium-card"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute left-5 top-5 rounded-full bg-white/92 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
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

                <div className="mt-5">
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
      </section>

      <section className="border-y border-slate-200/80 bg-white/70">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Featured tasks
              </p>
              <h2 className="mt-3 display-font text-4xl text-slate-950">
                Jump straight into task-level pages
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              These cards open subcategory pages directly, so customers can move
              from a broad category into a precise problem or job type.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredTasks.map(({ service, subcategory }) => (
              <motion.article
                key={`${service.slug}-${subcategory.slug}`}
                {...reveal}
                className="rounded-[2rem] border border-slate-200 bg-white p-5 premium-card"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
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
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <motion.div {...reveal} className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              How booking works
            </p>
            <h2 className="mt-3 display-font text-4xl">
              A cleaner path from discovery to checkout
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Customers can now browse categories, compare subcategories, add
              packages to cart, and finish the booking with address and payment.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "1. Browse categories",
                text: "Open premium service cards and move into detailed subcategory pages.",
                icon: Sparkles,
              },
              {
                title: "2. Add to cart",
                text: "Select the package, add-ons, and keep building your booking.",
                icon: ShoppingBag,
              },
              {
                title: "3. Apply coupon",
                text: "Use WELCOME30 in checkout for 30% off on the first booking.",
                icon: BadgePercent,
              },
              {
                title: "4. Choose payment",
                text: "Finish with Razorpay or keep it flexible with pay-after-service.",
                icon: ShieldCheck,
              },
            ].map(({ title, text, icon: Icon }) => (
              <motion.article
                key={title}
                {...reveal}
                className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6"
              >
                <div className="inline-flex rounded-2xl bg-white/10 p-3 text-orange-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div {...reveal}>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Why this feels better
            </p>
            <h2 className="mt-3 display-font text-4xl text-slate-950">
              More premium presentation, less friction
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-slate-600">
              The new home page is discovery-led instead of feeling like a rough
              booking form. Customers can browse visually, understand what each
              category covers, and click into exact task pages before committing.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                title: "Task-level pages",
                text: "Each subcategory has its own page with context, inclusions, and cart flow.",
                icon: ChevronRight,
              },
              {
                title: "Premium visual rhythm",
                text: "Richer cards, layered hero, motion reveals, and sharper service storytelling.",
                icon: Sparkles,
              },
              {
                title: "Checkout ready",
                text: "Address form, coupon logic, payment method choice, and Razorpay all connect.",
                icon: ShieldCheck,
              },
              {
                title: "Careers live",
                text: "Open roles and job posting are now part of the public site.",
                icon: BriefcaseBusiness,
              },
            ].map(({ title, text, icon: Icon }) => (
              <motion.article
                key={title}
                {...reveal}
                className="rounded-[1.9rem] border border-slate-200 bg-white p-6 premium-card"
              >
                <div className="inline-flex rounded-2xl bg-[#fff2df] p-3 text-orange-500">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white/70">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              [
                "The category pages finally feel premium and I can jump straight to the exact task instead of guessing.",
                "Aditi Sharma",
                "Bengaluru",
              ],
              [
                "Cart plus checkout made the flow much clearer. I could pick services first and add my address later.",
                "Rohan Mehta",
                "Mumbai",
              ],
              [
                "The first-booking coupon and the subcategory pages made it feel closer to a polished consumer product.",
                "Neha Kapoor",
                "Hyderabad",
              ],
            ].map(([quote, name, cityName]) => (
              <motion.blockquote
                key={name}
                {...reveal}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card"
              >
                <p className="text-base leading-8 text-slate-700">
                  &ldquo;{quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-slate-100 pt-4">
                  <p className="font-semibold text-slate-950">{name}</p>
                  <p className="text-sm text-slate-500">{cityName}</p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <motion.div
          {...reveal}
          className="rounded-[2.25rem] bg-slate-950 px-8 py-10 text-white premium-card md:px-12 md:py-12"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Keep moving
              </p>
              <h2 className="mt-3 display-font text-4xl">
                Browse services, open careers, or go straight to cart
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                The public site now supports discovery, cart, checkout, coupons,
                and careers as one connected experience.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Browse services
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30"
              >
                Careers
                <BriefcaseBusiness className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {showLocationGate && <LocationGate onClose={syncLocation} />}
    </div>
  );
}
