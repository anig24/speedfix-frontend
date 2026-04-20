import {
  BarChart3,
  BadgeIndianRupee,
  BellRing,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Headset,
  Layers3,
  LifeBuoy,
  MapPinned,
  NotebookText,
  Radar,
  ReceiptIndianRupee,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRoundCheck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CorporateSubcategory = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  responsibilities: string[];
  quickActions: string[];
  insights: string[];
};

export type CorporateSection = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  summaryStats: string[];
  subcategories: CorporateSubcategory[];
};

export const corporateSections: CorporateSection[] = [
  {
    slug: "command-center",
    title: "Command Center",
    eyebrow: "Daily mission control",
    description:
      "A premium company workspace for leadership view, shift planning, SLA watch, and request prioritization across all cities.",
    icon: BriefcaseBusiness,
    accent: "from-slate-950 via-slate-900 to-slate-700",
    summaryStats: ["Shift-ready task board", "Click-through control tiles", "Ops-first overview"],
    subcategories: [
      {
        slug: "daily-brief",
        title: "Daily Brief",
        summary: "Plan today’s top priorities before the first field team goes live.",
        description:
          "Review day-start priorities, monitor capacity, and coordinate the most urgent backlog before service windows open.",
        responsibilities: [
          "Review first-response commitments by city",
          "Flag urgent requests and delayed revisits",
          "Confirm team readiness and coverage balance",
        ],
        quickActions: [
          "Publish shift priorities",
          "Escalate high-risk tickets",
          "Check pending approvals",
        ],
        insights: [
          "Built for managers who need the whole day in one glance",
          "Best used as the first stop after employee login",
        ],
      },
      {
        slug: "task-board",
        title: "Task Board",
        summary: "Every active company task, grouped by urgency and ownership.",
        description:
          "Track operational, support, and finance work from one corporate board instead of jumping between scattered pages.",
        responsibilities: [
          "Sort tasks by team and urgency",
          "Track blocked items and handoffs",
          "Keep action queues visible to every active employee",
        ],
        quickActions: [
          "Open priority queues",
          "Assign internal follow-up",
          "Mark a blocker for review",
        ],
        insights: [
          "Designed for all-company task visibility",
          "Useful when cross-team actions need a single command view",
        ],
      },
      {
        slug: "sla-watch",
        title: "SLA Watch",
        summary: "See which requests are closest to breaching service promises.",
        description:
          "Monitor time-sensitive bookings, escalations, and refunds that need immediate internal action.",
        responsibilities: [
          "Catch delayed job acceptance",
          "Track escalation turnaround windows",
          "Review payment or booking exceptions before breach",
        ],
        quickActions: [
          "Highlight overdue items",
          "Push to operations",
          "Push to support",
        ],
        insights: [
          "Focused on risk, not raw volume",
          "Helps managers keep premium service standards intact",
        ],
      },
    ],
  },
  {
    slug: "operations",
    title: "Operations",
    eyebrow: "Service fulfillment",
    description:
      "Own the lifecycle of every booking: request intake, technician allocation, city coverage, and revisit planning.",
    icon: ClipboardList,
    accent: "from-orange-500 via-amber-500 to-yellow-400",
    summaryStats: ["Bookings desk", "Allocation queues", "Coverage controls"],
    subcategories: [
      {
        slug: "bookings-desk",
        title: "Bookings Desk",
        summary: "Monitor fresh customer demand and next-action status.",
        description:
          "This is the primary booking queue for reviewing new service requests, pending confirmations, and customer slot changes.",
        responsibilities: [
          "Review new booking intake from the website",
          "Confirm slots and handle reschedule demand",
          "Track pending, confirmed, in-progress, and completed work",
        ],
        quickActions: [
          "Open today’s incoming requests",
          "Review pending confirmations",
          "Check high-priority jobs",
        ],
        insights: [
          "Best entry point for daily booking operations",
          "Pairs naturally with technician allocation and SLA watch",
        ],
      },
      {
        slug: "technician-allocation",
        title: "Technician Allocation",
        summary: "Match the right service partner to the right booking window.",
        description:
          "Use this area to coordinate assignment quality, travel load, and skill fit for every confirmed or urgent request.",
        responsibilities: [
          "Review available field capacity",
          "Assign and rebalance technicians by zone",
          "Handle failed or delayed assignments quickly",
        ],
        quickActions: [
          "Open assignment queue",
          "Check unassigned jobs",
          "Review technician coverage",
        ],
        insights: [
          "Built for ops staff who manage daily field movement",
          "Useful when you need a cleaner assignment view than the old admin screens",
        ],
      },
      {
        slug: "city-coverage",
        title: "City Coverage",
        summary: "Control service availability across cities and pincodes.",
        description:
          "Use pincode-level availability and capacity rules to expand, pause, or optimize your operational footprint.",
        responsibilities: [
          "Review active cities and serviceable pincodes",
          "Spot weak zones before new campaigns go live",
          "Align catalog availability with field capacity",
        ],
        quickActions: [
          "Open active cities",
          "Review pincode serviceability",
          "Check seasonal demand pressure",
        ],
        insights: [
          "Helps connect category growth with actual service readiness",
          "Prevents overselling in thin coverage areas",
        ],
      },
      {
        slug: "revisit-queue",
        title: "Revisit Queue",
        summary: "Track callbacks, service recovery visits, and rework demand.",
        description:
          "A dedicated subcategory for post-service tasks that need operational ownership without mixing into net-new bookings.",
        responsibilities: [
          "Manage repeat visits separately from new demand",
          "Track recovery tasks and exceptions",
          "Escalate quality-linked revisits to the right team",
        ],
        quickActions: [
          "Open revisit backlog",
          "Review customer recovery jobs",
          "Check aging revisits",
        ],
        insights: [
          "Keeps rework visible instead of hiding it in the main queue",
          "Useful for premium quality follow-through",
        ],
      },
    ],
  },
  {
    slug: "support",
    title: "Support",
    eyebrow: "Customer resolution",
    description:
      "Handle escalations, service recovery, issue ownership, and post-service communication in one dedicated company section.",
    icon: Headset,
    accent: "from-cyan-500 via-sky-500 to-blue-600",
    summaryStats: ["Tickets", "Escalations", "Refund and revisit review"],
    subcategories: [
      {
        slug: "customer-tickets",
        title: "Customer Tickets",
        summary: "Handle questions, complaints, and status requests with proper ownership.",
        description:
          "This area centralizes inbound support tasks for live bookings, pre-service concerns, and follow-up queries.",
        responsibilities: [
          "Own inbound customer tickets",
          "Coordinate with operations for live-job questions",
          "Close requests with clear final status",
        ],
        quickActions: [
          "Open unresolved tickets",
          "Review first-response queue",
          "Check callbacks due today",
        ],
        insights: [
          "Best for support specialists handling active demand",
          "Works alongside bookings desk without mixing responsibilities",
        ],
      },
      {
        slug: "escalation-desk",
        title: "Escalation Desk",
        summary: "Escalate only the issues that need management-level attention.",
        description:
          "Use a separate path for sensitive service failures, high-value customer recovery, and policy exceptions.",
        responsibilities: [
          "Prioritize escalations by severity and customer impact",
          "Coordinate multi-team issue handling",
          "Track resolution deadlines carefully",
        ],
        quickActions: [
          "Review critical escalations",
          "Flag service failures",
          "Assign executive follow-up",
        ],
        insights: [
          "Keeps normal support work separate from executive recovery cases",
          "Useful for maintaining a premium service reputation",
        ],
      },
      {
        slug: "refund-review",
        title: "Refund Review",
        summary: "Screen refund and compensation requests with better context.",
        description:
          "A dedicated support-finance crossover lane for reviewing refund cases before approval or rejection.",
        responsibilities: [
          "Review refund eligibility",
          "Check linked service issues and payment events",
          "Prepare approved cases for settlement action",
        ],
        quickActions: [
          "Open pending refund cases",
          "Check evidence and notes",
          "Route approved cases to finance",
        ],
        insights: [
          "Keeps revenue-impacting support decisions visible",
          "Helps avoid loose manual follow-up",
        ],
      },
    ],
  },
  {
    slug: "finance",
    title: "Finance",
    eyebrow: "Revenue and settlement",
    description:
      "Monitor payment health, payouts, reconciliations, and operational revenue issues without building HR or employee tools here.",
    icon: BadgeIndianRupee,
    accent: "from-emerald-500 via-teal-500 to-green-600",
    summaryStats: ["Payments", "Settlements", "Revenue issue handling"],
    subcategories: [
      {
        slug: "payment-watch",
        title: "Payment Watch",
        summary: "Monitor payment creation, verification, and booking-linked failures.",
        description:
          "This view is for spotting broken payment journeys, verifying completed orders, and reviewing revenue-impacting issues.",
        responsibilities: [
          "Review failed or incomplete payment flows",
          "Track booking payment verification status",
          "Check financial exceptions before they become support cases",
        ],
        quickActions: [
          "Open payment exceptions",
          "Review pending verifications",
          "Check high-value failed orders",
        ],
        insights: [
          "Most useful for finance and operations crossover work",
          "Pairs naturally with refund review in support",
        ],
      },
      {
        slug: "settlement-calendar",
        title: "Settlement Calendar",
        summary: "Organize payout timing and internal finance follow-up.",
        description:
          "Use this space to keep daily settlement workflows structured, especially where approvals and release timing matter.",
        responsibilities: [
          "Review today’s payout commitments",
          "Track pending settlement approvals",
          "Keep exceptions visible before payout release",
        ],
        quickActions: [
          "Open pending settlements",
          "Review payout blockers",
          "Export finance follow-up list",
        ],
        insights: [
          "A cleaner landing point for payout and release timing",
          "Built to feel like a task system, not just a ledger",
        ],
      },
      {
        slug: "invoice-audit",
        title: "Invoice Audit",
        summary: "Review invoice and receipt consistency across the platform.",
        description:
          "Create a cleaner internal process for checking amounts, adjustments, and supporting records.",
        responsibilities: [
          "Audit invoice values against bookings",
          "Review manual edits and adjustments",
          "Keep finance notes organized for disputes",
        ],
        quickActions: [
          "Open invoice checks",
          "Review manual adjustments",
          "Mark cases for policy review",
        ],
        insights: [
          "Useful for finance hygiene and reconciliation quality",
          "Keeps financial exceptions from staying invisible",
        ],
      },
    ],
  },
  {
    slug: "quality",
    title: "Quality",
    eyebrow: "Standards and control",
    description:
      "Track service quality, audit trails, customer sentiment, and safety-linked incidents in one premium review workspace.",
    icon: ShieldCheck,
    accent: "from-violet-500 via-fuchsia-500 to-pink-500",
    summaryStats: ["Audits", "Feedback recovery", "Incident review"],
    subcategories: [
      {
        slug: "service-audits",
        title: "Service Audits",
        summary: "Review quality checkpoints across bookings and field execution.",
        description:
          "A structured home for service review, exception detection, and audit notes tied to actual jobs.",
        responsibilities: [
          "Audit booking execution quality",
          "Track patterns in service failure",
          "Escalate repeat gaps to the right teams",
        ],
        quickActions: [
          "Open audit list",
          "Review repeat issues",
          "Export flagged jobs",
        ],
        insights: [
          "Best used when quality control needs a sharper workflow",
          "Designed to support premium, repeatable standards",
        ],
      },
      {
        slug: "feedback-recovery",
        title: "Feedback Recovery",
        summary: "Turn negative customer feedback into a structured recovery process.",
        description:
          "This lane keeps poor reviews, unhappy customers, and save-worthy accounts visible to support and leadership.",
        responsibilities: [
          "Review poor ratings and complaints",
          "Plan recovery callbacks or revisits",
          "Close loops with documented outcomes",
        ],
        quickActions: [
          "Open low-rating list",
          "Assign callback follow-up",
          "Route to support or operations",
        ],
        insights: [
          "Useful when premium positioning matters as much as job completion",
          "Creates clearer accountability for review recovery",
        ],
      },
      {
        slug: "incident-monitor",
        title: "Incident Monitor",
        summary: "Track safety, conduct, and policy-sensitive cases.",
        description:
          "A cleaner company route for incidents that should never get buried inside normal support or operations traffic.",
        responsibilities: [
          "Track safety and conduct incidents",
          "Keep sensitive notes in a dedicated workflow",
          "Escalate time-critical cases immediately",
        ],
        quickActions: [
          "Open active incidents",
          "Review recent case notes",
          "Trigger management review",
        ],
        insights: [
          "Separates sensitive issues from regular task flow",
          "Important for governance and brand protection",
        ],
      },
    ],
  },
  {
    slug: "catalog",
    title: "Catalog",
    eyebrow: "Categories and controls",
    description:
      "Manage service categories, subcategories, pricing logic, city rollout, and platform-level controls without mixing in employee tools.",
    icon: Layers3,
    accent: "from-rose-500 via-orange-500 to-amber-500",
    summaryStats: ["Service categories", "Subcategories", "Pricing and rules"],
    subcategories: [
      {
        slug: "category-builder",
        title: "Category Builder",
        summary: "Manage core service groups shown on the consumer website.",
        description:
          "This area is for shaping how services are organized, named, and highlighted on the public-facing platform.",
        responsibilities: [
          "Review top-level category structure",
          "Adjust placement for high-demand services",
          "Keep naming and positioning premium and clear",
        ],
        quickActions: [
          "Open service categories",
          "Review homepage groups",
          "Plan seasonal highlights",
        ],
        insights: [
          "Useful when the catalog needs a cleaner, more premium presentation",
          "Connects directly to how customers discover services",
        ],
      },
      {
        slug: "sub-category-matrix",
        title: "Sub-category Matrix",
        summary: "Every category with its clickable service subcategories.",
        description:
          "A dedicated structure for keeping subcategories visible, clickable, and operationally meaningful across the website.",
        responsibilities: [
          "Review subcategory depth by service line",
          "Keep navigation intuitive and clickable",
          "Align booking form language with operational reality",
        ],
        quickActions: [
          "Open subcategory list",
          "Review service package mapping",
          "Check city-specific availability",
        ],
        insights: [
          "This directly answers the need for categories with subcategories",
          "Prevents shallow category pages that feel unfinished",
        ],
      },
      {
        slug: "pricing-cards",
        title: "Pricing Cards",
        summary: "Maintain premium-looking, consistent package and add-on pricing.",
        description:
          "Use this section to review visit charges, package structure, and price card clarity across the consumer journey.",
        responsibilities: [
          "Review package entry prices",
          "Keep add-on logic consistent",
          "Prepare pricing updates for campaigns or city rollout",
        ],
        quickActions: [
          "Open package cards",
          "Review add-on pricing",
          "Check service-level margins",
        ],
        insights: [
          "Helps keep premium design matched with clean commercial logic",
          "Important when the homepage and service pages are conversion-focused",
        ],
      },
      {
        slug: "portal-settings",
        title: "Portal Settings",
        summary: "Manage company-facing controls, alerts, and platform defaults.",
        description:
          "A company settings lane for notifications, governance preferences, and internal control surfaces, without employee management features.",
        responsibilities: [
          "Review company-side portal settings",
          "Keep alerts and defaults clean",
          "Manage the internal experience structure",
        ],
        quickActions: [
          "Open portal settings",
          "Review notification rules",
          "Check access messaging",
        ],
        insights: [
          "Keeps internal controls visible under /corporate",
          "Intentionally excludes employee management scope",
        ],
      },
    ],
  },
];

