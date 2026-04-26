const CAREER_POSTING_ROLES = new Set([
  "HR",
  "HEAD_HR",
  "JR_HR",
  "HR_INTERN",
  "RECRUITER",
  "HEAD_RECRUITER",
]);

export function normalizeRole(value: unknown) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

export function canPostCareerRole(role: unknown) {
  return CAREER_POSTING_ROLES.has(normalizeRole(role));
}
