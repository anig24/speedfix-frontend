import "server-only";

import { randomBytes } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";
import {
  canAccessWorkspace,
  hasCompanyEmail,
  normalizeEmail,
  normalizeRole,
  type WorkspaceKey,
} from "@/lib/portalAccess";

export const workPriorityValues = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export const workStatusValues = [
  "OPEN",
  "WORKING",
  "BLOCKED",
  "DONE",
  "CANCELLED",
] as const;

export type WorkPriority = (typeof workPriorityValues)[number];
export type WorkStatus = (typeof workStatusValues)[number];

const workspaceKeys: WorkspaceKey[] = [
  "customer",
  "agent",
  "corporate",
  "hr",
  "admin",
  "accounts",
  "audit",
  "founder",
];

const employeeActiveStatuses = new Set([
  "ACTIVE",
  "APPROVED",
  "ENABLED",
  "VERIFIED",
]);

export type ManagementActor = {
  uid: string | null;
  email: string | null;
  role: string | null;
  source: "api-key" | "firebase";
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value: unknown) {
  return normalizeText(value).toUpperCase();
}

function normalizeBoolean(value: unknown, fallback = true) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    const single = normalizeText(value);
    return single ? [single] : [];
  }

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, 20);
}

function createTemporaryPassword() {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = randomBytes(14);

  return Array.from(bytes)
    .map((byte) => alphabet[byte % alphabet.length])
    .join("");
}

function toIsoTimestamp(value: unknown): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
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

export function serializeManagementValue(value: unknown): unknown {
  const timestamp = toIsoTimestamp(value);

  if (timestamp) {
    return timestamp;
  }

  if (Array.isArray(value)) {
    return value.map(serializeManagementValue);
  }

  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        serializeManagementValue(entry),
      ])
    );
  }

  return value;
}

function hasValidManagementApiKey(request: NextRequest) {
  const configuredKey = normalizeText(process.env.SPEEDFIX_MANAGEMENT_API_KEY);
  const providedKey = normalizeText(request.headers.get("x-speedfix-management-key"));

  return Boolean(configuredKey && providedKey === configuredKey);
}

export function forbiddenManagementResponse() {
  return NextResponse.json(
    { error: "Management access is required for this action." },
    { status: 401 }
  );
}

export function getManagementActor(
  request: NextRequest,
  payload?: Record<string, unknown>
): ManagementActor {
  return {
    uid: normalizeText(request.headers.get("x-speedfix-user-id")) || null,
    email:
      normalizeEmail(request.headers.get("x-speedfix-user-email")) ||
      normalizeEmail(payload?.actorEmail) ||
      normalizeEmail(payload?.createdByEmail) ||
      null,
    role:
      normalizeRole(request.headers.get("x-speedfix-user-role")) ||
      normalizeRole(payload?.actorRole) ||
      null,
    source: "api-key",
  };
}

function getBearerToken(request: NextRequest) {
  const authorization = normalizeText(request.headers.get("authorization"));
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  return match?.[1] || normalizeText(request.headers.get("x-speedfix-id-token"));
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    }
  );

  const data = (await response.json().catch(() => ({}))) as {
    users?: Array<{
      localId?: string;
      email?: string;
    }>;
  };

  return response.ok ? data.users?.[0] || null : null;
}

export async function authorizeManagementRequest(
  request: NextRequest,
  payload?: Record<string, unknown>,
  workspace: WorkspaceKey = "corporate"
): Promise<ManagementActor | null> {
  if (hasValidManagementApiKey(request)) {
    return getManagementActor(request, payload);
  }

  const token = getBearerToken(request);

  if (!token) {
    return null;
  }

  const account = await lookupFirebaseAccount(token);
  const uid = normalizeText(account?.localId);
  const email = normalizeEmail(account?.email);

  if (!uid || !email) {
    return null;
  }

  const userSnapshot = await getDoc(doc(serverDb, "users", uid));
  const userRecord = userSnapshot.exists()
    ? {
        id: uid,
        email,
        ...(userSnapshot.data() as Record<string, unknown>),
      }
    : {
        id: uid,
        email,
        role: "CUSTOMER",
      };

  if (!canAccessWorkspace(userRecord, workspace, email)) {
    return null;
  }

  return {
    uid,
    email,
    role: normalizeRole(userRecord.role),
    source: "firebase",
  };
}

