"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Building2,
  ChevronRight,
  GitBranch,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  formatRoleLabel,
  hasCompanyEmail,
  isActivePortalUser,
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
};

const ROLE_RANKS = new Map<string, number>([
  ["FOUNDER", 0],
  ["BUSINESS_HEAD", 1],
  ["HEAD_HR", 2],
  ["HEAD_RECRUITER", 2],
  ["FINANCE_HEAD", 2],
  ["ACCOUNTS_HEAD", 2],
  ["STATE_MANAGER", 3],
  ["CITY_MANAGER", 4],
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
  ["JR_HR", 7],
  ["HR_INTERN", 8],
  ["RECRUITER", 7],
  ["FIELD_RECRUITER", 8],
  ["TALENT_ACQUISITION", 7],
  ["TEAM_LEAD", 7],
  ["SUPPORT_LEAD", 7],
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
    title: "Leadership",
    roles: ["FOUNDER", "BUSINESS_HEAD"],
  },
  {
    title: "Regional and Operations",
    roles: [
      "STATE_MANAGER",
      "CITY_MANAGER",
      "OPERATIONS",
      "OPERATIONS_ADMIN",
      "SERVICE_HEAD",
      "ADMIN",
      "SUPER_ADMIN",
    ],
  },
  {
    title: "People and Hiring",
    roles: [
      "HEAD_HR",
      "HR",
      "JR_HR",
      "HR_INTERN",
      "HEAD_RECRUITER",
      "RECRUITER",
      "FIELD_RECRUITER",
      "TALENT_ACQUISITION",
    ],
  },
  {
    title: "Finance and Quality",
    roles: [
      "FINANCE_HEAD",
      "ACCOUNTS_HEAD",
      "ACCOUNTS",
      "ACCOUNTANT",
      "FINANCE",
      "AUDIT",
      "AUDITOR",
      "QUALITY",
      "COMPLIANCE",
      "QA",
    ],
  },
  {
    title: "Support and Field",
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

function getRoleRank(role: string) {
  return ROLE_RANKS.get(normalizeRole(role)) ?? 99;
}

function sortEmployees(left: EmployeeRecord, right: EmployeeRecord) {
  const rankDifference = getRoleRank(left.role) - getRoleRank(right.role);

  if (rankDifference !== 0) {
    return rankDifference;
  }

  return left.name.localeCompare(right.name);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function EmployeeCard({
  employee,
  relation,
}: {
  employee: EmployeeRecord;
  relation: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-slate-200 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
            {getInitials(employee.name)}
          </div>
          <div>
            <p className="font-medium text-slate-950">{employee.name}</p>
            <p className="mt-1 text-sm text-slate-500">{employee.email}</p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          {relation}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
          {formatRoleLabel(employee.role)}
        </span>
        {employee.department && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {employee.department}
          </span>
        )}
        {employee.city && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {employee.city}
          </span>
        )}
      </div>
    </div>
  );
}

export default function EmployeeHierarchyPanel({
  currentEmail,
  currentRole,
}: EmployeeHierarchyPanelProps) {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const nextEmployees = snapshot.docs
        .map((item) => {
          const data = item.data();

          return {
            id: item.id,
            name:
              typeof data.name === "string" && data.name.trim()
                ? data.name
                : "Unnamed employee",
            email: typeof data.email === "string" ? data.email : "",
            role: typeof data.role === "string" ? data.role : "EMPLOYEE",
            department:
              typeof data.department === "string" ? data.department : "",
            city: typeof data.city === "string" ? data.city : "",
            ...data,
          };
        })
        .filter((item) => hasCompanyEmail(item.email) && isActivePortalUser(item))
        .map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          role: item.role,
          department: item.department,
          city: item.city,
        }))
        .sort(sortEmployees);

      setEmployees(nextEmployees);
    });

    return () => unsubscribe();
  }, []);

  const hierarchy = useMemo(() => {
    const normalizedEmail = currentEmail.trim().toLowerCase();
    const currentRank = getRoleRank(currentRole);

    const higher = employees
      .filter((employee) => employee.email.toLowerCase() !== normalizedEmail)
      .filter((employee) => getRoleRank(employee.role) < currentRank)
      .slice(0, 8);

    const peers = employees
      .filter((employee) => employee.email.toLowerCase() !== normalizedEmail)
      .filter((employee) => getRoleRank(employee.role) === currentRank)
      .slice(0, 8);

    const lower = employees
      .filter((employee) => employee.email.toLowerCase() !== normalizedEmail)
      .filter((employee) => getRoleRank(employee.role) > currentRank)
      .slice(0, 12);

    const grouped = ROLE_GROUPS.map((group) => ({
      ...group,
      employees: employees.filter((employee) =>
        group.roles.includes(normalizeRole(employee.role))
      ),
    })).filter((group) => group.employees.length > 0);

    return {
      higher,
      peers,
      lower,
      grouped,
    };
  }, [currentEmail, currentRole, employees]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <GitBranch className="h-4 w-4" />
        </span>
        <span className="flex flex-col items-start">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Organization
          </span>
          <span className="text-sm font-semibold text-slate-900">Employee tree</span>
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] bg-slate-950/55 p-4 backdrop-blur-md">
          <div className="mx-auto flex h-[calc(100vh-2rem)] w-full max-w-[1520px] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-[#edf2f8] shadow-[0_36px_100px_rgba(2,10,24,0.35)]">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-[#081423] px-6 py-6 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                  Organization chart
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Higher, peer, and lower reporting visibility
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70">
                  Review the org structure around your role with a cleaner MNC-style
                  view of reporting lines, peers, and functional layers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/15 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 border-b border-slate-200 bg-white px-6 py-5 md:grid-cols-4">
              {[
                ["Current role", formatRoleLabel(currentRole)],
                ["Higher line", `${hierarchy.higher.length} visible`],
                ["Peer layer", `${hierarchy.peers.length} visible`],
                ["Lower line", `${hierarchy.lower.length} visible`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid flex-1 gap-6 overflow-hidden px-6 py-6 xl:grid-cols-[0.92fr_1.08fr]">
              <section className="grid min-h-0 gap-6 overflow-y-auto pr-1">
                <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center gap-2 text-slate-900">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm font-semibold">Current role</p>
                  </div>
                  <div className="mt-4 rounded-[1.4rem] bg-slate-50 px-4 py-4">
                    <p className="font-medium text-slate-950">{currentEmail}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      {formatRoleLabel(currentRole)}
                    </p>
                  </div>
                </article>

                <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center gap-2 text-slate-900">
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                    <p className="text-sm font-semibold">Higher line</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {hierarchy.higher.length ? (
                      hierarchy.higher.map((employee) => (
                        <EmployeeCard
                          key={employee.id}
                          employee={employee}
                          relation="Higher"
                        />
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                        No higher employee records are visible above this role.
                      </div>
                    )}
                  </div>
                </article>

                <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Users className="h-4 w-4 text-slate-500" />
                    <p className="text-sm font-semibold">Peer layer</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {hierarchy.peers.length ? (
                      hierarchy.peers.map((employee) => (
                        <EmployeeCard
                          key={employee.id}
                          employee={employee}
                          relation="Peer"
                        />
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                        No peer employees are visible for this role yet.
                      </div>
                    )}
                  </div>
                </article>

                <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    <p className="text-sm font-semibold">Lower line</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {hierarchy.lower.length ? (
                      hierarchy.lower.map((employee) => (
                        <EmployeeCard
                          key={employee.id}
                          employee={employee}
                          relation="Lower"
                        />
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                        No lower employee records are visible below this role.
                      </div>
                    )}
                  </div>
                </article>
              </section>

              <section className="min-h-0 overflow-y-auto rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                <div className="sticky top-0 z-10 -mx-5 -mt-5 border-b border-slate-200 bg-white px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Organization layers
                  </p>
                </div>
                <div className="mt-5 space-y-4">
                  {hierarchy.grouped.map((group) => (
                    <article
                      key={group.title}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">
                            {group.title}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                            {group.employees.length} employees
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-3">
                        {group.employees.map((employee) => (
                          <div
                            key={employee.id}
                            className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-medium text-slate-950">
                                  {employee.name}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                  {employee.email}
                                </p>
                              </div>
                              <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                                {formatRoleLabel(employee.role)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
