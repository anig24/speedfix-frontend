"use client";

import { motion } from "framer-motion";
import { ArrowRight, Building2, ShieldCheck, Users2 } from "lucide-react";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export default function AboutPage() {
  return (
    <div className="public-shell text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="public-hero-glow absolute inset-x-0 top-0 h-[32rem]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <motion.div {...reveal} className="max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700">
              <Building2 className="h-4 w-4 text-orange-500" />
              About SpeedFix
            </div>

            <h1 className="mt-5 display-font text-5xl leading-tight text-slate-950 md:text-6xl">
              About SpeedFix
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              SpeedFix provides professional home services for repairs,
              cleaning, maintenance, and installations through a structured
              category and booking model.
            </p>
          </motion.div>

          <motion.div
            {...reveal}
            className="mt-10 grid gap-5 md:grid-cols-3"
          >
            {[
              ["Verified workforce", "Uniformed professionals with accountable service standards."],
              ["Operational discipline", "Clearer routing, cleaner support, and stronger follow-through."],
              ["Premium booking", "A calmer, more reliable customer flow from category to completion."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="surface-panel rounded-[2rem] border border-slate-200 p-6"
              >
                <p className="text-lg font-semibold text-slate-950">{title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            {...reveal}
            className="surface-panel rounded-[2.25rem] border border-slate-200 p-8"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Company overview
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">
              Structured service operations and customer support
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              SpeedFix focuses on reliable service standards, verified teams,
              more precise task selection, and stronger customer trust before,
              during, and after the visit.
            </p>
            <p className="mt-5 text-base leading-8 text-slate-600">
              The platform is organized to help customers move from category
              selection into the required task page, cart, and checkout without
              an unstructured browsing experience.
            </p>
          </motion.div>

          <motion.div
            {...reveal}
            className="dark-panel rounded-[2.25rem] p-8 text-white"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              What we optimize for
            </p>
            <div className="mt-6 space-y-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Trust by default",
                  text: "Verified teams, accountable service quality, and cleaner arrival standards.",
                },
                {
                  icon: Users2,
                  title: "Operational reliability",
                  text: "More consistent support, routing, and service follow-through.",
                },
                {
                  icon: ArrowRight,
                  title: "Customer clarity",
                  text: "Category-first discovery and easier movement into the exact task.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4"
                >
                  <div className="inline-flex rounded-2xl bg-white/10 p-3 text-orange-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