export function parseListLimit(value: string | null, fallback = 50) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(1, Math.min(Math.floor(parsed), 100));
}

export function normalizeWorkPriority(value: unknown): WorkPriority {
  const priority = normalizeUpper(value);

  if (workPriorityValues.includes(priority as WorkPriority)) {
    return priority as WorkPriority;
  }

  return "HIGH";
}

export function normalizeWorkStatus(value: unknown): WorkStatus {
  const status = normalizeUpper(value);

  if (workStatusValues.includes(status as WorkStatus)) {
    return status as WorkStatus;
  }

  return "OPEN";
}

export function buildWorkSearchIndex(input: Record<string, unknown>) {
  return [
    input.taskTitle,
    input.bookingCode,
    input.city,
    input.ownerName,
    input.ownerEmail,
    input.priority,
    input.status,
    input.functionArea,
    input.workflowStage,
    input.approvalStatus,
    input.impactArea,
    input.sourceSystem,
    input.dependency,
    input.sectionSlug,
    input.subSlug,
    input.notes,
  ]
    .map((item) => normalizeText(item).toLowerCase())
    .filter(Boolean)
    .join(" ");
}

export function normalizeWorkCreatePayload(payload: Record<string, unknown>) {
  const taskTitle = normalizeText(payload.taskTitle || payload.title);
  const city = normalizeText(payload.city);
  const ownerName = normalizeText(payload.ownerName || payload.assigneeName);
  const sectionSlug = normalizeText(payload.sectionSlug);
  const subSlug = normalizeText(payload.subSlug);

  if (!taskTitle || !city || !ownerName || !sectionSlug || !subSlug) {
    return {
      error:
        "Task title, city, owner name, section slug, and sub-workflow slug are required.",
    };
  }

  const record = {
    taskTitle,
    bookingCode: normalizeText(payload.bookingCode),
    bookingId: normalizeText(payload.bookingId),
    city,
    priority: normalizeWorkPriority(payload.priority),
    status: normalizeWorkStatus(payload.status),
    functionArea: normalizeText(payload.functionArea || payload.businessFunction),
    workflowStage: normalizeText(payload.workflowStage || payload.stage),
    approvalStatus: normalizeText(payload.approvalStatus) || "NOT_REQUIRED",
    impactArea: normalizeText(payload.impactArea),
    sourceSystem: normalizeText(payload.sourceSystem),
    customerImpact: normalizeText(payload.customerImpact),
    financialImpact: normalizeText(payload.financialImpact),
    dependency: normalizeText(payload.dependency),
    automationRunbook: normalizeText(payload.automationRunbook || payload.runbook),
    ownerName,
    ownerEmail: normalizeEmail(payload.ownerEmail),
    assigneeEmployeeId: normalizeText(payload.assigneeEmployeeId),
    dueWindow: normalizeText(payload.dueWindow || payload.dueDate),
    notes: normalizeText(payload.notes),
    tags: normalizeStringArray(payload.tags),
    sectionSlug,
    subSlug,
    source: "management-api",
  };

  return {
    record: {
      ...record,
      searchIndex: buildWorkSearchIndex(record),
    },
  };
}

