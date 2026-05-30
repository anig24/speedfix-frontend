"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  formatRoleLabel,
  hasCompanyEmail,
  normalizeRole,
} from "@/lib/portalAccess";

type EmployeeHierarchyPanelProps = {
  currentEmail: string;
  currentRole: string;
};

type EmployeeRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  city: string;
  phone: string;
  employeeCode: string;
  designation: string;
  companyRole: string;
  cluster: string;
  status: string;
  active: boolean;
};

type DivisionNode = {
  id: string;
  title: string;
  shortCode: string;
  description: string;
  roles: string[];
  employees: EmployeeRecord[];
};

const ROLE_RANKS = new Map<string, number>([
  ["FOUNDER", 0],
  ["CHIEF_EXECUTIVE_OFFICER", 1],
  ["BUSINESS_HEAD", 1],
  ["CHIEF_TECHNOLOGY_OFFICER", 1],
  ["DEPUTY_CHIEF_TECHNOLOGY_OFFICER", 2],
  ["CHIEF_OPERATING_OFFICER", 1],
  ["CHIEF_FINANCIAL_OFFICER", 1],
  ["HEAD_HR", 2],
  ["HEAD_RECRUITER", 2],
  ["FINANCE_HEAD", 2],
  ["ACCOUNTS_HEAD", 2],
  ["STATE_MANAGER", 3],
  ["CITY_MANAGER", 4],
  ["OPERATIONS_MANAGER", 5],
  ["OPERATIONS", 5],
  ["OPERATIONS_ADMIN", 5],
  ["SERVICE_HEAD", 5],
  ["ADMIN", 5],
  ["SUPER_ADMIN", 5],
  ["QUALITY", 6],
  ["AUDIT", 6],
  ["AUDITOR", 6],
  ["COMPLIANCE", 6],
  ["HR", 6],
  ["RECRUITER", 7],
  ["TALENT_ACQUISITION", 7],
  ["TEAM_LEAD", 7],
  ["SUPPORT_LEAD", 7],
  ["JR_HR", 8],
  ["HR_INTERN", 8],
  ["FIELD_RECRUITER", 8],
  ["SENIOR_AGENT", 8],
  ["AGENT", 9],
  ["CALL_AGENT", 9],
  ["CUSTOMER_SUCCESS", 9],
  ["STAFF", 10],
  ["TECHNICIAN", 10],
  ["FIELD_EXECUTIVE", 10],
]);

const ROLE_GROUPS = [
  {
    title: "Leadership and Executive",
    shortCode: "LX",
    description: "Founder, business heads, and senior command roles.",
    roles: [
      "FOUNDER",
      "CHIEF_EXECUTIVE_OFFICER",
      "BUSINESS_HEAD",
      "CHIEF_TECHNOLOGY_OFFICER",
      "DEPUTY_CHIEF_TECHNOLOGY_OFFICER",
      "CHIEF_OPERATING_OFFICER",
      "CHIEF_FINANCIAL_OFFICER",
    ],
  },
  {
    title: "Regional and Operations",
    shortCode: "OP",
    description: "City, state, dispatch, service, and field operations.",
    roles: [
      "STATE_MANAGER",
      "CITY_MANAGER",
      "OPERATIONS",
      "OPERATIONS_ADMIN",
      "OPERATIONS_MANAGER",
      "DISPATCHER",
      "SCHEDULING_COORDINATOR",
      "FIELD_SUPERVISOR",
      "SERVICE_HEAD",
      "ADMIN",
      "SUPER_ADMIN",
      "ZONE_MANAGER",
      "CLUSTER_MANAGER",
    ],
  },
  {
    title: "People and Talent",
    shortCode: "HR",
    description: "HR, recruiter, onboarding, and talent acquisition teams.",
    roles: [
      "HEAD_HR",
      "HR",
      "JR_HR",
      "HR_INTERN",
      "HEAD_RECRUITER",
      "RECRUITER",
      "FIELD_RECRUITER",
      "TALENT_ACQUISITION",
      "CAMPUS_RECRUITER",
    ],
  },
  {
    title: "Finance and Quality",
    shortCode: "FQ",
    description: "Accounts, finance, audit, quality, and compliance.",
    roles: [
      "FINANCE_HEAD",
      "ACCOUNTS_HEAD",
      "ACCOUNTS",
      "ACCOUNTANT",
      "FINANCE",
      "PAYOUTS",
      "BILLING",
      "REFUND_OPS",
      "COLLECTIONS",
      "AUDIT",
      "AUDITOR",
      "QUALITY",
      "QUALITY_AUDIT",
      "COMPLIANCE",
      "QA",
      "QUALITY_HEAD",
      "TRAINING_MANAGER",
    ],
  },
  {
    title: "Support and Field Execution",
    shortCode: "SF",
    description: "Agents, support leads, technicians, and field teams.",
    roles: [
      "SUPPORT_LEAD",
      "TEAM_LEAD",
      "SENIOR_AGENT",
      "AGENT",
      "CALL_AGENT",
      "CUSTOMER_SUCCESS",
      "TECHNICIAN",
      "FIELD_EXECUTIVE",
      "STAFF",
    ],
  },
];

