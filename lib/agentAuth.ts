import { ROLES } from "@/lib/roles";

const AGENT_ROLES = new Set([
  ROLES.SUPPORT,
  "AGENT",
  "SENIOR_AGENT",
  "TEAM_LEAD",
  "CALL_AGENT",
  "CUSTOMER_SUCCESS",
  "SUPPORT_LEAD",
]);

export type AgentUserRecord = {
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

export const AGENT_SESSION_COOKIE = "speedfix_agent_session";

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function flagValue(value: unknown) {
  return typeof value === "boolean" ? value : null;
}

export function getAgentRoleLabel(role: unknown) {
  const normalized = normalizeString(role);

  if (!normalized) {
    return "Support Agent";
  }

  return normalized
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isActiveAgentUser(record: unknown) {
  if (!record || typeof record !== "object") {
    return false;
  }

  const user = record as AgentUserRecord;
  const role = normalizeString(user.role);

  if (!AGENT_ROLES.has(role)) {
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
