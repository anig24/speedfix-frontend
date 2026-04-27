"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type AgentWorkflowBoardProps = {
  queueSlug: string;
  queueType: string;
  title: string;
};

type AgentWorkflowItem = {
  id: string;
  customerName: string;
  phone: string;
  bookingCode: string;
  city: string;
  disposition: string;
  status: string;
  nextActionAt: string;
  notes: string;
  assignedAgent: string;
  queueSlug: string;
  queueType: string;
};

const defaultForm = {
  customerName: "",
  phone: "",
  bookingCode: "",
  city: "",
  disposition: "NEEDS_CALLBACK",
  status: "NEW",
  nextActionAt: "",
  notes: "",
  assignedAgent: "",
};

export default function AgentWorkflowBoard({
  queueSlug,
  queueType,
  title,
}: AgentWorkflowBoardProps) {
  const [items, setItems] = useState<AgentWorkflowItem[]>([]);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    const workflowQuery = query(
      collection(db, "agentWorkflowItems"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(workflowQuery, (snapshot) => {
      const nextItems = snapshot.docs
        .map((item) => {
          const data = item.data() as Omit<AgentWorkflowItem, "id">;

          return {
            id: item.id,
            ...data,
          };
        })
        .filter(
          (item) => item.queueSlug === queueSlug && item.queueType === queueType
        );

      setItems(nextItems);
    });
  }, [queueSlug, queueType]);

  const activeCount = useMemo(
    () => items.filter((item) => item.status !== "CLOSED").length,
    [items]
  );

  const createAgentItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.customerName || !form.phone || !form.assignedAgent) {
      return;
    }

    await addDoc(collection(db, "agentWorkflowItems"), {
      ...form,
      queueSlug,
      queueType,
      source: "agent-portal",
      createdByUid: auth.currentUser?.uid || null,
      createdByEmail: auth.currentUser?.email || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setForm(defaultForm);
  };

  const updateAgentStatus = async (
    id: string,
    status: string,
    disposition: string
  ) => {
    await updateDoc(doc(db, "agentWorkflowItems", id), {
      status,
      disposition,
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Agent intake
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Create and manage customer call tasks, callback promises, and issue
          follow-up items without mixing in payroll or HR workflows.
        </p>

        <form className="mt-6 space-y-4" onSubmit={createAgentItem}>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.customerName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  customerName: event.target.value,
                }))
              }
              placeholder="Customer name"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({ ...current, phone: event.target.value }))
              }
              placeholder="Phone number"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              value={form.bookingCode}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  bookingCode: event.target.value,
                }))
              }
              placeholder="Booking code"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              value={form.city}
              onChange={(event) =>
                setForm((current) => ({ ...current, city: event.target.value }))
              }
              placeholder="City"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              value={form.assignedAgent}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  assignedAgent: event.target.value,
                }))
              }
              placeholder="Assigned agent"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              type="datetime-local"
              value={form.nextActionAt}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  nextActionAt: event.target.value,
                }))
              }
              aria-label="Next action date and time"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({ ...current, status: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              {["NEW", "CALLING", "FOLLOW_UP", "ESCALATED", "CLOSED"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={form.disposition}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  disposition: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              {[
                "NEEDS_CALLBACK",
                "CONFIRMED",
                "RESCHEDULE_REQUEST",
                "PAYMENT_FOLLOW_UP",
                "ESCALATED",
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={form.notes}
            onChange={(event) =>
              setForm((current) => ({ ...current, notes: event.target.value }))
            }
            rows={4}
            placeholder="Call summary, promise made, customer issue, or next step"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />

          <button
            type="submit"
            className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Create agent task
          </button>
        </form>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Live queue
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              {activeCount} active cases
            </h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.7rem] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    <span>{item.city}</span>
                    <span>•</span>
                    <span>{item.phone}</span>
                    {item.bookingCode && (
                      <>
                        <span>•</span>
                        <span>{item.bookingCode}</span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    {item.customerName}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Agent: {item.assignedAgent} | Next action: {item.nextActionAt || "Not set"}
                  </p>
                  {item.notes && (
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={item.status}
                    onChange={(event) =>
                      updateAgentStatus(item.id, event.target.value, item.disposition)
                    }
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none"
                  >
                    {["NEW", "CALLING", "FOLLOW_UP", "ESCALATED", "CLOSED"].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <select
                    value={item.disposition}
                    onChange={(event) =>
                      updateAgentStatus(item.id, item.status, event.target.value)
                    }
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none"
                  >
                    {[
                      "NEEDS_CALLBACK",
                      "CONFIRMED",
                      "RESCHEDULE_REQUEST",
                      "PAYMENT_FOLLOW_UP",
                      "ESCALATED",
                    ].map((disposition) => (
                      <option key={disposition} value={disposition}>
                        {disposition}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </article>
          ))}

          {!items.length && (
            <div className="rounded-[1.7rem] border border-dashed border-slate-200 px-5 py-10 text-center text-sm text-slate-500">
              No active customer tasks in this queue yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
