import { corporateSections, type CorporateSection } from "@/lib/corporatePortal";
import {
  canAccessWorkspace,
  hasHrIdentity,
  hasRecruiterIdentity,
  normalizeRole,
  type PortalUserRecord,
} from "@/lib/portalAccess";
import { ROLES } from "@/lib/roles";

type AllowedSubcategoryMap = Record<string, string[] | "*">;

export type CorporateDashboardScope = {
  key:
    | "executive"
    | "command"
    | "operations"
    | "hr"
    | "recruiter"
    | "finance"
    | "quality"
    | "catalog";
  label: string;
  badge: string;
  description: string;
  homeHref: string;
  sectionSlugs: string[];
  allowedSubcategories: AllowedSubcategoryMap;
};

const ACCOUNTS_ROLES = new Set([
  "ACCOUNTS",
  "ACCOUNTANT",
  "ACCOUNTS_HEAD",
  "FINANCE",
  "FINANCE_HEAD",
  "BILLING",
  "REFUND_OPS",
]);

const AUDIT_ROLES = new Set([
  "AUDIT",
  "AUDITOR",
  "QUALITY",
  "QUALITY_AUDIT",
  "QA",
  "COMPLIANCE",
]);

const CATALOG_ROLES = new Set([
  "ADMIN",
  "SUPER_ADMIN",
  "CATALOG",
  "CATEGORY_MANAGER",
  "PRICING",
]);

const OPERATIONS_ROLES = new Set([
  ROLES.OPERATIONS,
  ROLES.CITY_MANAGER,
  ROLES.STATE_MANAGER,
  "OPERATIONS_ADMIN",
  "SERVICE_HEAD",
]);

const ALL_ALLOWED_SUBCATEGORIES: AllowedSubcategoryMap = corporateSections.reduce<
  AllowedSubcategoryMap
>((result, section) => {
  result[section.slug] = "*";
  return result;
}, {});

const COMMAND_ALLOWED_SUBCATEGORIES: AllowedSubcategoryMap = {
  "command-center": "*",
};

const OPERATIONS_ALLOWED_SUBCATEGORIES: AllowedSubcategoryMap = {
  operations: "*",
};

const HR_ALLOWED_SUBCATEGORIES: AllowedSubcategoryMap = {
  hr: "*",
};

const RECRUITER_ALLOWED_SUBCATEGORIES: AllowedSubcategoryMap = {
  hr: ["recruiter-desk", "careers-posting"],
};

const FINANCE_ALLOWED_SUBCATEGORIES: AllowedSubcategoryMap = {
  finance: "*",
};

const QUALITY_ALLOWED_SUBCATEGORIES: AllowedSubcategoryMap = {
  quality: "*",
};

const CATALOG_ALLOWED_SUBCATEGORIES: AllowedSubcategoryMap = {
  catalog: "*",
};

function createScope(
  scope: CorporateDashboardScope
): CorporateDashboardScope {
  return scope;
}

