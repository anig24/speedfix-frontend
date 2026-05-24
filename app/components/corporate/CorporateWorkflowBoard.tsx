"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";

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
  functionArea?: string;
  workflowStage?: string;
  approvalStatus?: string;
  impactArea?: string;
  sourceSystem?: string;
  customerImpact?: string;
  financialImpact?: string;
  dependency?: string;
  automationRunbook?: string;
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
  functionArea: "Operations",
  workflowStage: "Intake",
  approvalStatus: "NOT_REQUIRED",
  impactArea: "Customer",
  sourceSystem: "SpeedFix Portal",
  customerImpact: "",
  financialImpact: "",
  dependency: "",
  automationRunbook: "",
  ownerName: "",
  dueWindow: "",
  notes: "",
};

const functionAreas = [
  "Operations",
  "Customer Experience",
  "Finance",
  "HR and People",
  "Catalog and Pricing",
  "Quality and Audit",
  "Procurement and Assets",
  "Field Workforce",
  "Executive Control",
];

const workflowStages = [
  "Intake",
  "Approval",
  "Assignment",
  "Execution",
  "Exception",
  "Recovery",
  "Closure",
];

const approvalStatuses = [
  "NOT_REQUIRED",
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "ESCALATED",
];

const impactAreas = [
  "Customer",
  "Revenue",
  "SLA",
  "Worker",
  "Compliance",
  "Catalog",
  "People",
  "Vendor",
];

