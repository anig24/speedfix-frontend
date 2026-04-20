import { ROLES } from "@/lib/roles";

const COMPANY_ROLES = new Set([
  ROLES.FOUNDER,
  ROLES.BUSINESS_HEAD,
  ROLES.STATE_MANAGER,
  ROLES.CITY_MANAGER,
  ROLES.OPERATIONS,
  ROLES.SUPPORT,
  ROLES.STAFF,
  "MANAGEMENT",
  "ENTRY",
  "HR",
]);

export type CorporateUserRecord = {
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
  portalType?: string;
  portalAccess?: string;
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function flagValue(value: unknown) {
  return typeof value === "boolean" ? value : null;
}

export function getCorporateRoleLabel(role: unknown) {
  const normalized = normalizeString(role);

  if (!normalized) {
    return "Company Employee";
  }

  return normalized
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isActiveCorporateEmployee(record: unknown) {
  if (!record || typeof record !== "object") {
    return false;
  }

  const user = record as CorporateUserRecord;
  const role = normalizeString(user.role);

  if (!COMPANY_ROLES.has(role)) {
    return false;
  }

  const explicitFlags = [
    flagValue(user.isActive),
    flagValue(user.active),
    flagValue(user.employeeActive),
    flagValue(user.employmentActive),
  ].filter((value): value is boolean => value !== null);

  if (explicitFlags.includes(false)) {
    return false;
  }

  const status = normalizeString(
    user.employmentStatus || user.employeeStatus || user.status
  );

  if (status && !["ACTIVE", "APPROVED", "ENABLED", "VERIFIED"].includes(status)) {
    return false;
  }

  const portal = normalizeString(user.portalType || user.portalAccess);

  if (portal && ["CUSTOMER", "CONSUMER"].includes(portal)) {
    return false;
  }

  return true;
}

export const CORPORATE_SESSION_COOKIE = "speedfix_corporate_session";
