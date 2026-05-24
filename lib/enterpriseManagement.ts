import {
  BadgeIndianRupee,
  Banknote,
  BellRing,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Headset,
  Landmark,
  LineChart,
  MapPinned,
  Network,
  PackageCheck,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Siren,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { type WorkspaceKey } from "@/lib/portalAccess";

export type EnterpriseModuleKey =
  | "executive-command"
  | "operations-control"
  | "customer-experience"
  | "field-force"
  | "hr-people"
  | "finance-control"
  | "risk-compliance"
  | "procurement-assets"
  | "data-intelligence"
  | "security-access";

export type EnterpriseModule = {
  key: EnterpriseModuleKey;
  title: string;
  owner: string;
  description: string;
  icon: LucideIcon;
  controlLevel: "Board" | "CXO" | "Regional" | "City" | "Desk";
  workflows: string[];
  approvals: string[];
  metrics: string[];
  workspaceAccess: WorkspaceKey[];
};

export type EnterpriseKpi = {
  label: string;
  value: string;
  trend: string;
  tone: "good" | "watch" | "risk" | "neutral";
};

export type EnterpriseTimelineItem = {
  title: string;
  description: string;
  status: "complete" | "active" | "waiting" | "risk";
};

export const enterpriseKpis: EnterpriseKpi[] = [
  {
    label: "Operating rhythm",
    value: "24x7",
    trend: "Command desk active",
    tone: "good",
  },
  {
    label: "Customer promise",
    value: "SLA first",
    trend: "Booking to recovery tracked",
    tone: "watch",
  },
  {
    label: "Governance",
    value: "Role gated",
    trend: "Every action has owner and audit trail",
    tone: "good",
  },
  {
    label: "Scale model",
    value: "City ops",
    trend: "Branch, zone, and field hierarchy ready",
    tone: "neutral",
  },
];

export const enterpriseModules: EnterpriseModule[] = [
  {
    key: "executive-command",
    title: "Executive Command",
    owner: "Founder Office",
    description:
      "Board-level control of growth, risk, city performance, daily health, and unresolved escalations.",
    icon: BriefcaseBusiness,
    controlLevel: "Board",
    workflows: [
      "Daily leadership brief",
      "Revenue and SLA war room",
      "Exception approval queue",
      "Founder-level escalation review",
    ],
    approvals: [
      "High-value refunds",
      "City launch gates",
      "Critical incident closure",
    ],
    metrics: ["Revenue health", "Open risk", "SLA drift", "City readiness"],
    workspaceAccess: ["founder", "corporate"],
  },
  {
    key: "operations-control",
    title: "Operations Control",
    owner: "COO / Operations",
    description:
      "End-to-end service delivery from booking intake to technician allocation, revisit, and closure.",
    icon: ClipboardList,
    controlLevel: "Regional",
    workflows: [
      "Booking command queue",
      "Technician allocation",
      "City coverage matrix",
      "Revisit and failure recovery",
    ],
    approvals: ["Manual assignment override", "Priority upgrade", "Revisit waiver"],
    metrics: ["Pending bookings", "Confirmed jobs", "Active work", "Delayed jobs"],
    workspaceAccess: ["corporate", "admin"],
  },
  {
    key: "customer-experience",
    title: "Customer Experience",
    owner: "Support / CX",
    description:
      "Customer lifecycle, chat, follow-up, refunds, complaints, and loyalty recovery in one controlled lane.",
    icon: Headset,
    controlLevel: "Desk",
    workflows: [
      "Customer timeline",
      "Chat and callback handoff",
      "Complaint recovery",
      "Refund and compensation routing",
    ],
    approvals: ["Compensation note", "Refund review", "Service recovery voucher"],
    metrics: ["Open tickets", "Callbacks", "Refund watch", "CSAT risk"],
    workspaceAccess: ["agent", "corporate", "accounts", "audit"],
  },
  {
    key: "field-force",
    title: "Field Force",
    owner: "Field Operations",
    description:
      "Worker onboarding, verification, live location, attendance, capacity, task assignment, and payout readiness.",
    icon: MapPinned,
    controlLevel: "City",
    workflows: [
      "Worker verification",
      "Live job tracking",
      "Attendance and availability",
      "Field payout readiness",
    ],
    approvals: ["Worker activation", "KYC exception", "Payout hold release"],
    metrics: ["Verified workers", "Available capacity", "Live locations", "Payout holds"],
    workspaceAccess: ["corporate", "admin", "accounts", "audit"],
  },
  {
    key: "hr-people",
    title: "People and HR",
    owner: "HR Leadership",
    description:
      "Employee access, org hierarchy, recruiter pipeline, city hiring demand, and role governance.",
    icon: UsersRound,
    controlLevel: "CXO",
    workflows: [
      "Employee access provisioning",
      "Org hierarchy",
      "Recruiter desk",
      "Careers publishing",
    ],
    approvals: ["Employee creation", "Role change", "Access deactivation"],
    metrics: ["Active employees", "Hiring demand", "Role changes", "Access reviews"],
    workspaceAccess: ["hr", "corporate", "founder"],
  },
  {
    key: "finance-control",
    title: "Finance Control",
    owner: "CFO / Accounts",
    description:
      "Payments, refunds, settlements, worker payouts, invoice watch, and finance exceptions.",
    icon: BadgeIndianRupee,
    controlLevel: "CXO",
    workflows: [
      "Payment watch",
      "Settlement calendar",
      "Worker payout control",
      "Refund approval ledger",
    ],
    approvals: ["Refund release", "Settlement hold", "Payout exception"],
    metrics: ["Paid orders", "Pending refunds", "Settlement holds", "Payout queue"],
    workspaceAccess: ["accounts", "corporate", "founder"],
  },
  {
    key: "risk-compliance",
    title: "Risk and Compliance",
    owner: "Quality / Audit",
    description:
      "Incident monitoring, service audits, policy exceptions, privacy-sensitive notes, and closure evidence.",
    icon: ShieldAlert,
    controlLevel: "CXO",
    workflows: [
      "Incident monitor",
      "Quality audits",
      "Feedback recovery",
      "Compliance evidence trail",
    ],
    approvals: ["Incident closure", "Policy exception", "Quality penalty review"],
    metrics: ["Incidents", "Audit backlog", "Recovery cases", "Policy exceptions"],
    workspaceAccess: ["audit", "corporate", "founder"],
  },
  {
    key: "procurement-assets",
    title: "Procurement and Assets",
    owner: "Supply / Admin",
    description:
      "Tools, material issue, vendor follow-through, asset handover, and branch-level stock movement.",
    icon: PackageCheck,
    controlLevel: "Regional",
    workflows: [
      "Vendor onboarding",
      "Material request",
      "Tool issue register",
      "Branch asset stock",
    ],
    approvals: ["Vendor approval", "Material release", "Tool loss review"],
    metrics: ["Open requests", "Vendor holds", "Asset issues", "Stock alerts"],
    workspaceAccess: ["admin", "corporate", "accounts"],
  },
  {
    key: "data-intelligence",
    title: "Data Intelligence",
    owner: "Analytics",
    description:
      "Decision dashboards, anomaly detection, demand forecast, service mix, and operating insights.",
    icon: LineChart,
    controlLevel: "Board",
    workflows: [
      "Daily data pulse",
      "Demand forecast",
      "Anomaly review",
      "City scorecards",
    ],
    approvals: ["Metric override note", "Report publish", "Forecast lock"],
    metrics: ["Demand trend", "Margin watch", "Anomalies", "City score"],
    workspaceAccess: ["founder", "corporate", "audit"],
  },
  {
    key: "security-access",
    title: "Security and Access",
    owner: "Admin / IT",
    description:
      "Login access, role gates, sensitive route protection, audit log, and internal policy controls.",
    icon: ShieldCheck,
    controlLevel: "CXO",
    workflows: [
      "Role gate review",
      "Access audit",
      "Sensitive action log",
      "Security exception queue",
    ],
    approvals: ["Privilege change", "Access revoke", "API key rotation"],
    metrics: ["Active roles", "Access changes", "Audit events", "Security holds"],
    workspaceAccess: ["founder", "hr", "admin", "audit"],
  },
];

export const enterpriseOrgLayers = [
  {
    title: "Board and Founder Office",
    roles: ["FOUNDER", "BUSINESS_HEAD", "CHIEF_OPERATING_OFFICER", "CHIEF_FINANCIAL_OFFICER"],
    command: "Sets national operating rhythm, approvals, and risk boundaries.",
  },
  {
    title: "CXO and Functional Heads",
    roles: ["HEAD_HR", "FINANCE_HEAD", "ACCOUNTS_HEAD", "QUALITY_HEAD", "SERVICE_HEAD"],
    command: "Owns policy, budgets, staffing, quality, and functional scorecards.",
  },
  {
    title: "Regional and City Command",
    roles: ["STATE_MANAGER", "CITY_MANAGER", "ZONE_MANAGER", "CLUSTER_MANAGER"],
    command: "Controls city readiness, serviceability, allocation, and field pressure.",
  },
  {
    title: "Desk Operations",
    roles: ["OPERATIONS", "DISPATCHER", "SCHEDULING_COORDINATOR", "FIELD_SUPERVISOR"],
    command: "Moves bookings, tasks, callbacks, and escalations through daily queues.",
  },
  {
    title: "Execution Teams",
    roles: ["AGENT", "CALL_AGENT", "TECHNICIAN", "FIELD_EXECUTIVE", "STAFF"],
    command: "Executes customer communication, field work, and first-line updates.",
  },
];

export const customerLifecycle: EnterpriseTimelineItem[] = [
  {
    title: "Discover",
    description: "Customer browses category, task, price, availability, and city serviceability.",
    status: "complete",
  },
  {
    title: "Book",
    description: "Cart, address, pincode, preferred slot, payment, and confirmation captured.",
    status: "active",
  },
  {
    title: "Assign",
    description: "Operations matches verified field capacity with booking location and skill.",
    status: "waiting",
  },
  {
    title: "Track",
    description: "Worker accepts, shares live location, arrives, starts work, and updates timeline.",
    status: "waiting",
  },
  {
    title: "Recover",
    description: "Support owns issues, revisit, refund review, feedback, and loyalty recovery.",
    status: "waiting",
  },
];

export const liveOperatingSignals = [
  { label: "Booking intake", icon: ClipboardCheck, color: "bg-emerald-500" },
  { label: "Field allocation", icon: Radar, color: "bg-orange-500" },
  { label: "Customer desk", icon: BellRing, color: "bg-sky-500" },
  { label: "Finance watch", icon: Banknote, color: "bg-violet-500" },
  { label: "Risk review", icon: Siren, color: "bg-rose-500" },
  { label: "Org command", icon: Network, color: "bg-slate-800" },
  { label: "Branch control", icon: Building2, color: "bg-cyan-600" },
  { label: "Audit trail", icon: Landmark, color: "bg-amber-600" },
];

export function getEnterpriseModulesForWorkspace(workspace: WorkspaceKey) {
  return enterpriseModules.filter((module) =>
    module.workspaceAccess.includes(workspace)
  );
}
