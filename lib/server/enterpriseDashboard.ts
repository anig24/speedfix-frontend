import "server-only";

import {
  collection,
  doc,
  getDocs,
  getDoc,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  customerLifecycle,
  enterpriseKpis,
  enterpriseOrgLayers,
  getEnterpriseModulesForWorkspace,
} from "@/lib/enterpriseManagement";
import { serverDb } from "@/lib/firebase-server";
import {
  canAccessWorkspace,
  normalizeEmail,
  normalizeRole,
  type WorkspaceKey,
} from "@/lib/portalAccess";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value: unknown) {
  return normalizeText(value).toUpperCase();
}

function serializeTimestamp(value: unknown): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return null;
}

function serializeRecord(
  id: string,
  data: Record<string, unknown>
): Record<string, unknown> & { id: string } {
  return {
    id,
    ...Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        serializeTimestamp(value) || value,
      ])
    ),
  };
}

function getStatusCount(items: Array<Record<string, unknown>>, status: string) {
  return items.filter((item) => normalizeUpper(item.status) === status).length;
}

function getActiveCount(items: Array<Record<string, unknown>>) {
  return items.filter((item) => {
    const status = normalizeUpper(item.status);
    return status && !["DONE", "COMPLETED", "CANCELLED", "INACTIVE"].includes(status);
  }).length;
}

function getEmployeeSummary(employees: Array<Record<string, unknown>>) {
  const active = employees.filter((employee) => {
    const status = normalizeUpper(
      employee.employmentStatus || employee.employeeStatus || employee.status
    );
    return employee.active !== false && (!status || status === "ACTIVE");
  });

  const byDepartment = active.reduce<Record<string, number>>((result, employee) => {
    const department = normalizeText(employee.department) || "Unassigned";
    result[department] = (result[department] || 0) + 1;
    return result;
  }, {});

  return {
    total: employees.length,
    active: active.length,
    inactive: employees.length - active.length,
    byDepartment,
  };
}

function getBookingSummary(bookings: Array<Record<string, unknown>>) {
  return {
    total: bookings.length,
    pending: getStatusCount(bookings, "PENDING"),
    confirmed: getStatusCount(bookings, "CONFIRMED"),
    inProgress: getStatusCount(bookings, "IN_PROGRESS"),
    completed: getStatusCount(bookings, "COMPLETED"),
    cancelled: getStatusCount(bookings, "CANCELLED"),
  };
}

function getWorkSummary(workItems: Array<Record<string, unknown>>) {
  return {
    total: workItems.length,
    active: getActiveCount(workItems),
    open: getStatusCount(workItems, "OPEN"),
    working: getStatusCount(workItems, "WORKING"),
    blocked: getStatusCount(workItems, "BLOCKED"),
    done: getStatusCount(workItems, "DONE"),
  };
}

async function getRecentCollection(collectionName: string, max = 80) {
  const snapshot = await getDocs(
    query(collection(serverDb, collectionName), orderBy("createdAt", "desc"), limit(max))
  ).catch(async () => {
    return getDocs(query(collection(serverDb, collectionName), limit(max))).catch(
      () => null
    );
  });

  if (!snapshot) {
    return [];
  }

  return snapshot.docs.map((item) =>
    serializeRecord(item.id, item.data() as Record<string, unknown>)
  );
}

async function lookupFirebaseAccount(idToken: string) {
  const apiKey = normalizeText(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  if (!apiKey) {
    return null;
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    }
  );

  const data = (await response.json().catch(() => ({}))) as {
    users?: Array<{ localId?: string; email?: string; displayName?: string }>;
  };

  return response.ok ? data.users?.[0] || null : null;
}

export function getBearerToken(headers: Headers) {
  const authorization = normalizeText(headers.get("authorization"));
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  return match?.[1] || normalizeText(headers.get("x-speedfix-id-token"));
}

