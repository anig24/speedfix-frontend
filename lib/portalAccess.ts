import { ROLES } from "@/lib/roles";
import { isActiveAgentUser } from "@/lib/agentAuth";
import { isActiveCorporateEmployee } from "@/lib/corporateAuth";

export type WorkspaceKey =
  | "customer"
  | "agent"
  | "corporate"
  | "hr"
  | "admin"
  | "accounts"
  | "audit"
  | "founder";

export type PortalUserRecord = {
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  active?: boolean;
  employeeActive?: boolean;
  employmentActive?: boolean;
  employmentStatus?: string;
  status?: string;
  employeeStatus?: string;
};

const FOUNDER_ROLES = new Set([ROLES.FOUNDER]);

const HR_ROLES = new Set([
  "HR",
  "HEAD_HR",
  "JR_HR",
  "HR_INTERN",
  "CAMPUS_RECRUITER",
  "RECRUITER",
  "FIELD_RECRUITER",
  "HEAD_RECRUITER",
  "TALENT_ACQUISITION",
]);

const RECRUITER_ROLES = new Set([
  "RECRUITER",
  "FIELD_RECRUITER",
  "HEAD_RECRUITER",
  "TALENT_ACQUISITION",
  "CAMPUS_RECRUITER",
]);

const ADMIN_ROLES = new Set([
  "ADMIN",
  "SUPER_ADMIN",
  ROLES.BUSINESS_HEAD,
  ROLES.STATE_MANAGER,
  ROLES.CITY_MANAGER,
  ROLES.OPERATIONS,
  "OPERATIONS_ADMIN",
  "SERVICE_HEAD",
  "CATEGORY_MANAGER",
  "CATALOG",
  "PRICING_MANAGER",
  "GROWTH_MANAGER",
  "ZONE_MANAGER",
  "CLUSTER_MANAGER",
  "OPERATIONS_MANAGER",
  "DISPATCHER",
  "SCHEDULING_COORDINATOR",
  "FIELD_SUPERVISOR",
]);

const ACCOUNTS_ROLES = new Set([
  "ACCOUNTS",
  "ACCOUNTANT",
  "ACCOUNTS_HEAD",
  "FINANCE",
  "FINANCE_HEAD",
  "BILLING",
  "REFUND_OPS",
  "PAYOUTS",
  "COLLECTIONS",
  "CHIEF_FINANCIAL_OFFICER",
]);

const AUDIT_ROLES = new Set([
  "AUDIT",
  "AUDITOR",
  "QUALITY",
  "QUALITY_AUDIT",
  "QA",
  "COMPLIANCE",
  "QUALITY_HEAD",
  "TRAINING_MANAGER",
]);

export function normalizeRole(value: unknown) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

export function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function hasCompanyEmail(email: unknown) {
  return normalizeEmail(email).endsWith("@speedfix.co.in");
}