function readString(data: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return fallback;
}

function readBoolean(data: Record<string, unknown>, keys: string[], fallback = true) {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "boolean") {
      return value;
    }
  }
  return fallback;
}

function getRoleRank(role: string) {
  return ROLE_RANKS.get(normalizeRole(role)) ?? 99;
}

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "SF";
}

function employeeSearchText(employee: EmployeeRecord) {
  return [
    employee.id,
    employee.name,
    employee.email,
    employee.role,
    employee.department,
    employee.city,
    employee.phone,
    employee.employeeCode,
    employee.designation,
    employee.companyRole,
    employee.cluster,
    employee.status,
  ]
    .join(" ")
    .toLowerCase();
}

function mapEmployeeRecord(id: string, data: Record<string, unknown>): EmployeeRecord {
  const name = readString(data, ["name", "fullName", "displayName"], "Unnamed employee");
  const role = readString(data, ["role", "companyRole"], "EMPLOYEE");
  const active = readBoolean(
    data,
    ["active", "isActive", "employeeActive", "employmentActive"],
    true
  );
  const status = readString(
    data,
    ["status", "employeeStatus", "employmentStatus"],
    active ? "active" : "inactive"
  );

  return {
    id,
    name,
    email: readString(data, ["email"]),
    role,
    department: readString(data, ["department", "departmentId"], "Unassigned"),
    city: readString(data, ["city", "baseCity"], "Not set"),
    phone: readString(data, ["phone", "mobile", "phoneNumber"]),
    employeeCode: readString(data, ["employeeCode", "employeeId", "code"]),
    designation: readString(data, ["designation", "title"], formatRoleLabel(role)),
    companyRole: readString(data, ["companyRole"]),
    cluster: readString(data, ["cluster", "team"], "General"),
    status,
    active,
  };
}