export async function getAuthenticatedPortalUser(headers: Headers) {
  const token = getBearerToken(headers);

  if (!token) {
    return null;
  }

  const account = await lookupFirebaseAccount(token);
  const uid = normalizeText(account?.localId);
  const email = normalizeEmail(account?.email);

  if (!uid || !email) {
    return null;
  }

  const userByUid = await getDoc(doc(serverDb, "users", uid)).catch(() => null);
  const userSnapshot =
    userByUid?.exists()
      ? null
      : await getDocs(
          query(collection(serverDb, "users"), where("email", "==", email), limit(1))
        ).catch(() => null);
  const userByEmail = userSnapshot?.docs[0];

  return {
    uid,
    email,
    displayName: normalizeText(account?.displayName),
    record: userByUid?.exists()
      ? serializeRecord(userByUid.id, userByUid.data() as Record<string, unknown>)
      : userByEmail
      ? serializeRecord(userByEmail.id, userByEmail.data() as Record<string, unknown>)
      : {
          id: uid,
          email,
          role: "CUSTOMER",
        },
  };
}

export async function buildEnterpriseEmployeeDashboard(input: {
  workspace: WorkspaceKey;
  userRecord: Record<string, unknown>;
  email: string;
}) {
  const [employees, bookings, workItems, workers, auditEvents] = await Promise.all([
    getRecentCollection("users", 160),
    getRecentCollection("bookings", 160),
    getRecentCollection("corporateWorkflowItems", 160),
    getRecentCollection("workers", 160),
    getRecentCollection("managementAuditLog", 80),
  ]);

  const modules = getEnterpriseModulesForWorkspace(input.workspace);
  const employeeSummary = getEmployeeSummary(employees);
  const bookingSummary = getBookingSummary(bookings);
  const workSummary = getWorkSummary(workItems);
  const workerSummary = {
    total: workers.length,
    verified: workers.filter((worker) => worker.verified === true).length,
    active: workers.filter((worker) => worker.active !== false).length,
    onJob: workers.filter((worker) => Boolean(worker.currentBookingId)).length,
  };

  return {
    profile: {
      email: input.email,
      role: normalizeRole(input.userRecord.role),
      name: normalizeText(input.userRecord.name) || normalizeText(input.userRecord.email),
      workspace: input.workspace,
    },
    kpis: [
      ...enterpriseKpis,
      {
        label: "Open work",
        value: `${workSummary.active}`,
        trend: `${workSummary.blocked} blocked, ${workSummary.working} in motion`,
        tone: workSummary.blocked ? "risk" : "good",
      },
      {
        label: "Bookings",
        value: `${bookingSummary.total}`,
        trend: `${bookingSummary.pending} pending, ${bookingSummary.completed} completed`,
        tone: bookingSummary.pending > 10 ? "watch" : "neutral",
      },
    ],
    summaries: {
      employees: employeeSummary,
      bookings: bookingSummary,
      work: workSummary,
      workers: workerSummary,
    },
    modules,
    orgLayers: enterpriseOrgLayers,
    recentWorkItems: workItems.slice(0, 12),
    recentBookings: bookings.slice(0, 12),
    recentAuditEvents: auditEvents.slice(0, 10),
  };
}

export async function buildEnterpriseCustomerDashboard(input: {
  uid?: string | null;
  email?: string | null;
}) {
  const email = normalizeEmail(input.email);
  const allBookings = await getRecentCollection("bookings", 120);
  const customerBookings = email
    ? allBookings.filter((booking) => {
        return [
          booking.customerEmail,
          booking.email,
          booking.createdByEmail,
        ]
          .map(normalizeEmail)
          .includes(email);
      })
    : [];

  const bookingSummary = getBookingSummary(customerBookings);

  return {
    profile: {
      email: email || null,
      uid: input.uid || null,
      segment: customerBookings.length > 2 ? "Repeat customer" : "New customer",
    },
    summaries: {
      bookings: bookingSummary,
      activeBookings: customerBookings.filter((booking) => {
        const status = normalizeUpper(booking.status);
        return !["COMPLETED", "CANCELLED"].includes(status);
      }).length,
    },
    lifecycle: customerLifecycle,
    activeBookings: customerBookings.slice(0, 8),
    serviceOptions: [
      "Book service",
      "Track technician",
      "Update address",
      "Raise support case",
      "Request callback",
      "Review refunds",
    ],
    supportControls: [
      "AI chat and human handoff",
      "Complaint recovery",
      "Revisit request",
      "Invoice and payment help",
    ],
  };
}

export function canOpenEnterpriseWorkspace(
  record: Record<string, unknown>,
  workspace: WorkspaceKey,
  email: string
) {
  if (workspace === "customer") {
    return true;
  }

  return canAccessWorkspace(record, workspace, email);
}
