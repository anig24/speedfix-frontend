"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import { useCareerPostingAccess } from "@/app/components/careers/useCareerPostingAccess";

type PostingForm = {
  companyName: string;
  recruiterName: string;
  workEmail: string;
  roleTitle: string;
  location: string;
  employmentType: string;
  salaryRange: string;
  description: string;
};

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const defaultForm: PostingForm = {
  companyName: "",
  recruiterName: "",
  workEmail: "",
  roleTitle: "",
  location: "",
  employmentType: "Full-time",
  salaryRange: "",
  description: "",
};

export default function CareerPostingPage() {
  const { user, role, isAuthorized, isLoading } = useCareerPostingAccess();
  const [form, setForm] = useState<PostingForm>(defaultForm);
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
    postingId?: string;
  }>({ type: "idle", message: "" });

  const update = <K extends keyof PostingForm>(field: K, value: PostingForm[K]) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Saving your job posting..." });

    try {
      const response = await fetch("/api/career-postings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          posterUid: user?.uid || "",
          posterRole: role,
          posterEmail: user?.email || "",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save the job posting.");
      }

      setStatus({
        type: "success",
        message: "Job posting saved successfully.",
        postingId: result.postingId,
      });
      setForm(defaultForm);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save the job posting.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#f6efe4] px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center premium-card">
          <div className="mx-auto inline-flex rounded-full bg-slate-100 p-4 text-slate-700">
            <LoaderCircle className="h-6 w-6 animate-spin" />
          </div>
          <h1 className="mt-6 display-font text-4xl text-slate-950">
            Checking access
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Verifying whether this account can access the careers posting desk.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="bg-[#f6efe4] px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center premium-card">
          <div className="mx-auto inline-flex rounded-full bg-[#fff2df] p-4 text-orange-600">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h1 className="mt-6 display-font text-4xl text-slate-950">
            HR and recruiter access only
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The job posting page is visible only to signed-in HR or recruiter
            accounts.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {!user && (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Back to careers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6efe4] text-slate-900">
      <section className="border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:px-8 lg:py-20">
          <motion.div {...reveal} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm text-slate-700">
              <BriefcaseBusiness className="h-4 w-4 text-orange-500" />
              Careers job posting
            </div>

            <h1 className="mt-5 display-font text-5xl leading-tight text-slate-950 md:text-6xl">
              Post a role from the careers page
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Use this page to submit hiring requirements with company, role,
              location, and job description details. This page is limited to HR
              and recruiter accounts.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Recruiter details", "Add your company, recruiter name, and work email."],
                ["Role details", "Capture title, location, type, salary, and description."],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-[1.8rem] border border-slate-200 bg-white p-5 premium-card"
                >
                  <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...reveal} className="mt-10 lg:mt-0">
            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card sm:p-7"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={form.companyName}
                  onChange={(event) => update("companyName", event.target.value)}
                  placeholder="Company name"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
                <input
                  value={form.recruiterName}
                  onChange={(event) => update("recruiterName", event.target.value)}
                  placeholder="Recruiter name"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
                <input
                  value={form.workEmail}
                  onChange={(event) => update("workEmail", event.target.value)}
                  placeholder="Work email"
                  type="email"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
                <input
                  value={form.roleTitle}
                  onChange={(event) => update("roleTitle", event.target.value)}
                  placeholder="Role title"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
                <input
                  value={form.location}
                  onChange={(event) => update("location", event.target.value)}
                  placeholder="Location"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
                <select
                  value={form.employmentType}
                  onChange={(event) => update("employmentType", event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                >
                  {["Full-time", "Part-time", "Contract", "Internship"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <input
                value={form.salaryRange}
                onChange={(event) => update("salaryRange", event.target.value)}
                placeholder="Salary range (optional)"
                className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />

              <textarea
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                rows={6}
                placeholder="Describe the role, expectations, and any important notes."
                className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />

              <button
                type="submit"
                disabled={status.type === "loading"}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status.type === "loading" ? "Saving..." : "Post job opening"}
                <ArrowRight className="h-4 w-4" />
              </button>

              {status.type !== "idle" && (
                <div
                  className={`mt-4 rounded-[1.5rem] px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : status.type === "error"
                        ? "bg-red-50 text-red-600"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {status.type === "success" && (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    <div>
                      <p>{status.message}</p>
                      {status.postingId && (
                        <p className="mt-1 font-medium">
                          Posting ID: {status.postingId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
