"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type CorporateWorkflowBoardProps = {
  sectionSlug: string;
  subSlug: string;
  title: string;
  quickActions: string[];
};

type CorporateWorkflowItem = {
  id: string;
  taskTitle: string;
  bookingCode: string;
  city: string;
  priority: string;
  status: string;
  ownerName: string;
  dueWindow: string;
  notes: string;
  sectionSlug: string;
  subSlug: string;
};

const defaultForm = {
  taskTitle: "",
  bookingCode: "",
  city: "",
  priority: "HIGH",
  status: "OPEN",
  ownerName: "",
  dueWindow: "",
  notes: "",
};

export default function CorporateWorkflowBoard({
  sectionSlug,
  subSlug,
  title,
  quickActions,
}: CorporateWorkflowBoardProps) {
  const [items, setItems] = useState<CorporateWorkflowItem[]>([]);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    const workflowQuery = query(
      collection(db, "corporateWorkflowItems"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(workflowQuery, (snapshot) => {
      const nextItems = snapshot.docs
        .map((item) => {
          const data = item.data() as Omit<CorporateWorkflowItem, "id">;

          return {
            id: item.id,
            ...data,
          };
        })
        .filter(
          (item) =>
            item.sectionSlug === sectionSlug && item.subSlug === subSlug
        );

      setItems(nextItems);
    });
  }, [sectionSlug, subSlug]);

  const openCount = useMemo(
    () => items.filter((item) => item.status !== "DONE").length,
    [items]
  );

  const addWorkflowItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.taskTitle || !form.city || !form.ownerName) {
      return;
    }

    await addDoc(collection(db, "corporateWorkflowItems"), {
      ...form,
      sectionSlug,
      subSlug,
      source: "corporate-portal",
      createdByUid: auth.currentUser?.uid || null,
      createdByEmail: auth.currentUser?.email || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setForm(defaultForm);
  };

  const updateWorkflowStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "corporateWorkflowItems", id), {
      status,
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Workflow intake
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Add structured workflow tasks for this operating lane. This portal
          focuses on daily operations handling, follow-through, escalation, and
          approvals rather than employee HR records.
        </p>

        <form className="mt-6 space-y-4" onSubmit={addWorkflowItem}>
          <input
            value={form.taskTitle}
            onChange={(event) =>
              setForm((current) => ({ ...current, taskTitle: event.target.value }))
            }
            placeholder="Task title"
            className="w-full rounded-2xl border border-white/10 bg-[#0c1424] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.bookingCode}
              onChange={(event) =>
                setForm((current) => ({ ...current, bookingCode: event.target.value }))
              }
              placeholder="Booking code"
              className="rounded-2xl border border-white/10 bg-[#0c1424] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            />
            <input
              value={form.city}
              onChange={(event) =>
                setForm((current) => ({ ...current, city: event.target.value }))
              }
              placeholder="City"
              className="rounded-2xl border border-white/10 bg-[#0c1424] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            />
            <input
              value={form.ownerName}
              onChange={(event) =>
                setForm((current) => ({ ...current, ownerName: event.target.value }))
              }
              placeholder="Owner"
              className="rounded-2xl border border-white/10 bg-[#0c1424] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            />
            <input
              type="date"
              value={form.dueWindow}
              onChange={(event) =>
                setForm((current) => ({ ...current, dueWindow: event.target.value }))
              }
              aria-label="Due date"
              className="rounded-2xl border border-white/10 bg-[#0c1424] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={form.priority}
              onChange={(event) =>
                setForm((current) => ({ ...current, priority: event.target.value }))
              }
              className="rounded-2xl border border-white/10 bg-[#0c1424] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            >
              {["HIGH", "MEDIUM", "LOW"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({ ...current, status: event.target.value }))
              }
              className="rounded-2xl border border-white/10 bg-[#0c1424] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
            >
              {["OPEN", "WORKING", "BLOCKED", "DONE"].map((item) => (
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
            placeholder="Operational notes, blockers, handoff details"
            className="w-full rounded-2xl border border-white/10 bg-[#0c1424] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
          />

          <button
            type="submit"
            className="w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Create workflow item
          </button>
        </form>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Live queue
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {openCount} active items
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickActions.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.7rem] border border-white/10 bg-[#0c1424] p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    <span>{item.priority}</span>
                    <span>•</span>
                    <span>{item.city}</span>
                    {item.bookingCode && (
                      <>
                        <span>•</span>
                        <span>{item.bookingCode}</span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {item.taskTitle}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Owner: {item.ownerName} | Due: {item.dueWindow}
                  </p>
                  {item.notes && (
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {item.notes}
                    </p>
                  )}
                </div>

                <select
                  value={item.status}
                  onChange={(event) =>
                    updateWorkflowStatus(item.id, event.target.value)
                  }
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none"
                >
                  {["OPEN", "WORKING", "BLOCKED", "DONE"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))}

          {!items.length && (
            <div className="rounded-[1.7rem] border border-dashed border-white/10 px-5 py-10 text-center text-sm text-slate-400">
              No workflow items yet for this lane.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