export function normalizeWorkUpdatePayload(payload: Record<string, unknown>) {
  const allowed: Record<string, unknown> = {};

  if ("taskTitle" in payload || "title" in payload) {
    const taskTitle = normalizeText(payload.taskTitle || payload.title);

    if (!taskTitle) {
      return { error: "Task title cannot be empty." };
    }

    allowed.taskTitle = taskTitle;
  }

  if ("bookingCode" in payload) {
    allowed.bookingCode = normalizeText(payload.bookingCode);
  }

  if ("bookingId" in payload) {
    allowed.bookingId = normalizeText(payload.bookingId);
  }

  if ("city" in payload) {
    const city = normalizeText(payload.city);

    if (!city) {
      return { error: "City cannot be empty." };
    }

    allowed.city = city;
  }

  if ("ownerName" in payload || "assigneeName" in payload) {
    const ownerName = normalizeText(payload.ownerName || payload.assigneeName);

    if (!ownerName) {
      return { error: "Owner name cannot be empty." };
    }

    allowed.ownerName = ownerName;
  }

  if ("ownerEmail" in payload) {
    allowed.ownerEmail = normalizeEmail(payload.ownerEmail);
  }

  if ("assigneeEmployeeId" in payload) {
    allowed.assigneeEmployeeId = normalizeText(payload.assigneeEmployeeId);
  }

  if ("priority" in payload) {
    allowed.priority = normalizeWorkPriority(payload.priority);
  }

  if ("status" in payload) {
    allowed.status = normalizeWorkStatus(payload.status);
  }

  if ("functionArea" in payload || "businessFunction" in payload) {
    allowed.functionArea = normalizeText(
      payload.functionArea || payload.businessFunction
    );
  }

  if ("workflowStage" in payload || "stage" in payload) {
    allowed.workflowStage = normalizeText(payload.workflowStage || payload.stage);
  }

  if ("approvalStatus" in payload) {
    allowed.approvalStatus = normalizeText(payload.approvalStatus) || "NOT_REQUIRED";
  }

  if ("impactArea" in payload) {
    allowed.impactArea = normalizeText(payload.impactArea);
  }

  if ("sourceSystem" in payload) {
    allowed.sourceSystem = normalizeText(payload.sourceSystem);
  }

  if ("customerImpact" in payload) {
    allowed.customerImpact = normalizeText(payload.customerImpact);
  }

  if ("financialImpact" in payload) {
    allowed.financialImpact = normalizeText(payload.financialImpact);
  }

  if ("dependency" in payload) {
    allowed.dependency = normalizeText(payload.dependency);
  }

  if ("automationRunbook" in payload || "runbook" in payload) {
    allowed.automationRunbook = normalizeText(
      payload.automationRunbook || payload.runbook
    );
  }

  if ("dueWindow" in payload || "dueDate" in payload) {
    allowed.dueWindow = normalizeText(payload.dueWindow || payload.dueDate);
  }

  if ("notes" in payload) {
    allowed.notes = normalizeText(payload.notes);
  }

  if ("tags" in payload) {
    allowed.tags = normalizeStringArray(payload.tags);
  }

  if (!Object.keys(allowed).length) {
    return { error: "No supported work fields were provided." };
  }

  return {
    record: {
      ...allowed,
      searchIndex: buildWorkSearchIndex({
        ...payload,
        ...allowed,
      }),
    },
  };
}

export async function createFirebaseEmployeeAuth(input: {
  email: string;
  password: string;
}) {
  const apiKey = normalizeText(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  if (!apiKey) {
    throw new Error("Firebase API key is missing from the server environment.");
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        password: input.password,
        returnSecureToken: false,
      }),
    }
  );

  const data = (await response.json().catch(() => ({}))) as {
    localId?: string;
    error?: {
      message?: string;
    };
  };

  if (!response.ok || !data.localId) {
    const message = data.error?.message || "Unable to create Firebase employee user.";

    if (message.includes("EMAIL_EXISTS")) {
      throw new Error("An employee login already exists for this email.");
    }

    if (message.includes("WEAK_PASSWORD")) {
      throw new Error("Temporary password must be at least 6 characters.");
    }

    throw new Error(message.replace(/_/g, " ").toLowerCase());
  }

  return data.localId;
}

export function getWorkspaceAccessForEmployee(input: {
  email: string;
  role: string;
  active: boolean;
  employmentStatus: string;
}) {
  const record = {
    email: input.email,
    role: input.role,
    active: input.active,
    employeeActive: input.active,
    employmentActive: input.active,
    employmentStatus: input.employmentStatus,
  };

  return workspaceKeys.filter((workspace) =>
    canAccessWorkspace(record, workspace, input.email)
  );
}

