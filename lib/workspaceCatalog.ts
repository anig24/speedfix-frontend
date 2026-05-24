import {
  BadgeIndianRupee,
  BriefcaseBusiness,
  Crown,
  Headset,
  House,
  LucideIcon,
  Settings2,
  ShieldCheck,
  UserRoundSearch,
} from "lucide-react";
import { canAccessWorkspace, type WorkspaceKey } from "@/lib/portalAccess";

export type WorkspaceNavItem = {
  key: WorkspaceKey;
  href: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
};

export type WorkspaceBlueprint = {
  badge: string;
  title: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
    hint: string;
  }>;
  actions: Array<{
    label: string;
    href: string;
    note: string;
  }>;
  lanes: Array<{
    title: string;
    description: string;
    items: string[];
  }>;
  notes: string[];
};

export const workspaceNavigation: WorkspaceNavItem[] = [
  {
    key: "customer",
    href: "/customer",
    label: "Customer Dashboard",
    shortLabel: "Customer",
    description: "Track bookings, checkout progress, coupons, and support.",
    icon: House,
  },
  {
    key: "agent",
    href: "/agent",
    label: "Agent Workspace",
    shortLabel: "Agent",
    description: "Handle calls, follow-ups, escalations, and customer callbacks.",
    icon: Headset,
  },
  {
    key: "corporate",
    href: "/corporate",
    label: "Corporate Workspace",
    shortLabel: "Corporate",
    description:
      "Single company dashboard for HR, operations, finance, quality, and leadership teams.",
    icon: BriefcaseBusiness,
  },
  {
    key: "hr",
    href: "/corporate/hr/access-control",
    label: "HR Dashboard",
    shortLabel: "HR",
    description: "Employee access, recruiter desk, and hiring operations.",
    icon: UserRoundSearch,
  },
  {
    key: "admin",
    href: "/corporate/catalog/portal-settings",
    label: "Admin Dashboard",
    shortLabel: "Admin",
    description: "Catalog, city controls, and platform operating settings.",
    icon: Settings2,
  },
  {
    key: "accounts",
    href: "/corporate/finance/payment-watch",
    label: "Accounts Dashboard",
    shortLabel: "Accounts",
    description: "Payment watch, refunds, settlement, and payout follow-through.",
    icon: BadgeIndianRupee,
  },
  {
    key: "audit",
    href: "/audit",
    label: "Audit Dashboard",
    shortLabel: "Audit",
    description: "Quality review, incidents, compliance, and recovery checks.",
    icon: ShieldCheck,
  },
  {
    key: "founder",
    href: "/corporate/command-center/daily-brief",
    label: "Founder Dashboard",
    shortLabel: "Founder",
    description: "All-access leadership command across every operating lane.",
    icon: Crown,
  },
];