export default function CorporateWorkflowBoard({
  sectionSlug,
  subSlug,
  title,
  quickActions,
}: CorporateWorkflowBoardProps) {
  const [items, setItems] = useState<CorporateWorkflowItem[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadItems = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          sectionSlug,
          subSlug,
          limit: "80",
        });
        const response = await fetch(`/api/management/work?${params.toString()}`, {
          headers: await getActorHeaders(),
        });
        const data = (await response.json()) as {
          error?: string;
          items?: CorporateWorkflowItem[];
        };

        if (!response.ok) {
          throw new Error(data.error || "Unable to load workflow items.");
        }

        if (active) {
          setItems(data.items || []);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load workflow items."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadItems();

    return () => {
      active = false;
    };
  }, [sectionSlug, subSlug]);

  const openCount = useMemo(
    () => items.filter((item) => item.status !== "DONE").length,
    [items]
  );
  const stageCounts = useMemo(() => {
    return workflowStages.map((stage) => ({
      stage,
      count: items.filter((item) => (item.workflowStage || "Intake") === stage).length,
    }));
  }, [items]);
  const approvalCount = useMemo(
    () =>
      items.filter((item) =>
        ["PENDING_APPROVAL", "ESCALATED"].includes(
          item.approvalStatus || "NOT_REQUIRED"
        )
      ).length,
    [items]
  );
  const functionCount = useMemo(() => {
    return new Set(items.map((item) => item.functionArea || "Operations")).size;
  }, [items]);

  const addWorkflowItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.taskTitle || !form.city || !form.ownerName) {
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/management/work", {
        method: "POST",
        headers: await getActorHeaders(),
        body: JSON.stringify({
          ...form,
          sectionSlug,
          subSlug,
          actorEmail: auth.currentUser?.email || null,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        item?: CorporateWorkflowItem;
      };

      if (!response.ok || !data.item) {
        throw new Error(data.error || "Unable to create workflow item.");
      }

      setItems((current) => [data.item!, ...current]);
      setForm(defaultForm);
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create workflow item."
      );
    }
  };

  const updateWorkflowItem = async (
    id: string,
    patch: Partial<CorporateWorkflowItem>
  ) => {
    const previousItems = items;
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
    setError("");

    try {
      const response = await fetch(`/api/management/work/${id}`, {
        method: "PATCH",
        headers: await getActorHeaders(),
        body: JSON.stringify({
          ...patch,
          actorEmail: auth.currentUser?.email || null,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        item?: CorporateWorkflowItem;
      };

      if (!response.ok || !data.item) {
        throw new Error(data.error || "Unable to update workflow status.");
      }

      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, ...data.item } : item))
      );
    } catch (updateError) {
      setItems(previousItems);
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update workflow status."
      );
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Workflow intake
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Add structured workflow tasks across operations, customer experience,
          finance, HR, catalog, quality, field force, procurement, and executive
          control. Each item can move through intake, approval, execution,
          exception, recovery, and closure.
        </p>

        <form className="mt-6 space-y-4" onSubmit={addWorkflowItem}>
          <input
            value={form.taskTitle}
            onChange={(event) =>
              setForm((current) => ({ ...current, taskTitle: event.target.value }))
            }
            placeholder="Task title"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.bookingCode}
              onChange={(event) =>
                setForm((current) => ({ ...current, bookingCode: event.target.value }))
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
              value={form.ownerName}
              onChange={(event) =>
                setForm((current) => ({ ...current, ownerName: event.target.value }))
              }
              placeholder="Owner"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              type="date"
              value={form.dueWindow}
              onChange={(event) =>
                setForm((current) => ({ ...current, dueWindow: event.target.value }))
              }
              aria-label="Due date"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={form.functionArea}
              onChange={(event) =>
                setForm((current) => ({ ...current, functionArea: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              {functionAreas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={form.workflowStage}
              onChange={(event) =>
                setForm((current) => ({ ...current, workflowStage: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              {workflowStages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={form.approvalStatus}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  approvalStatus: event.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              {approvalStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={form.impactArea}
              onChange={(event) =>
                setForm((current) => ({ ...current, impactArea: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              {impactAreas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={form.priority}
              onChange={(event) =>
                setForm((current) => ({ ...current, priority: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
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
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              {["OPEN", "WORKING", "BLOCKED", "DONE"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.sourceSystem}
              onChange={(event) =>
                setForm((current) => ({ ...current, sourceSystem: event.target.value }))
              }
              placeholder="Source system"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              value={form.dependency}
              onChange={(event) =>
                setForm((current) => ({ ...current, dependency: event.target.value }))
              }
              placeholder="Dependency or handoff"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              value={form.customerImpact}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  customerImpact: event.target.value,
                }))
              }
              placeholder="Customer impact"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              value={form.financialImpact}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  financialImpact: event.target.value,
                }))
              }
              placeholder="Financial impact"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </div>

          <textarea
            value={form.automationRunbook}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                automationRunbook: event.target.value,
              }))
            }
            rows={3}
            placeholder="Runbook, automation rule, approval note, or SOP"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />

          <textarea
            value={form.notes}
            onChange={(event) =>
              setForm((current) => ({ ...current, notes: event.target.value }))
            }
            rows={4}
            placeholder="Operational notes, blockers, handoff details"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />

          <button
            type="submit"
            className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Create workflow item
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Multi-function live queue
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              {openCount} active items
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickActions.map((item) => (
              <span
                key={item}
                className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <QueueMetric label="Functions" value={`${functionCount}`} />
          <QueueMetric label="Approvals" value={`${approvalCount}`} />
          <QueueMetric label="Active" value={`${openCount}`} />
        </div>

        <div className="mt-5 grid gap-2 md:grid-cols-4 xl:grid-cols-7">
          {stageCounts.map((item) => (
            <div
              key={item.stage}
              className="rounded-[1.1rem] border border-slate-200 bg-slate-50 px-3 py-3"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {item.stage}
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {item.count}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {loading && (
            <div className="rounded-[1.7rem] border border-dashed border-slate-200 px-5 py-10 text-center text-sm text-slate-500">
              Loading workflow items...
            </div>
          )}

          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.7rem] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    <span>{item.functionArea || "Operations"}</span>
                    <span>&bull;</span>
                    <span>{item.workflowStage || "Intake"}</span>
                    <span>&bull;</span>
                    <span>{item.priority}</span>
                    <span>&bull;</span>
                    <span>{item.city}</span>
                    {item.bookingCode && (
                      <>
                        <span>&bull;</span>
                        <span>{item.bookingCode}</span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    {item.taskTitle}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Owner: {item.ownerName} | Due: {item.dueWindow || "Not set"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <WorkflowBadge label={item.approvalStatus || "NOT_REQUIRED"} />
                    <WorkflowBadge label={item.impactArea || "Customer"} />
                    {item.sourceSystem && <WorkflowBadge label={item.sourceSystem} />}
                    {item.dependency && <WorkflowBadge label={`Depends: ${item.dependency}`} />}
                  </div>
                  {(item.customerImpact || item.financialImpact || item.automationRunbook) && (
                    <div className="mt-3 grid gap-2 md:grid-cols-3">
                      {item.customerImpact && (
                        <DetailPill label="Customer" value={item.customerImpact} />
                      )}
                      {item.financialImpact && (
                        <DetailPill label="Finance" value={item.financialImpact} />
                      )}
                      {item.automationRunbook && (
                        <DetailPill label="Runbook" value={item.automationRunbook} />
                      )}
                    </div>
                  )}
                  {item.notes && (
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[420px]">
                  <select
                    value={item.status}
                    onChange={(event) =>
                      updateWorkflowItem(item.id, { status: event.target.value })
                    }
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none"
                  >
                    {["OPEN", "WORKING", "BLOCKED", "DONE"].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <select
                    value={item.workflowStage || "Intake"}
                    onChange={(event) =>
                      updateWorkflowItem(item.id, {
                        workflowStage: event.target.value,
                      })
                    }
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none"
                  >
                    {workflowStages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                  <select
                    value={item.approvalStatus || "NOT_REQUIRED"}
                    onChange={(event) =>
                      updateWorkflowItem(item.id, {
                        approvalStatus: event.target.value,
                      })
                    }
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none"
                  >
                    {approvalStatuses.map((approval) => (
                      <option key={approval} value={approval}>
                        {approval}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </article>
          ))}

          {!loading && !items.length && (
            <div className="rounded-[1.7rem] border border-dashed border-slate-200 px-5 py-10 text-center text-sm text-slate-500">
              No workflow items yet for this lane.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function QueueMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function WorkflowBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
      {label}
    </span>
  );
}

function DetailPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-slate-200 bg-white px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-700">{value}</p>
    </div>
  );
}

async function getActorHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth.currentUser?.uid) {
    headers["x-speedfix-user-id"] = auth.currentUser.uid;
  }

  if (auth.currentUser?.email) {
    headers["x-speedfix-user-email"] = auth.currentUser.email;
  }

  const token = await auth.currentUser?.getIdToken().catch(() => null);

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}
