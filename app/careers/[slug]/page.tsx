"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { useCareerPostingAccess } from "@/app/components/careers/useCareerPostingAccess";
import { getCareerRoleBySlug } from "@/lib/careersCatalog";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export default function CareerRolePage() {
  const params = useParams<{ slug: string }>();
  const role = getCareerRoleBySlug(String(params.slug || ""));
  const { isAuthorized } = useCareerPostingAccess();

  if (!role) {
    return (
      <div className="bg-[#f6efe4] px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center premium-card">
          <h1 className="text-3xl font-semibold text-slate-950">
            Role not found
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            This role is not available anymore. Browse the careers page to see
            the current openings.
          </p>
          <Link
            href="/careers"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to careers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6efe4] text-slate-900">
      <section className="border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <motion.div {...reveal} className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="transition hover:text-slate-900">
                Home
              </Link>
              <span>/</span>
              <Link href="/careers" className="transition hover:text-slate-900">
                Careers
              </Link>
              <span>/</span>
              <span className="text-slate-900">{role.title}</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                {role.team}
              </span>
              <span className="rounded-full bg-[#fff2df] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                {role.employmentType}
              </span>
            </div>

            <h1 className="mt-5 display-font text-5xl leading-tight text-slate-950 md:text-6xl">
              {role.title}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {role.overview}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 premium-card">
                <Building2 className="h-4 w-4 text-orange-500" />
                {role.team}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 premium-card">
                <MapPin className="h-4 w-4 text-orange-500" />
                {role.location}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_0.9fr]">
          <motion.article
            {...reveal}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card"
          >
            <h2 className="display-font text-4xl text-slate-950">
              Responsibilities
            </h2>
            <div className="mt-6 space-y-3">
              {role.responsibilities.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            {...reveal}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card"
          >
            <h2 className="display-font text-4xl text-slate-950">
              Requirements
            </h2>
            <div className="mt-6 space-y-3">
              {role.requirements.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            {...reveal}
            className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white premium-card"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
              Perks
            </p>
            <div className="mt-5 space-y-3">
              {role.perks.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] bg-white/5 px-4 py-3 text-sm leading-7 text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3">
              {isAuthorized && (
                <Link
                  href="/careers/posting"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Post a role
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <a
                href={`mailto:careers@speedfix.co.in?subject=${encodeURIComponent(role.title)}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30"
              >
                Contact careers
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.article>
        </div>
      </section>
    </div>
  );
}
