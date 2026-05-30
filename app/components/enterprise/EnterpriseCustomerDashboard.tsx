"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, LoaderCircle, MessageCircle } from "lucide-react";
import LiveOperationsAnimation from "@/app/components/enterprise/LiveOperationsAnimation";
import EnterpriseWorkflowManagementDashboard from "@/app/components/enterprise/EnterpriseWorkflowManagementDashboard";
import { auth } from "@/lib/firebase";
import { readJsonResponse } from "@/lib/readJsonResponse";
import { type EnterpriseTimelineItem } from "@/lib/enterpriseManagement";

type CustomerDashboardResponse = {
  profile: {
    email: string | null;
    uid: string | null;
    segment: string;
  };
  summaries: {
    bookings: {
      total: number;
      pending: number;
      confirmed: number;
      inProgress: number;
      completed: number;
      cancelled: number;
    };
    activeBookings: number;
  };
  lifecycle: EnterpriseTimelineItem[];
  activeBookings: Array<Record<string, unknown> & { id: string }>;
  serviceOptions: string[];
  supportControls: string[];
};

export default function EnterpriseCustomerDashboard() {
  const [dashboard, setDashboard] = useState<CustomerDashboardResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken().catch(() => null);
      const response = await fetch("/api/enterprise/customer-dashboard", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await readJsonResponse<{
        error?: string;
        dashboard?: CustomerDashboardResponse;
      }>(response);

      if (!response.ok) {
        throw new Error(data.error || "Unable to load customer dashboard.");
      }

      if (active) {
        setDashboard(data.dashboard || null);
        setLoading(false);
      }
    };

    loadDashboard().catch(() => {
      if (active) {
        setDashboard(null);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-slate-700" />
        <p className="mt-4 text-sm text-slate-600">
          Loading your service command center...
        </p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-rose-700">
        Unable to load customer dashboard right now.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {dashboard.profile.segment}
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-slate-950">
            Customer Service Command Center
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600">
            Track bookings, technician movement, support, payment, revisit, and
            recovery from one customer cockpit. The same backend feeds internal
            operations, so customer and company teams see one lifecycle.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <CustomerMetric label="Bookings" value={`${dashboard.summaries.bookings.total}`} />
            <CustomerMetric label="Active" value={`${dashboard.summaries.activeBookings}`} />
            <CustomerMetric label="Completed" value={`${dashboard.summaries.bookings.completed}`} />
          </div>
        </motion.div>
        <LiveOperationsAnimation compact />
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Booking lifecycle
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          {dashboard.lifecycle.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {step.description}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <EnterpriseWorkflowManagementDashboard
        workspace="customer"
        audience="customer"
        compact
        title="Customer Workflow Hub"
        description="A customer-facing workflow layer for booking, payment, tracking, support, revisit, refund help, and recovery without exposing internal company controls."
      />

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Active bookings
          </p>
          <div className="mt-5 space-y-3">
            {dashboard.activeBookings.map((booking) => {
              const trackingId = String(
                booking.id || booking.bookingId || booking.bookingCode || ""
              );

              return (
                <div
                  key={booking.id}
                  className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">
                        {String(booking.serviceName || booking.service || "Service booking")}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {String(booking.bookingCode || booking.id)} / {String(booking.status || "PENDING")}
                      </p>
                    </div>
                    <Link
                      href={
                        trackingId
                          ? `/track?bookingId=${encodeURIComponent(trackingId)}`
                          : "/track"
                      }
                      className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      Track
                    </Link>
                  </div>
                </div>
              );
            })}
            {!dashboard.activeBookings.length && (
              <div className="rounded-[1.4rem] border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
                No active bookings yet.
              </div>
            )}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Customer options
              </p>
              <h3 className="text-2xl font-semibold text-slate-950">
                Service actions
              </h3>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {dashboard.serviceOptions.map((option) => (
              <Link
                key={option}
                href={option === "Book service" ? "/services" : "/contact"}
                className="flex items-center justify-between rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700"
              >
                {option}
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function CustomerMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