export function getCorporateSectionBySlug(slug: string) {
  return corporateSections.find((section) => section.slug === slug);
}

export function getCorporateSubcategory(sectionSlug: string, subSlug: string) {
  const section = getCorporateSectionBySlug(sectionSlug);

  if (!section) {
    return null;
  }

  const subcategory = section.subcategories.find((item) => item.slug === subSlug);

  if (!subcategory) {
    return null;
  }

  return {
    section,
    subcategory,
  };
}

export const corporateHighlights = [
  {
    icon: Radar,
    title: "Premium internal flow",
    description:
      "The company side now feels like a proper control room instead of a loose collection of old pages.",
  },
  {
    icon: UserRoundCheck,
    title: "Employee-only access",
    description:
      "The /corporate area is gated for active company employees instead of mixing with customer sign-in.",
  },
  {
    icon: NotebookText,
    title: "Task-first structure",
    description:
      "Every category has clickable subcategories so teams can move from overview to action without dead ends.",
  },
];

export const corporateQuickLinks = [
  {
    title: "Operations Queue",
    href: "/corporate/operations/bookings-desk",
    icon: Wrench,
  },
  {
    title: "Escalation Desk",
    href: "/corporate/support/escalation-desk",
    icon: LifeBuoy,
  },
  {
    title: "Payment Watch",
    href: "/corporate/finance/payment-watch",
    icon: ReceiptIndianRupee,
  },
  {
    title: "Sub-category Matrix",
    href: "/corporate/catalog/sub-category-matrix",
    icon: SlidersHorizontal,
  },
  {
    title: "Service Audits",
    href: "/corporate/quality/service-audits",
    icon: Sparkles,
  },
  {
    title: "Portal Settings",
    href: "/corporate/catalog/portal-settings",
    icon: Settings2,
  },
];