export function getCorporateDashboardScope(
  record: unknown,
  emailOverride?: unknown
) {
  if (!canAccessWorkspace(record, "corporate", emailOverride)) {
    return null;
  }

  const user = (record || {}) as PortalUserRecord;
  const role = normalizeRole(user.role);
  const email = emailOverride ?? user.email;

  if (role === ROLES.FOUNDER || role === ROLES.BUSINESS_HEAD) {
    return createScope({
      key: "executive",
      label: "Executive Command",
      badge: "Leadership workspace",
      description:
        "A role-scoped leadership workspace for cross-team oversight, city readiness, quality review, and internal control.",
      homeHref: "/corporate/command-center/daily-brief",
      sectionSlugs: corporateSections.map((section) => section.slug),
      allowedSubcategories: ALL_ALLOWED_SUBCATEGORIES,
    });
  }

  if (hasRecruiterIdentity(email, role)) {
    return createScope({
      key: "recruiter",
      label: "Recruiter Desk",
      badge: "Hiring workspace",
      description:
        "Focused on hiring demand, recruiter follow-through, and careers operations without exposing unrelated company dashboards.",
      homeHref: "/corporate/hr/recruiter-desk",
      sectionSlugs: ["hr"],
      allowedSubcategories: RECRUITER_ALLOWED_SUBCATEGORIES,
    });
  }

  if (hasHrIdentity(email, role)) {
    return createScope({
      key: "hr",
      label: "HR Workspace",
      badge: "People operations",
      description:
        "Handle company access, recruiter coordination, and employee onboarding from a dedicated HR lane inside corporate.",
      homeHref: "/corporate/hr/access-control",
      sectionSlugs: ["hr"],
      allowedSubcategories: HR_ALLOWED_SUBCATEGORIES,
    });
  }

  if (ACCOUNTS_ROLES.has(role)) {
    return createScope({
      key: "finance",
      label: "Finance Control",
      badge: "Finance workspace",
      description:
        "Own payment health, settlement follow-through, and invoice review without mixing into support or hiring dashboards.",
      homeHref: "/corporate/finance/payment-watch",
      sectionSlugs: ["finance"],
      allowedSubcategories: FINANCE_ALLOWED_SUBCATEGORIES,
    });
  }

  if (AUDIT_ROLES.has(role)) {
    return createScope({
      key: "quality",
      label: "Quality and Audit",
      badge: "Governance workspace",
      description:
        "Review service quality, incident handling, and recovery workflows from a dedicated quality-control dashboard.",
      homeHref: "/corporate/quality/service-audits",
      sectionSlugs: ["quality"],
      allowedSubcategories: QUALITY_ALLOWED_SUBCATEGORIES,
    });
  }

  if (CATALOG_ROLES.has(role)) {
    return createScope({
      key: "catalog",
      label: "Catalog Control",
      badge: "Platform controls",
      description:
        "Manage categories, pricing surfaces, and internal platform settings without exposing broader operations panels.",
      homeHref: "/corporate/catalog/portal-settings",
      sectionSlugs: ["catalog"],
      allowedSubcategories: CATALOG_ALLOWED_SUBCATEGORIES,
    });
  }

  if (role === ROLES.STATE_MANAGER || role === ROLES.CITY_MANAGER) {
    return createScope({
      key: "operations",
      label: "Operations Command",
      badge: "Field operations",
      description:
        "A role-based operating view for booking flow, technician movement, and city readiness with leadership-level operational visibility.",
      homeHref: "/corporate/command-center/daily-brief",
      sectionSlugs: ["command-center", "operations"],
      allowedSubcategories: {
        ...COMMAND_ALLOWED_SUBCATEGORIES,
        ...OPERATIONS_ALLOWED_SUBCATEGORIES,
      },
    });
  }

  if (OPERATIONS_ROLES.has(role)) {
    return createScope({
      key: "operations",
      label: "Operations Desk",
      badge: "Field operations",
      description:
        "Track live booking queues, assignment flow, revisit work, and service coverage from an operations-only dashboard.",
      homeHref: "/corporate/operations/bookings-desk",
      sectionSlugs: ["operations"],
      allowedSubcategories: OPERATIONS_ALLOWED_SUBCATEGORIES,
    });
  }

  return createScope({
    key: "command",
    label: "Corporate Desk",
    badge: "Company workspace",
    description:
      "A limited command view for approved company employees with only their internal operating lane exposed.",
    homeHref: "/corporate/command-center/daily-brief",
    sectionSlugs: ["command-center"],
    allowedSubcategories: COMMAND_ALLOWED_SUBCATEGORIES,
  });
}

export function getCorporateSectionsForScope(scope: CorporateDashboardScope) {
  return corporateSections.filter((section) => scope.sectionSlugs.includes(section.slug));
}

export function getCorporateSubcategoriesForScope(
  section: CorporateSection,
  scope: CorporateDashboardScope
) {
  const allowed = scope.allowedSubcategories[section.slug];

  if (!allowed || allowed === "*") {
    return section.subcategories;
  }

  return section.subcategories.filter((subcategory) =>
    allowed.includes(subcategory.slug)
  );
}

export function canAccessCorporatePath(
  pathname: string,
  scope: CorporateDashboardScope
) {
  if (!pathname.startsWith("/corporate")) {
    return true;
  }

  const segments = pathname.split("?")[0].split("/").filter(Boolean);

  if (segments.length <= 1) {
    return true;
  }

  const sectionSlug = segments[1];

  if (!scope.sectionSlugs.includes(sectionSlug)) {
    return false;
  }

  const subSlug = segments[2];

  if (!subSlug) {
    return true;
  }

  const allowedSubcategories = scope.allowedSubcategories[sectionSlug];

  if (!allowedSubcategories || allowedSubcategories === "*") {
    return true;
  }

  return allowedSubcategories.includes(subSlug);
}
