import { type WorkspaceKey } from "@/lib/portalAccess";

export type EnterpriseWorkflowAudience = "customer" | "employee" | "founder";

export type EnterpriseWorkflowFunction = {
  key: string;
  title: string;
  owner: string;
  iconKey:
    | "demand"
    | "fulfillment"
    | "workforce"
    | "customer"
    | "finance"
    | "catalog"
    | "risk"
    | "assets"
    | "analytics"
    | "partner";
  description: string;
  route: string;
  signal: string;
  cadence: string;
  workspaces: WorkspaceKey[];
  audiences: EnterpriseWorkflowAudience[];
  lanes: string[];
  actions: string[];
  metrics: string[];
  systems: string[];
};

export const enterpriseWorkflowFunctions: EnterpriseWorkflowFunction[] = [
  {
    key: "demand-order",
    title: "Demand and Order Journey",
    owner: "Growth / Customer app",
    iconKey: "demand",
    description:
      "Search, quote, cart, coupon, checkout, payment choice, and booking confirmation in one managed order flow.",
    route: "/services",
    signal: "New demand to confirmed booking",
    cadence: "Live",
    workspaces: ["customer", "corporate", "admin", "founder"],
    audiences: ["customer", "employee", "founder"],
    lanes: ["Browse", "Quote", "Cart", "Checkout", "Confirm"],
    actions: ["Start booking", "Review cart", "Apply offer", "Track order"],
    metrics: ["Conversion", "Cart value", "Coupon use", "Payment status"],
    systems: ["Website", "Cart", "Razorpay", "Marketplace orders"],
  },
  {
    key: "fulfillment-control",
    title: "Service Fulfillment Control",
    owner: "Operations",
    iconKey: "fulfillment",
    description:
      "Booking intake, slot readiness, technician assignment, route status, revisit queue, and SLA breach prevention.",
    route: "/corporate/operations/bookings-desk",
    signal: "Confirmed booking to completed job",
    cadence: "Every shift",
    workspaces: ["corporate", "admin", "audit", "founder"],
    audiences: ["employee", "founder"],
    lanes: ["Intake", "Assign", "Dispatch", "Execute", "Close"],
    actions: ["Open booking desk", "Assign technician", "Escalate SLA", "Close job"],
    metrics: ["Pending", "Assigned", "On the way", "Delayed"],
    systems: ["Bookings", "Workers", "Ops queue", "Tracking"],
  },
  {
    key: "customer-tracking",
    title: "Tracking, Visit and Recovery",
    owner: "Customer / Service desk",
    iconKey: "fulfillment",
    description:
      "Booking timeline, technician ETA, visit status, completion proof, support handoff, and revisit recovery in one customer-safe flow.",
    route: "/track",
    signal: "Confirmed booking to supported closure",
    cadence: "Live",
    workspaces: ["customer"],
    audiences: ["customer"],
    lanes: ["Track", "ETA", "Visit", "Proof", "Recover"],
    actions: ["Track booking", "Check ETA", "Raise support", "Request revisit"],
    metrics: ["Active jobs", "ETA status", "Support case", "Completion"],
    systems: ["Tracking", "Timeline", "Support", "Recovery"],
  },
  {
    key: "customer-payment-help",
    title: "Payment, Invoice and Refund Help",
    owner: "Customer / Accounts support",
    iconKey: "finance",
    description:
      "Checkout, pay-after-service, payment verification, invoice help, refund request, and settlement support from the customer dashboard.",
    route: "/contact",
    signal: "Payment question to resolved support",
    cadence: "On demand",
    workspaces: ["customer"],
    audiences: ["customer"],
    lanes: ["Checkout", "Verify", "Invoice", "Refund", "Resolve"],
    actions: ["Open checkout", "Ask for invoice", "Raise refund", "Contact support"],
    metrics: ["Payment status", "Invoice", "Refund route", "Support SLA"],
    systems: ["Checkout", "Razorpay", "Invoice", "Support"],
  },
  {
    key: "workforce-people",
    title: "Workforce and People Ops",
    owner: "HR / Field leadership",
    iconKey: "workforce",
    description:
      "Employee access, recruiter pipeline, worker onboarding, attendance readiness, skill coverage, and hierarchy control.",
    route: "/corporate/hr/access-control",
    signal: "Hiring demand to active workforce",
    cadence: "Daily",
    workspaces: ["hr", "corporate", "admin", "founder"],
    audiences: ["employee", "founder"],
    lanes: ["Hire", "Verify", "Provision", "Train", "Activate"],
    actions: ["Create access", "Review recruiter desk", "Check hierarchy", "Audit role"],
    metrics: ["Active staff", "Hiring demand", "Verified workers", "Role changes"],
    systems: ["Firebase users", "Careers", "Worker portal", "Access logs"],
  },
  {
    key: "customer-recovery",
    title: "Customer Experience and Recovery",
    owner: "Support / CX",
    iconKey: "customer",
    description:
      "Customer tickets, chat handoff, callbacks, service complaints, revisit routing, refund review, and loyalty recovery.",
    route: "/corporate/support/customer-tickets",
    signal: "Issue opened to recovery closed",
    cadence: "Live",
    workspaces: ["agent", "corporate", "audit", "founder"],
    audiences: ["customer", "employee", "founder"],
    lanes: ["Listen", "Triage", "Resolve", "Recover", "Learn"],
    actions: ["Raise support", "Open tickets", "Assign callback", "Route refund"],
    metrics: ["Open cases", "Callbacks", "Escalations", "CSAT risk"],
    systems: ["Tawk", "Support cases", "Timeline", "Refund review"],
  },
  {
    key: "finance-settlement",
    title: "Finance, Payments and Settlements",
    owner: "Finance / Accounts",
    iconKey: "finance",
    description:
      "Payment watch, verification failures, invoice audit, refund approval, worker payout readiness, and settlement calendars.",
    route: "/corporate/finance/payment-watch",
    signal: "Payment event to reconciled ledger",
    cadence: "Daily close",
    workspaces: ["accounts", "corporate", "audit", "founder"],
    audiences: ["employee", "founder"],
    lanes: ["Verify", "Approve", "Settle", "Refund", "Reconcile"],
    actions: ["Open payment watch", "Review refund", "Check settlement", "Audit invoice"],
    metrics: ["Paid orders", "Refund queue", "Settlement holds", "Payout blockers"],
    systems: ["Razorpay", "Invoices", "Refund cases", "Payouts"],
  },
  {
    key: "catalog-supply",
    title: "Catalog, Pricing and City Supply",
    owner: "Catalog / Admin",
    iconKey: "catalog",
    description:
      "Category builder, subcategory matrix, service packages, add-ons, pincode serviceability, capacity, and rollout controls.",
    route: "/corporate/catalog/sub-category-matrix",
    signal: "Catalog promise to serviceable supply",
    cadence: "Weekly plus campaign changes",
    workspaces: ["admin", "corporate", "founder"],
    audiences: ["employee", "founder"],
    lanes: ["Plan", "Price", "Publish", "Measure", "Adjust"],
    actions: ["Review categories", "Check pricing", "Open coverage", "Tune packages"],
    metrics: ["Active categories", "Subcategories", "City coverage", "Margin watch"],
    systems: ["Service catalog", "Pricing cards", "Pincode API", "City matrix"],
  },
  {
    key: "risk-quality",
    title: "Risk, Quality and Compliance",
    owner: "Quality / Audit",
    iconKey: "risk",
    description:
      "Quality audits, incident monitoring, policy exceptions, sensitive case notes, repeat-failure detection, and closure evidence.",
    route: "/corporate/quality/service-audits",
    signal: "Exception to controlled closure",
    cadence: "Daily review",
    workspaces: ["audit", "corporate", "founder"],
    audiences: ["employee", "founder"],
    lanes: ["Detect", "Audit", "Contain", "Correct", "Evidence"],
    actions: ["Open audits", "Review incidents", "Route recovery", "Close evidence"],
    metrics: ["Audit backlog", "Incidents", "Repeat failures", "Policy exceptions"],
    systems: ["Audit log", "Quality cases", "Support cases", "Management logs"],
  },
  {
    key: "procurement-assets",
    title: "Procurement and Assets",
    owner: "Admin / Supply",
    iconKey: "assets",
    description:
      "Tools, material requests, vendor follow-through, asset issue registers, branch stock, and exception approvals.",
    route: "/corporate/catalog/portal-settings",
    signal: "Material request to field-ready asset",
    cadence: "Branch cycle",
    workspaces: ["admin", "accounts", "corporate", "founder"],
    audiences: ["employee", "founder"],
    lanes: ["Request", "Approve", "Issue", "Track", "Return"],
    actions: ["Open asset queue", "Approve issue", "Review vendor", "Check branch stock"],
    metrics: ["Open requests", "Vendor holds", "Asset issues", "Stock alerts"],
    systems: ["Vendor register", "Asset log", "Branch stock", "Finance approvals"],
  },
  {
    key: "analytics-command",
    title: "Executive Analytics and Control",
    owner: "Founder office",
    iconKey: "analytics",
    description:
      "National control view for demand, service health, revenue, people, quality, city readiness, and exception governance.",
    route: "/corporate/command-center/daily-brief",
    signal: "Operating signal to decision",
    cadence: "Morning and evening",
    workspaces: ["founder", "corporate"],
    audiences: ["founder", "employee"],
    lanes: ["Pulse", "Drill", "Decide", "Approve", "Broadcast"],
    actions: ["Open daily brief", "Review SLA watch", "Approve exception", "Publish priority"],
    metrics: ["Revenue health", "SLA drift", "City readiness", "Open risk"],
    systems: ["Enterprise KPIs", "Ops queue", "Finance", "Audit"],
  },
  {
    key: "partner-field",
    title: "Partner and Field Workforce",
    owner: "Field operations",
    iconKey: "partner",
    description:
      "Worker application, DigiLocker, bank verification, IFSC checks, location readiness, live job status, and payout readiness.",
    route: "/workers",
    signal: "Applicant to active service partner",
    cadence: "Live onboarding",
    workspaces: ["corporate", "admin", "accounts", "audit", "founder"],
    audiences: ["employee", "founder"],
    lanes: ["Apply", "KYC", "Bank", "Locate", "Dispatch"],
    actions: ["Open worker portal", "Review verification", "Check bank status", "Assign field work"],
    metrics: ["Applications", "Verified", "Available", "On job"],
    systems: ["Worker portal", "DigiLocker", "IFSC", "Live tracking"],
  },
];

export function getEnterpriseWorkflowFunctions(input: {
  workspace?: WorkspaceKey;
  audience?: EnterpriseWorkflowAudience;
  limit?: number;
}) {
  const { workspace = "corporate", audience = "employee", limit } = input;
  const functions = enterpriseWorkflowFunctions.filter((workflow) => {
    if (!workflow.audiences.includes(audience)) {
      return false;
    }

    if (audience === "founder" || workspace === "founder") {
      return true;
    }

    return workflow.workspaces.includes(workspace);
  });

  return typeof limit === "number" ? functions.slice(0, limit) : functions;
}