export const corporateLegacyRedirects: Record<string, string> = {
  "/admin": "/corporate/command-center",
  "/admin/bookings": "/corporate/operations/bookings-desk",
  "/admin/cities": "/corporate/operations/city-coverage",
  "/admin/payments": "/corporate/finance/payment-watch",
  "/admin/support": "/corporate/support/customer-tickets",
  "/admin/audit": "/corporate/quality/service-audits",
  "/admin/settings": "/corporate/catalog/portal-settings",
  "/admin/analytics": "/corporate/command-center/sla-watch",
  "/admin/technicians": "/corporate/operations/technician-allocation",
  "/admin/users": "/corporate/command-center/task-board",
  "/dashboard": "/corporate/command-center",
  "/executive": "/corporate/command-center",
  "/management": "/corporate/command-center/daily-brief",
  "/operations": "/corporate/operations",
  "/support": "/corporate/support",
  "/corporateStaff": "/corporate/command-center/task-board",
  "/entry": "/corporate/command-center/daily-brief",
  "/hr": "/corporate/catalog/portal-settings",
};

export const corporateHiddenFromPublicFooter = ["/corporate", "/corporate/login"];

export const corporateSidebarFooterLinks = [
  { label: "Portal Settings", href: "/corporate/catalog/portal-settings", icon: BellRing },
  { label: "Category Builder", href: "/corporate/catalog/category-builder", icon: Building2 },
  { label: "Audit and Quality", href: "/corporate/quality/service-audits", icon: BarChart3 },
  { label: "Coverage Matrix", href: "/corporate/operations/city-coverage", icon: MapPinned },
];