function useEmployeeDirectory() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const nextEmployees = snapshot.docs
          .map((item) =>
            mapEmployeeRecord(item.id, item.data() as Record<string, unknown>)
          )
          .filter((employee) => hasCompanyEmail(employee.email))
          .sort((a, b) => {
            const rankDiff = getRoleRank(a.role) - getRoleRank(b.role);
            if (rankDiff !== 0) return rankDiff;
            return a.name.localeCompare(b.name);
          });

        setEmployees(nextEmployees);
        setLoading(false);
      },
      () => {
        setEmployees([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { employees, loading };
}

function EmployeeCard({ employee }: { employee: EmployeeRecord }) {
  const executive = getRoleRank(employee.role) <= 1;

  return (
    <article className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md md:grid-cols-[minmax(0,1fr)_auto]">
      <div className="flex min-w-0 gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#07111f] text-sm font-extrabold text-white">
          {getInitials(employee.name)}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-extrabold text-slate-950">
              {employee.name}
            </h3>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                employee.active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {employee.status}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-orange-600">
            {employee.designation || formatRoleLabel(employee.role)}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            {formatRoleLabel(employee.role)} / {employee.department}
          </p>
        </div>
      </div>

      <div className="grid gap-2 text-sm text-slate-600 md:min-w-[280px] md:justify-items-end">
        <span className="flex min-w-0 items-center gap-2">
          <Mail className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate">{employee.email || "Email not set"}</span>
        </span>
        <span className="flex min-w-0 items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate">
            {executive ? "Hidden for executive role" : employee.phone || "Phone not set"}
          </span>
        </span>
        <span className="text-xs font-semibold text-slate-400">
          {employee.employeeCode || "No employee code"} / {employee.city}
        </span>
      </div>
    </article>
  );
}

function DivisionPanel({ division }: { division: DivisionNode }) {
  const [expanded, setExpanded] = useState(true);
  const hasEmployees = division.employees.length > 0;

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center gap-4 text-left"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#07111f] text-sm font-extrabold text-white">
          {division.shortCode}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-extrabold text-slate-950">{division.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{division.description}</p>
        </div>
        <div className="hidden rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm sm:block">
          {division.employees.length} employees
        </div>
        {expanded ? (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-slate-400" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && hasEmployees && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 border-l border-slate-200 pl-4">
              {division.employees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function EmployeeDirectoryContent({
  currentEmail,
  currentRole,
  onClose,
}: EmployeeHierarchyPanelProps & { onClose?: () => void }) {
  const { employees, loading } = useEmployeeDirectory();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return employees;
    return employees.filter((employee) => employeeSearchText(employee).includes(query));
  }, [employees, searchQuery]);

  const divisions = useMemo(() => {
    const mappedRoles = new Set(ROLE_GROUPS.flatMap((group) => group.roles));
    const grouped = ROLE_GROUPS.map((group): DivisionNode | null => {
      const groupEmployees = filteredEmployees.filter((employee) =>
        group.roles.includes(normalizeRole(employee.role))
      );

      if (!groupEmployees.length) return null;

      return {
        id: group.shortCode,
        title: group.title,
        shortCode: group.shortCode,
        description: group.description,
        roles: group.roles,
        employees: groupEmployees,
      };
    }).filter((group): group is DivisionNode => Boolean(group));

    const otherEmployees = filteredEmployees.filter(
      (employee) => !mappedRoles.has(normalizeRole(employee.role))
    );

    if (otherEmployees.length) {
      grouped.push({
        id: "other",
        title: "Other Assignments",
        shortCode: "OT",
        description: "Employees with custom or newly-created role labels.",
        roles: [],
        employees: otherEmployees,
      });
    }

    return grouped;
  }, [filteredEmployees]);

  const activeCount = employees.filter((employee) => employee.active).length;
  const executiveCount = employees.filter((employee) => getRoleRank(employee.role) <= 1).length;

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f6f8fb] text-slate-950">
      <header className="shrink-0 border-b border-slate-200 bg-white px-5 py-5 md:px-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-orange-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Organization directory
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
              Employee Tree
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Search every company employee by name, email, phone, code, city,
              designation, role, department, status, or cluster.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[420px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search all employees..."
                className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                aria-label="Close employee tree"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#07111f] text-orange-400">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold">SpeedFix Main Entity</h2>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Global hierarchy
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-2xl font-extrabold">{employees.length}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Employees
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-2xl font-extrabold text-emerald-700">{activeCount}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700/70">
                    Active
                  </p>
                </div>
                <div className="rounded-2xl bg-orange-50 p-4">
                  <p className="text-2xl font-extrabold text-orange-700">{executiveCount}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-orange-700/70">
                    Executive
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-4 text-white">
                  <p className="text-2xl font-extrabold">{filteredEmployees.length}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/60">
                    Showing
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Viewing as
              </p>
              <p className="mt-3 text-sm font-bold text-slate-950">
                {formatRoleLabel(currentRole)}
              </p>
              <p className="mt-1 truncate text-sm text-slate-500">{currentEmail}</p>
            </section>
          </aside>

          <section className="min-w-0 space-y-4">
            <div className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <UsersRound className="h-5 w-5 text-orange-500" />
                <div>
                  <h2 className="text-lg font-extrabold">Searchable employee tree</h2>
                  <p className="text-sm text-slate-500">
                    {loading
                      ? "Loading directory..."
                      : `Showing ${filteredEmployees.length} of ${employees.length} company employees`}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {searchQuery.trim() ? "Filtered view" : "All employees"}
              </span>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500 shadow-sm">
                Loading all company employees...
              </div>
            ) : divisions.length ? (
              divisions.map((division) => (
                <DivisionPanel key={division.id} division={division} />
              ))
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <BriefcaseBusiness className="mx-auto h-10 w-10 text-slate-300" />
                <h2 className="mt-4 text-xl font-extrabold text-slate-950">
                  No employees found
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Try a different name, role, phone, employee code, city, or email.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default function EmployeeHierarchyPanel({
  currentEmail,
  currentRole,
}: EmployeeHierarchyPanelProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5"
        >
          <motion.div
            initial={{ scale: 0.98, y: 18 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 18 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-[0_30px_100px_rgba(2,6,23,0.38)]"
          >
            <EmployeeDirectoryContent
              currentEmail={currentEmail}
              currentRole={currentRole}
              onClose={() => setOpen(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-all hover:border-orange-200 hover:shadow-md"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white">
          <GitBranch className="h-4 w-4" />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors group-hover:text-orange-600">
            Organization
          </p>
          <p className="text-sm font-bold text-slate-950">Employee Tree</p>
        </div>
      </button>

      {typeof document !== "undefined" ? createPortal(modal, document.body) : null}
    </>
  );
}
