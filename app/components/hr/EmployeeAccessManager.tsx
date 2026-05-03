"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import {
  deleteApp,
  getApps,
  initializeApp,
  type FirebaseApp,
} from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";
import { AlertCircle, CheckCircle2, ShieldCheck, UserPlus } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import {
  canAccessWorkspace,
  getDefaultWorkspaceHref,
  hasCompanyEmail,
} from "@/lib/portalAccess";
import { getAccessibleWorkspaceLinks } from "@/lib/workspaceCatalog";

type EmployeeForm = {
  name: string;
  email: string;
  temporaryPassword: string;
  phone: string;
  role: string;
  department: string;
  city: string;
  employeeCode: string;
};

type EmployeePreview = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  city: string;
};

const defaultForm: EmployeeForm = {
  name: "",
  email: "",
  temporaryPassword: "",
  phone: "",
  role: "FIELD_RECRUITER",
  department: "Talent Acquisition",
  city: "",
  employeeCode: "",
};

const employeeRoleGroups = [
  {
    label: "Leadership",
    roles: [
      "FOUNDER",
      "BUSINESS_HEAD",
      "CHIEF_OPERATING_OFFICER",
      "CHIEF_FINANCIAL_OFFICER",
    ],
  },
  {
    label: "HR and Hiring",
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
    label: "Operations",
    roles: [
      "STATE_MANAGER",
      "CITY_MANAGER",
      "ZONE_MANAGER",
      "CLUSTER_MANAGER",
      "OPERATIONS_MANAGER",
      "OPERATIONS",
      "OPERATIONS_ADMIN",
      "SERVICE_HEAD",
      "DISPATCHER",
      "SCHEDULING_COORDINATOR",
      "FIELD_SUPERVISOR",
    ],
  },
  {
    label: "Finance and Accounts",
    roles: [
      "FINANCE_HEAD",
      "ACCOUNTS_HEAD",
      "ACCOUNTS",
      "ACCOUNTANT",
      "FINANCE",
      "BILLING",
      "REFUND_OPS",
      "PAYOUTS",
      "COLLECTIONS",
    ],
  },
  {
    label: "Quality and Compliance",
    roles: [
      "QUALITY_HEAD",
      "QUALITY",
      "AUDIT",
      "AUDITOR",
      "QA",
      "COMPLIANCE",
      "TRAINING_MANAGER",
    ],
  },
  {
    label: "Catalog and Platform Control",
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "CATEGORY_MANAGER",
      "CATALOG",
      "PRICING_MANAGER",
      "GROWTH_MANAGER",
    ],
  },
  {
    label: "Support and Field Service",
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

function getSuggestedDepartment(role: string) {
  if (
    [
      "HEAD_HR",
      "HR",
      "JR_HR",
      "HR_INTERN",
      "HEAD_RECRUITER",
      "RECRUITER",
      "FIELD_RECRUITER",
      "TALENT_ACQUISITION",
      "CAMPUS_RECRUITER",
    ].includes(role)
  ) {
    return "Talent Acquisition";
  }

  if (
    [
      "STATE_MANAGER",
      "CITY_MANAGER",
      "ZONE_MANAGER",
      "CLUSTER_MANAGER",
      "OPERATIONS_MANAGER",
      "OPERATIONS",
      "OPERATIONS_ADMIN",
      "SERVICE_HEAD",
      "DISPATCHER",
      "SCHEDULING_COORDINATOR",
      "FIELD_SUPERVISOR",
    ].includes(role)
  ) {
    return "Operations";
  }

  if (
    [
      "FINANCE_HEAD",
      "ACCOUNTS_HEAD",
      "ACCOUNTS",
      "ACCOUNTANT",
      "FINANCE",
      "BILLING",
      "REFUND_OPS",
      "PAYOUTS",
      "COLLECTIONS",
    ].includes(role)
  ) {
    return "Finance";
  }

  if (
    ["QUALITY_HEAD", "QUALITY", "AUDIT", "AUDITOR", "QA", "COMPLIANCE"].includes(
      role
    )
  ) {
    return "Quality and Compliance";
  }

  if (
    ["SUPER_ADMIN", "ADMIN", "CATEGORY_MANAGER", "CATALOG", "PRICING_MANAGER"].includes(
      role
    )
  ) {
    return "Platform Control";
  }

  if (
    ["SUPPORT_LEAD", "TEAM_LEAD", "SENIOR_AGENT", "AGENT", "CALL_AGENT", "CUSTOMER_SUCCESS"].includes(
      role
    )
  ) {
    return "Customer Support";
  }

  if (["TECHNICIAN", "FIELD_EXECUTIVE", "STAFF"].includes(role)) {
    return "Field Service";
  }

  return "Leadership";
}

function getSecondaryProvisionerApp() {
  const existing = getApps().find((app) =>
    app.name.startsWith("speedfix-employee-provisioner")
  );

  if (existing) {
    return existing;
  }

  return initializeApp(
    {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    },
    `speedfix-employee-provisioner-${Date.now()}`
  );
}

export default function EmployeeAccessManager() {
  const [form, setForm] = useState<EmployeeForm>(defaultForm);
  const [employees, setEmployees] = useState<EmployeePreview[]>([]);
  const [status, setStatus] = useState<{
    type: "idle" | "saving" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  useEffect(() => {
    const employeeQuery = query(collection(db, "users"), orderBy("createdAt", "desc"));

    return onSnapshot(employeeQuery, (snapshot) => {
      const nextEmployees = snapshot.docs
        .map((item) => {
          const data = item.data() as Omit<EmployeePreview, "id"> & {
            email?: string;
            role?: string;
            department?: string;
            city?: string;
          };

          return {
            id: item.id,
            ...data,
          };
        })
        .filter((item) => hasCompanyEmail(item.email))
        .slice(0, 10)
        .map((item) => ({
          id: item.id,
          name: typeof item.name === "string" ? item.name : "Unnamed employee",
          email: typeof item.email === "string" ? item.email : "",
          role: typeof item.role === "string" ? item.role : "EMPLOYEE",
          department:
            typeof item.department === "string" ? item.department : "Not set",
          city: typeof item.city === "string" ? item.city : "Not set",
        }));

      setEmployees(nextEmployees);
    });
  }, []);

  const workspacePreview = useMemo(() => {
    const draftRecord = {
      role: form.role,
      email: form.email,
      active: true,
      employeeActive: true,
      employmentStatus: "ACTIVE",
    };

    return getAccessibleWorkspaceLinks(draftRecord, form.email).map(
      (item) => item.shortLabel
    );
  }, [form.email, form.role]);

  const dashboardPathPreview = useMemo(() => {
    const draftRecord = {
      role: form.role,
      email: form.email,
      active: true,
      employeeActive: true,
      employmentStatus: "ACTIVE",
    };

    return getDefaultWorkspaceHref(draftRecord, form.email);
  }, [form.email, form.role]);

  const handleCreateEmployee = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "saving", message: "Creating employee access..." });

    if (!form.name || !form.email || !form.temporaryPassword || !form.role) {
      setStatus({
        type: "error",
        message: "Please complete all required employee access fields.",
      });
      return;
    }

    if (!hasCompanyEmail(form.email)) {
      setStatus({
        type: "error",
        message: "Employee access can only be created for @speedfix.co.in emails.",
      });
      return;
    }

    if (!auth.currentUser?.uid || !auth.currentUser?.email) {
      setStatus({
        type: "error",
        message: "You must be signed in as HR to create employee access.",
      });
      return;
    }

    const hrRecord = {
      role: "HR",
      email: auth.currentUser.email,
      active: true,
      employeeActive: true,
      employmentStatus: "ACTIVE",
    };

    if (!canAccessWorkspace(hrRecord, "hr", auth.currentUser.email)) {
      setStatus({
        type: "error",
        message: "Only HR or recruiter accounts can create employee access.",
      });
      return;
    }

    let provisionerApp: FirebaseApp | null = null;

    try {
      provisionerApp = getSecondaryProvisionerApp();
      const provisionerAuth = getAuth(provisionerApp);
      const employeeCredential = await createUserWithEmailAndPassword(
        provisionerAuth,
        form.email,
        form.temporaryPassword
      );

      const employeeUid = employeeCredential.user.uid;
      const accessibleWorkspaces = getAccessibleWorkspaceLinks(
        {
          role: form.role,
          email: form.email,
          active: true,
          employeeActive: true,
          employmentStatus: "ACTIVE",
        },
        form.email
      ).map((item) => item.key);

      await setDoc(doc(db, "users", employeeUid), {
        name: form.name,
        email: form.email,
        phone: form.phone || "",
        role: form.role,
        department: form.department || "",
        city: form.city || "",
        employeeCode: form.employeeCode || "",
        active: true,
        employeeActive: true,
        employmentStatus: "ACTIVE",
        portalType: "COMPANY",
        workspaceAccess: accessibleWorkspaces,
        createdByUid: auth.currentUser.uid,
        createdByEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });

      await addDoc(collection(db, "employeeAccessLog"), {
        action: "EMPLOYEE_ACCESS_CREATED",
        employeeUid,
        employeeEmail: form.email,
        employeeRole: form.role,
        workspaceAccess: accessibleWorkspaces,
        createdByUid: auth.currentUser.uid,
        createdByEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });

      await signOut(provisionerAuth);

      setStatus({
        type: "success",
        message:
          "Employee access created successfully. Share the work email and temporary password with the employee, then ask them to change it after first login.",
      });
      setForm(defaultForm);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to create employee access right now.",
      });
    } finally {
      if (provisionerApp) {
        await deleteApp(provisionerApp).catch(() => undefined);
      }
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card">
        <div className="inline-flex rounded-2xl bg-[#fff2df] p-3 text-orange-500">
          <UserPlus className="h-5 w-5" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-slate-950">
          Add employee access
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          HR can create employee login access directly in the existing SpeedFix
          Firebase project. This writes the employee role and workspace access
          into the same `users` collection used by the app.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleCreateEmployee}>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Employee name"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="employee@speedfix.co.in"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              value={form.temporaryPassword}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  temporaryPassword: event.target.value,
                }))
              }
              placeholder="Temporary password"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({ ...current, phone: event.target.value }))
              }
              placeholder="Phone number"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <select
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value,
                  department:
                    current.department === getSuggestedDepartment(current.role) ||
                    !current.department
                      ? getSuggestedDepartment(event.target.value)
                      : current.department,
                }))
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              {employeeRoleGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <input
              value={form.department}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  department: event.target.value,
                }))
              }
              placeholder="Department"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              value={form.city}
              onChange={(event) =>
                setForm((current) => ({ ...current, city: event.target.value }))
              }
              placeholder="City"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              value={form.employeeCode}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  employeeCode: event.target.value,
                }))
              }
              placeholder="Employee code"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={status.type === "saving"}
            className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status.type === "saving" ? "Creating access..." : "Create employee access"}
          </button>
        </form>

        {status.type !== "idle" && (
          <div
            className={`mt-4 flex items-start gap-2 rounded-[1.5rem] px-4 py-3 text-sm ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : status.type === "error"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-slate-100 text-slate-700"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            {status.message}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card">
          <div className="inline-flex rounded-2xl bg-slate-100 p-3 text-slate-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-slate-950">
            Access preview
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Workspace access is calculated from the employee role and company
            email before the account is created.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {workspacePreview.length ? (
              workspacePreview.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[#fff2df] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                No company dashboard access
              </span>
            )}
          </div>

          <div className="mt-5 rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Landing path
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {dashboardPathPreview}
            </p>
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card">
          <h2 className="text-2xl font-semibold text-slate-950">
            Recent employee access
          </h2>
          <div className="mt-5 space-y-3">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{employee.name}</p>
                    <p className="text-sm text-slate-600">{employee.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                      {employee.role}
                    </span>
                    <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {employee.department}
                    </span>
                    <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {employee.city}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {!employees.length && (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                No company employee records found yet.
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
