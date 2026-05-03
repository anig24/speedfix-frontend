"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Building2, MapPin } from "lucide-react";
import { useCareerPostingAccess } from "@/app/components/careers/useCareerPostingAccess";
import { careerRoles } from "@/lib/careersCatalog";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export default function CareersPage() {
  const { isAuthorized } = useCareerPostingAccess();

  return (
    <div className="public-shell text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="public-hero-glow absolute inset-x-0 top-0 h-[32rem]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <motion.div {...reveal} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700">
              <BriefcaseBusiness className="h-4 w-4 text-orange-500" />
              Careers at SpeedFix
            </div>

            <h1 className="mt-5 display-font text-5xl leading-tight text-slate-950 md:text-6xl">
              Careers
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              We are hiring across operations, support, and growth. Browse open
              roles or post a hiring requirement directly from the careers
              section.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#open-roles"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Browse roles
                <ArrowRight className="h-4 w-4" />
              </Link>
              {isAuthorized && (
                <Link
                  href="/careers/posting"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                >
                  Post a role
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div
            {...reveal}
            className="mt-10 grid gap-4 sm:grid-cols-3"
          >
            {[
              ["3", "active roles"],
              ["3", "core teams hiring"],
              ["1", "job-posting page live"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="surface-panel rounded-[2rem] border border-slate-200 p-6"
              >
                <p className="display-font text-4xl text-slate-950">{value}</p>
                <p className="mt-2 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="open-roles" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Open roles
            </p>
            <h2 className="mt-3 display-font text-4xl text-slate-950">
              Every role opens into a proper detail page
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Role cards are fully clickable, and HR or recruiter accounts can
            access the posting desk after sign-in.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {careerRoles.map((role) => (
            <motion.article
              key={role.slug}
              {...reveal}
              className="surface-panel lift-card rounded-[2rem] border border-slate-200 p-6"
            >
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-700">
                  {role.team}
                </span>
                <span className="rounded-full bg-[#fff2df] px-3 py-2 text-orange-700">
                  {role.employmentType}
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-semibold text-slate-950">
                {role.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {role.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-orange-500" />
                  {role.team}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  {role.location}
                </span>
              </div>

              <Link
                href={`/careers/${role.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View role
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white/70">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Operate at scale",
                text: "Work on real marketplace operations, service quality, and category growth.",
              },
              {
                title: "Move faster",
                text: "We like shipping practical improvements that customers can feel quickly.",
              },
              {
                title: "Own outcomes",
                text: "Roles are designed for people who want responsibility, not just tasks.",
              },
            ].map((item) => (
              <motion.article
                key={item.title}
                {...reveal}
                className="surface-panel rounded-[2rem] border border-slate-200 p-6"
              >
                <h3 className="text-2xl font-semibold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