export const workspaceBlueprints: Record<WorkspaceKey, WorkspaceBlueprint> = {
  customer: {
    badge: "Customer dashboard",
    title: "Bookings, address management, live support, and checkout follow-through",
    description:
      "Give customers one place to review active services, reopen the cart, use the first-booking offer, and connect to support without hunting through the site.",
    stats: [
      { label: "Active service flow", value: "Cart to checkout", hint: "Pick services, apply coupon, and finish payment in one path." },
      { label: "Offer visibility", value: "WELCOME30", hint: "30% off is always visible at booking time." },
      { label: "Support coverage", value: "24/7 AI chat", hint: "Tawk AI can guide customers before a human takes over." },
    ],
    actions: [
      { label: "Browse all services", href: "/services", note: "Open categories and subcategories." },
      { label: "Continue to cart", href: "/cart", note: "Review package and add-on selections." },
      { label: "Go to checkout", href: "/checkout", note: "Add address, coupon, and payment choice." },
    ],
    lanes: [
      {
        title: "Booking control",
        description: "Keep the customer journey moving after service discovery.",
        items: ["Review saved cart items", "Track active booking status", "See checkout-ready package totals"],
      },
      {
        title: "Support and reassurance",
        description: "Reduce drop-off with faster answers and issue visibility.",
        items: ["Open live AI chat support", "Escalate service questions when needed", "Keep refund or callback requests visible"],
      },
    ],
    notes: [
      "This dashboard is customer-facing, not an employee panel.",
      "It should stay focused on bookings, addresses, offers, and support.",
    ],
  },
  agent: {
    badge: "Agent workspace",
    title: "Call queue, customer desk, follow-ups, and escalation handoff",
    description:
      "Built for daily call operations so agents can work callback promises, booking clarifications, payment reminders, and live customer communication.",
    stats: [
      { label: "Core focus", value: "Daily calls", hint: "Outbound and inbound conversation handling." },
      { label: "Queue structure", value: "4 live lanes", hint: "Call queue, customer desk, follow-ups, escalations." },
      { label: "Escalation path", value: "Corporate handoff", hint: "Sensitive cases move up without losing notes." },
    ],
    actions: [
      { label: "Open call queue", href: "/agent/call-queue", note: "Fresh calls and slot confirmations." },
      { label: "Open follow-ups", href: "/agent/follow-ups", note: "Pending promises and callbacks." },
      { label: "Open escalations", href: "/agent/escalations", note: "Unhappy-customer or service-failure cases." },
    ],
    lanes: [
      {
        title: "Customer communication",
        description: "Move every customer call toward a clear next action.",
        items: ["Confirm slots and revisit times", "Log payment reminder outcomes", "Capture notes for field or support teams"],
      },
      {
        title: "Queue discipline",
        description: "Keep the day organized and auditable.",
        items: ["Own the assigned customer", "Set the next promised action time", "Escalate only when the case truly needs it"],
      },
    ],
    notes: [
      "Agent access is for company-email users who handle customer communication.",
      "This workspace stays separate from higher corporate decision-making.",
    ],
  },
  corporate: {
    badge: "Corporate workspace",
    title: "Higher operations control for booking flow, technician movement, quality, and category readiness",
    description:
      "Use the corporate workspace as the main higher-position operating room for daily service fulfillment, oversight, and cross-team decision-making.",
    stats: [
      { label: "Primary scope", value: "Daily operations", hint: "Booking desks, allocations, SLAs, and city readiness." },
      { label: "Workflow depth", value: "Section by section", hint: "Every category opens into a real sub-workflow." },
      { label: "Access boundary", value: "@speedfix.co.in", hint: "Company-domain access only for internal teams." },
    ],
    actions: [
      { label: "Open operations desk", href: "/corporate/operations/bookings-desk", note: "Review intake and status changes." },
      { label: "Open technician allocation", href: "/corporate/operations/technician-allocation", note: "Match jobs to field capacity." },
      { label: "Open quality reviews", href: "/corporate/quality/service-audits", note: "Audit service delivery and recovery." },
    ],
    lanes: [
      {
        title: "Mission control",
        description: "See work by lane instead of hunting through legacy admin screens.",
        items: ["Command center visibility", "SLA watch and escalation review", "Cross-team handoff clarity"],
      },
      {
        title: "Operational depth",
        description: "Control the supply side of the marketplace.",
        items: ["Track booking intake", "Balance city coverage and assignments", "Keep catalog and quality aligned with capacity"],
      },
    ],
    notes: [
      "This is intentionally not an HR salary, leave, or designation system.",
      "It is reserved for company-domain internal users handling higher operations.",
    ],
  },
  hr: {
    badge: "HR hiring desk",
    title: "Careers, recruiter workflow, and job-posting operations only",
    description:
      "This dashboard focuses on talent acquisition work inside SpeedFix: opening roles, reviewing hiring demand, tracking recruiter actions, and managing the careers pipeline.",
    stats: [
      { label: "Main scope", value: "Hiring operations", hint: "No payroll, leave, or designation management here." },
      { label: "Posting access", value: "HR and recruiter only", hint: "Guarded by company email and HR identity." },
      { label: "Public connection", value: "Careers page live", hint: "Roles appear on the public site after posting." },
    ],
    actions: [
      { label: "Add employee access", href: "/hr/access-control", note: "Create company login access inside the existing Firebase project." },
      { label: "Post a job opening", href: "/careers/posting", note: "Create new hiring demand from HR." },
      { label: "Review careers page", href: "/careers", note: "Check how open roles appear publicly." },
    ],
    lanes: [
      {
        title: "Recruitment flow",
        description: "Move role demand from request to published position.",
        items: ["Capture recruiter and company details", "Publish job title, location, type, and salary range", "Keep role descriptions current"],
      },
      {
        title: "Hiring operations",
        description: "Stay inside recruitment work, not employee administration.",
        items: ["Track urgent hiring requests", "Prioritize field and corporate openings", "Maintain a clean careers pipeline"],
      },
    ],
    notes: [
      "HR access is for @speedfix.co.in accounts with HR or recruiter identity.",
      "This workspace intentionally excludes salary, leave, and designation controls.",
    ],
  },
  admin: {
    badge: "Admin control",
    title: "City rollout, technician readiness, catalog approvals, and live service controls",
    description:
      "Admin is the internal control desk for serviceability, rollout rules, field readiness, and the operational rules that shape what customers can book.",
    stats: [
      { label: "Live controls", value: "City + catalog", hint: "Serviceable areas and category behavior stay aligned." },
      { label: "Operational view", value: "Technician readiness", hint: "Assignment quality depends on clean supply data." },
      { label: "Escalation support", value: "Fast internal decisions", hint: "Approve fixes without jumping across old dashboards." },
    ],
    actions: [
      { label: "Open city coverage", href: "/corporate/operations/city-coverage", note: "Review city and pincode supply." },
      { label: "Open sub-category matrix", href: "/corporate/catalog/sub-category-matrix", note: "Keep customer navigation deep and clickable." },
      { label: "Open portal settings", href: "/corporate/catalog/portal-settings", note: "Manage internal control defaults." },
    ],
    lanes: [
      {
        title: "Supply-side control",
        description: "Protect service quality before the booking happens.",
        items: ["Enable or pause service zones", "Check operational gaps by city", "Keep the service catalog realistic"],
      },
      {
        title: "Execution governance",
        description: "Support the teams that actually deliver the job.",
        items: ["Watch technician assignment pressure", "Align category promises with capacity", "Handle escalations that need immediate admin action"],
      },
    ],
    notes: [
      "Admin is an internal control workspace, not a public or customer path.",
      "Company email is required before any admin role can open this area.",
    ],
  },
  accounts: {
    badge: "Accounts desk",
    title: "Refunds, payment watch, daily verification, and settlement follow-through",
    description:
      "Use the accounts workspace for money movement: payment verification, refund review, settlement timing, and daily accounts-side operational clean-up.",
    stats: [
      { label: "Refund flow", value: "Customer-safe", hint: "Handle pending compensation and refund review cleanly." },
      { label: "Payment health", value: "Daily watch", hint: "Catch failed verifications and broken checkout journeys." },
      { label: "Ops crossover", value: "Finance + operations", hint: "Money issues should not get buried in generic support." },
    ],
    actions: [
      { label: "Open payment watch", href: "/corporate/finance/payment-watch", note: "Review verification and payment failures." },
      { label: "Open settlement calendar", href: "/corporate/finance/settlement-calendar", note: "Track payout timing and approvals." },
      { label: "Open refund review", href: "/corporate/support/refund-review", note: "Work customer-linked compensation requests." },
    ],
    lanes: [
      {
        title: "Daily finance operations",
        description: "Close money-related loops every day.",
        items: ["Verify completed payments", "Watch high-value failed orders", "Keep payout blockers visible"],
      },
      {
        title: "Customer trust protection",
        description: "Money mistakes affect brand confidence fast.",
        items: ["Review refund evidence", "Prepare clean settlement follow-up", "Coordinate with support when customers are waiting"],
      },
    ],
    notes: [
      "This dashboard is for accounts-side operations only.",
      "It pairs with corporate finance workflows instead of replacing them.",
    ],
  },
  audit: {
    badge: "Audit desk",
    title: "Service audits, incident review, quality recovery, and compliance-sensitive oversight",
    description:
      "Audit keeps service standards, issue trails, and policy-sensitive exceptions visible so quality problems do not disappear inside routine operations traffic.",
    stats: [
      { label: "Audit scope", value: "Quality + compliance", hint: "Review service audits, incidents, and repeat failure patterns." },
      { label: "Sensitive review", value: "Incident visibility", hint: "Conduct and safety cases stay separate from normal queues." },
      { label: "Recovery support", value: "Feedback recovery", hint: "Negative sentiment becomes a measurable process." },
    ],
    actions: [
      { label: "Open service audits", href: "/corporate/quality/service-audits", note: "Review execution quality by job." },
      { label: "Open feedback recovery", href: "/corporate/quality/feedback-recovery", note: "Handle low-rating recovery follow-through." },
      { label: "Open incident monitor", href: "/corporate/quality/incident-monitor", note: "Track sensitive cases separately." },
    ],
    lanes: [
      {
        title: "Quality intelligence",
        description: "Turn recurring issues into visible action.",
        items: ["Audit jobs against quality expectations", "Find repeat failure patterns", "Route issues to the right owners quickly"],
      },
      {
        title: "Governance and trust",
        description: "Separate high-risk work from routine service operations.",
        items: ["Protect incident notes", "Track customer recovery outcomes", "Maintain premium service standards"],
      },
    ],
    notes: [
      "Audit is for company-domain internal reviewers only.",
      "It complements corporate quality workflows without collapsing into generic admin pages.",
    ],
  },
  founder: {
    badge: "Founder command",
    title: "All-access company command layer across customer, field, support, hiring, finance, and audit",
    description:
      "The founder workspace is the single all-access view for top-level control. It should let leadership jump into any operating lane without touching the old mixed executive/admin pages.",
    stats: [
      { label: "Access model", value: "Everything in one", hint: "Corporate, agent, HR, admin, accounts, audit, and customer views." },
      { label: "Decision level", value: "Founder only", hint: "Reserved for the highest-level company operator." },
      { label: "Navigation style", value: "Fast portal switching", hint: "Move from company overview to a deep workflow in one click." },
    ],
    actions: [
      { label: "Open corporate workspace", href: "/corporate", note: "Higher operations and booking flow control." },
      { label: "Open corporate admin controls", href: "/corporate/catalog/portal-settings", note: "Serviceability, catalog, and live operational settings inside corporate." },
      { label: "Open accounts desk", href: "/accounts", note: "Refunds, settlements, and payment verification." },
      { label: "Open audit desk", href: "/audit", note: "Quality, incidents, and review recovery." },
    ],
    lanes: [
      {
        title: "Executive visibility",
        description: "See every operating lane without relying on scattered legacy routes.",
        items: ["Jump between every workspace", "See where issues should be routed", "Use role-based portals instead of mixed dashboards"],
      },
      {
        title: "Growth and governance",
        description: "Balance service growth with operational realism.",
        items: ["Keep customer experience premium", "Track hiring and internal execution", "Preserve audit and finance clarity"],
      },
    ],
    notes: [
      "Founder access intentionally includes the whole internal operating surface.",
      "This replaces the old executive-style panel with a cleaner role-based structure.",
    ],
  },
};

export function getAccessibleWorkspaceLinks(
  record: unknown,
  emailOverride?: unknown
) {
  return workspaceNavigation.filter((workspace) =>
    canAccessWorkspace(record, workspace.key, emailOverride)
  );
}