export function normalizeEmployeeCreatePayload(payload: Record<string, unknown>) {
  const name = normalizeText(payload.name || payload.fullName);
  const email = normalizeEmail(payload.email);
  const role = normalizeRole(payload.role || "STAFF");
  const requestedTemporaryPassword = normalizeText(payload.temporaryPassword);
  const uid = normalizeText(payload.uid);

  if (!name || !email || !role) {
    return { error: "Employee name, company email, and role are required." };
  }

  if (!hasCompanyEmail(email)) {
    return { error: "Employee email must use @speedfix.co.in." };
  }

  if (requestedTemporaryPassword && requestedTemporaryPassword.length < 6) {
    return {
      error: "Temporary password must be at least 6 characters.",
    };
  }

  const generatedTemporaryPassword = !uid && !requestedTemporaryPassword;
  const temporaryPassword = uid
    ? requestedTemporaryPassword
    : requestedTemporaryPassword || createTemporaryPassword();

  const employmentStatus = normalizeUpper(payload.employmentStatus) || "ACTIVE";
  const active = normalizeBoolean(payload.active, true);
  const workspaceAccess = getWorkspaceAccessForEmployee({
    email,
    role,
    active,
    employmentStatus,
  });

  return {
    generatedTemporaryPassword,
    temporaryPassword,
    uid,
    record: {
      name,
      email,
      phone: normalizeText(payload.phone),
      role,
      department: normalizeText(payload.department),
      city: normalizeText(payload.city),
      employeeCode: normalizeText(payload.employeeCode),
      designation: normalizeText(payload.designation),
      managerEmail: normalizeEmail(payload.managerEmail),
      active,
      isActive: active,
      employeeActive: active,
      employmentActive: active,
      employmentStatus: employeeActiveStatuses.has(employmentStatus)
        ? employmentStatus
        : "ACTIVE",
      portalType: "COMPANY",
      workspaceAccess,
      searchIndex: [name, email, role, payload.department, payload.city]
        .map((item) => normalizeText(item).toLowerCase())
        .filter(Boolean)
        .join(" "),
    },
  };
}

export function normalizeEmployeeUpdatePayload(payload: Record<string, unknown>) {
  const allowed: Record<string, unknown> = {};

  if ("name" in payload || "fullName" in payload) {
    const name = normalizeText(payload.name || payload.fullName);

    if (!name) {
      return { error: "Employee name cannot be empty." };
    }

    allowed.name = name;
  }

  if ("phone" in payload) {
    allowed.phone = normalizeText(payload.phone);
  }

  if ("role" in payload) {
    const role = normalizeRole(payload.role);

    if (!role) {
      return { error: "Employee role cannot be empty." };
    }

    allowed.role = role;
  }

  if ("department" in payload) {
    allowed.department = normalizeText(payload.department);
  }

  if ("city" in payload) {
    allowed.city = normalizeText(payload.city);
  }

  if ("employeeCode" in payload) {
    allowed.employeeCode = normalizeText(payload.employeeCode);
  }

  if ("designation" in payload) {
    allowed.designation = normalizeText(payload.designation);
  }

  if ("managerEmail" in payload) {
    allowed.managerEmail = normalizeEmail(payload.managerEmail);
  }

  if (
    "active" in payload ||
    "employeeActive" in payload ||
    "employmentActive" in payload
  ) {
    const active = normalizeBoolean(
      payload.active ?? payload.employeeActive ?? payload.employmentActive,
      true
    );
    allowed.active = active;
    allowed.isActive = active;
    allowed.employeeActive = active;
    allowed.employmentActive = active;
  }

  if ("employmentStatus" in payload || "status" in payload) {
    const status = normalizeUpper(payload.employmentStatus || payload.status);
    allowed.employmentStatus = status || "ACTIVE";
  }

  if (!Object.keys(allowed).length) {
    return { error: "No supported employee fields were provided." };
  }

  const email = normalizeEmail(payload.email);
  const role = normalizeRole(allowed.role || payload.role);
  const employmentStatus = normalizeUpper(
    allowed.employmentStatus || payload.employmentStatus || "ACTIVE"
  );
  const active = normalizeBoolean(
    allowed.active ?? payload.active ?? payload.employeeActive,
    true
  );

  if (email && role) {
    allowed.workspaceAccess = getWorkspaceAccessForEmployee({
      email,
      role,
      active,
      employmentStatus,
    });
  }

  allowed.searchIndex = [
    allowed.name || payload.name,
    email || payload.email,
    role || payload.role,
    allowed.department || payload.department,
    allowed.city || payload.city,
  ]
    .map((item) => normalizeText(item).toLowerCase())
    .filter(Boolean)
    .join(" ");

  return { record: allowed };
}