export function formatRoleLabel(role: unknown) {
  const normalized = normalizeRole(role);

  if (!normalized) {
    return "Customer";
  }

  return normalized
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isActivePortalUser(record: unknown) {
  if (!record || typeof record !== "object") {
    return false;
  }

  const user = record as PortalUserRecord;
  const explicitFlags = [
    user.isActive,
    user.active,
    user.employeeActive,
    user.employmentActive,
  ].filter((value): value is boolean => typeof value === "boolean");

  if (explicitFlags.includes(false)) {
    return false;
  }

  const status = normalizeRole(
    user.employmentStatus || user.employeeStatus || user.status
  );

  if (
    status &&
    !["ACTIVE", "APPROVED", "ENABLED", "VERIFIED", "CUSTOMER"].includes(status)
  ) {
    return false;
  }

  return true;
}

export function hasHrIdentity(email: unknown, role?: unknown) {
  const normalizedRole = normalizeRole(role);

  if (HR_ROLES.has(normalizedRole)) {
    return true;
  }

  const normalizedEmail = normalizeEmail(email);
  const localPart = normalizedEmail.split("@")[0] || "";

  return /(^|[._-])(hr|recruit|talent)([._-]|$)/.test(localPart);
}

export function hasRecruiterIdentity(email: unknown, role?: unknown) {
  const normalizedRole = normalizeRole(role);

  if (RECRUITER_ROLES.has(normalizedRole)) {
    return true;
  }

  const normalizedEmail = normalizeEmail(email);
  const localPart = normalizedEmail.split("@")[0] || "";

  return /(^|[._-])(recruit|talent)([._-]|$)/.test(localPart);
}

export function canPostCareerAccess(input: {
  email?: unknown;
  role?: unknown;
}) {
  return hasHrIdentity(input.email, input.role);
}

export function canAccessWorkspace(
  record: unknown,
  workspace: WorkspaceKey,
  emailOverride?: unknown
) {
  if (!record || typeof record !== "object") {
    return false;
  }

  const user = record as PortalUserRecord;
  const role = normalizeRole(user.role);
  const email = emailOverride ?? user.email;

  if (!isActivePortalUser(user)) {
    return false;
  }

  if (workspace === "customer") {
    return true;
  }

  if (!hasCompanyEmail(email)) {
    return false;
  }

  if (FOUNDER_ROLES.has(role)) {
    return true;
  }

  if (workspace === "founder") {
    return FOUNDER_ROLES.has(role);
  }

  if (workspace === "agent") {
    return isActiveAgentUser(user);
  }

  if (workspace === "corporate") {
    return isActiveCorporateEmployee(user);
  }

  if (workspace === "hr") {
    return hasHrIdentity(email, role);
  }

  if (workspace === "admin") {
    return ADMIN_ROLES.has(role);
  }

  if (workspace === "accounts") {
    return ACCOUNTS_ROLES.has(role) || role === ROLES.BUSINESS_HEAD;
  }

  if (workspace === "audit") {
    return AUDIT_ROLES.has(role) || role === ROLES.BUSINESS_HEAD;
  }

  return false;
}

export function getDefaultWorkspaceHref(
  record: unknown,
  emailOverride?: unknown
) {
  if (canAccessWorkspace(record, "corporate", emailOverride)) {
    return getCorporateHomeHref(record, emailOverride);
  }

  if (canAccessWorkspace(record, "agent", emailOverride)) {
    return "/agent";
  }

  return "/customer";
}

export function getCorporateHomeHref(
  record: unknown,
  emailOverride?: unknown
) {
  if (!record || typeof record !== "object") {
    return "/corporate";
  }

  const user = record as PortalUserRecord;
  const role = normalizeRole(user.role);
  const email = emailOverride ?? user.email;

  if (role === ROLES.FOUNDER || role === ROLES.BUSINESS_HEAD) {
    return "/corporate/command-center/daily-brief";
  }

  if (hasHrIdentity(email, role)) {
    if (hasRecruiterIdentity(email, role)) {
      return "/corporate/hr/recruiter-desk";
    }

    return "/corporate/hr/access-control";
  }

  if (ACCOUNTS_ROLES.has(role)) {
    return "/corporate/finance/payment-watch";
  }

  if (AUDIT_ROLES.has(role)) {
    return "/corporate/quality/service-audits";
  }

  if (ADMIN_ROLES.has(role)) {
    return "/corporate/catalog/portal-settings";
  }

  if (
    role === ROLES.OPERATIONS ||
    role === ROLES.CITY_MANAGER ||
    role === ROLES.STATE_MANAGER ||
    role === "ZONE_MANAGER" ||
    role === "CLUSTER_MANAGER" ||
    role === "OPERATIONS_MANAGER" ||
    role === "DISPATCHER" ||
    role === "SCHEDULING_COORDINATOR" ||
    role === "FIELD_SUPERVISOR"
  ) {
    return "/corporate/operations/bookings-desk";
  }

  return "/corporate";
}
