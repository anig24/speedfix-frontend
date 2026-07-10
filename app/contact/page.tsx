"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
  CheckCircle2,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { contactEmailSchema } from "@/lib/email-validation";
import { readJsonResponse } from "@/lib/readJsonResponse";
import { operatingCities } from "@/lib/serviceCatalog";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const contactCards = [
  {
    title: "Customer support",
    value: "support@speedfix.co.in",
    href: "mailto:support@speedfix.co.in",
    icon: Mail,
  },
  {
    title: "Phone",
    value: "+91-7439769525",
    href: "tel:+917439769525",
    icon: Phone,
  },
  {
    title: "Service coverage",
    value: "Major metro service zones",
    href: "/services",
    icon: MapPin,
  },
];

type ContactFormValues = z.infer<typeof contactEmailSchema>;

export default function ContactPage() {
  const [formMessage, setFormMessage] = useState("");
  const [formState, setFormState] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactEmailSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      location: "",
      message: "",
      company: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setFormState("idle");
    setFormMessage("");

    const response = await fetch("/api/email/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const result = await readJsonResponse<{ error?: string }>(response);

    if (!response.ok) {
      setFormState("error");
      setFormMessage(result.error || "Unable to send your message right now.");
      return;
    }

    setFormState("success");
    setFormMessage("Thanks. SpeedFix support will get back to you shortly.");
    reset();
  };

  return (
    <div className="public-shell text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="public-hero-glow absolute inset-x-0 top-0 h-[28rem]" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <motion.div {...reveal} className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Contact
            </p>
            <h1 className="mt-4 display-font text-5xl text-slate-950 md:text-6xl">
              Contact SpeedFix
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              Reach out for service help, booking questions, pricing
              clarifications, or post-booking customer support.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {contactCards.map(({ title, value, href, icon: Icon }) => (
            <motion.a
              key={title}
              {...reveal}
              href={href}
              className="surface-panel lift-card rounded-[2rem] border border-slate-200 p-6"
            >
              <div className="inline-flex rounded-2xl bg-[#fff2df] p-3 text-orange-500">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-slate-950">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{value}</p>
            </motion.a>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            {...reveal}
            className="surface-panel rounded-[2rem] border border-slate-200 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-2xl bg-[#fff2df] p-3 text-orange-500">
                <Send className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-950">
                Send a request
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <input
                {...register("company")}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Name
                  </span>
                  <input
                    {...register("name")}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Full name"
                  />
                  {errors.name ? (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors.name.message}
                    </span>
                  ) : null}
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Email
                  </span>
                  <input
                    {...register("email")}
                    type="email"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                    placeholder="you@example.com"
                  />
                  {errors.email ? (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors.email.message}
                    </span>
                  ) : null}
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Phone
                  </span>
                  <input
                    {...register("phone")}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone ? (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors.phone.message}
                    </span>
                  ) : null}
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Service
                  </span>
                  <input
                    {...register("service")}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                    placeholder="AC service, plumbing, cleaning"
                  />
                  {errors.service ? (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors.service.message}
                    </span>
                  ) : null}
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Location
                </span>
                <input
                  {...register("location")}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="City, pincode, or area"
                />
                {errors.location ? (
                  <span className="mt-1 block text-xs text-red-600">
                    {errors.location.message}
                  </span>
                ) : null}
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Message
                </span>
                <textarea
                  {...register("message")}
                  rows={5}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="Tell us what needs fixing."
                />
                {errors.message ? (
                  <span className="mt-1 block text-xs text-red-600">
                    {errors.message.message}
                  </span>
                ) : null}
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send request
                </button>
                {formMessage ? (
                  <span
                    className={`inline-flex items-center gap-2 text-sm ${
                      formState === "success" ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {formState === "success" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : null}
                    {formMessage}
                  </span>
                ) : null}
              </div>
            </form>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              {...reveal}
              className="surface-panel rounded-[2rem] border border-slate-200 p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Operating cities
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {operatingCities.map((city) => (
                  <span
                    key={city}
                    className="rounded-full bg-[#fff2df] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              {...reveal}
              className="dark-panel rounded-[2rem] p-6 text-white"
            >
              <div className="inline-flex rounded-2xl bg-white/10 p-3 text-orange-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold">Need to book now?</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Browse services, select the right subcategory, add to cart, and
                complete checkout with a cleaner premium booking flow.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Browse services
                </Link>
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30"
                >
                  View cart
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
