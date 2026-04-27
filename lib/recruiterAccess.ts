import {
  canPostCareerAccess,
  hasHrIdentity,
  normalizeRole,
} from "@/lib/portalAccess";

export { normalizeRole };

export function canPostCareerRole(role: unknown) {
  return hasHrIdentity("", role);
}

export function canPostCareerIdentity(input: {
  email?: unknown;
  role?: unknown;
}) {
  return canPostCareerAccess(input);
}
