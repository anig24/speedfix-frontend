"use client";

import { FormEvent, useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { AlertCircle, CheckCircle2, ShieldCheck, Pencil } from "lucide-react";
import { db } from "@/lib/firebase";
import { hasCompanyEmail } from "@/lib/portalAccess";

type EmployeeForm = {
  name: string; email: string; temporaryPassword: string; phone: string; role: string; 
  departmentId: string; city: string; employeeCode: string; designation: string; 
  companyRole: string; cluster: string; salary: number; status: string;
};

type EmployeePreview = {
  id: string; name: string; email: string; role: string; phone: string; employeeCode: string; 
  designation: string; companyRole: string; cluster: string; salary: number; status: string; departmentId: string; city: string;
};

type EmployeeDocument = Partial<Omit<EmployeePreview, "id" | "salary">> & {
  name?: unknown;
  fullName?: unknown;
  email?: unknown;
  role?: unknown;
  phone?: unknown;
  employeeCode?: unknown;
  employeeId?: unknown;
  designation?: unknown;
  companyRole?: unknown;
  cluster?: unknown;
  salary?: unknown;
  status?: unknown;
  departmentId?: unknown;
  city?: unknown;
};

type EmployeePermissions = {
  employees: { view: boolean; update: boolean; manage: boolean; delete: boolean };
  finance: { view: boolean; update: boolean; manage: boolean };
  jobs: { read: boolean; update: boolean; assign: boolean };
  system: {
    fullAccess: boolean;
    write: boolean;
    settings: boolean;
    manageApplications: boolean;
    manageDepartments: boolean;
    manageJobs: boolean;
    managePayroll: boolean;
    systemSettings: boolean;
    viewReports: boolean;
  };
};

type EmployeePayload = {
  fullName: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  designation: string;
  companyRole: string;
  departmentId: string;
  salary: number;
  status: string;
  cluster: string;
  employeeId: string;
  companyId: string;
  accountType: string;
  permissions: EmployeePermissions;
  updatedAt: unknown;
  createdAt?: unknown;
  isSuperAdmin: boolean;
  active: boolean;
  isActive: boolean;
  employeeActive: boolean;
  employmentActive: boolean;
  employmentStatus: string;
  portalType: string;
};

type InputProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
};

const defaultForm: EmployeeForm = {
  name: "", email: "", temporaryPassword: "", phone: "", role: "FIELD_RECRUITER", 
  departmentId: "sf-ops-01", city: "Bangalore", employeeCode: "", designation: "", 
  companyRole: "", cluster: "Executive", salary: 0, status: "active",
};

const employeeRoleGroups = [
  {
    label: "Founder and Leadership",
    roles: [
      "FOUNDER",
      "BUSINESS_HEAD",
      "CHIEF_EXECUTIVE_OFFICER",
      "CHIEF_TECHNOLOGY_OFFICER",
      "DEPUTY_CHIEF_TECHNOLOGY_OFFICER",
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
    label: "Operations and Field",
    roles: [
      "STATE_MANAGER",
      "CITY_MANAGER",
      "ZONE_MANAGER",
      "CLUSTER_MANAGER",
      "OPERATIONS",
      "OPERATIONS_ADMIN",
      "OPERATIONS_MANAGER",
      "SERVICE_HEAD",
      "DISPATCHER",
      "SCHEDULING_COORDINATOR",
      "FIELD_SUPERVISOR",
      "FIELD_EXECUTIVE",
      "TECHNICIAN",
      "STAFF",
    ],
  },
  {
    label: "Support and Agent",
    roles: [
      "SUPPORT",
      "SUPPORT_LEAD",
      "TEAM_LEAD",
      "SENIOR_AGENT",
      "AGENT",
      "CALL_AGENT",
      "CUSTOMER_SUCCESS",
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
    label: "Quality, Audit and Compliance",
    roles: [
      "QUALITY_HEAD",
      "QUALITY",
      "QUALITY_AUDIT",
      "QA",
      "AUDIT",
      "AUDITOR",
      "COMPLIANCE",
      "TRAINING_MANAGER",
    ],
  },
  {
    label: "Catalog, Admin and Growth",
    roles: [
      "ADMIN",
      "SUPER_ADMIN",
      "CATALOG",
      "CATEGORY_MANAGER",
      "PRICING",
      "PRICING_MANAGER",
      "GROWTH_MANAGER",
    ],
  },
];

function readString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function readNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function mapEmployeePreview(id: string, data: EmployeeDocument): EmployeePreview {
  return {
    id,
    name: readString(data.name, readString(data.fullName, "Unnamed")),
    email: readString(data.email),
    role: readString(data.role, "EMPLOYEE"),
    phone: readString(data.phone),
    employeeCode: readString(data.employeeCode, readString(data.employeeId)),
    designation: readString(data.designation),
    companyRole: readString(data.companyRole),
    cluster: readString(data.cluster, "Executive"),
    salary: readNumber(data.salary),
    status: readString(data.status, "active"),
    departmentId: readString(data.departmentId, "sf-ops-01"),
    city: readString(data.city, "Bangalore"),
  };
}

export default function EmployeeAccessManager() {
  const [form, setForm] = useState<EmployeeForm>(defaultForm);
  const [employees, setEmployees] = useState<EmployeePreview[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: "idle" | "saving" | "success" | "error"; message: string; }>({ type: "idle", message: "" });

  // Safe data fetching loop
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nextEmployees = snapshot.docs
        .map((item) => mapEmployeePreview(item.id, item.data() as EmployeeDocument))
        .filter((item) => hasCompanyEmail(item.email))
        .slice(0, 3);
      setEmployees(nextEmployees);
    });
    return () => unsubscribe();
  }, []); 

  // Load existing employee data into the form for editing
  const handleEditSetup = (employee: EmployeePreview) => {
    setEditingId(employee.id);
    setForm({
      name: employee.name || "",
      email: employee.email || "",
      temporaryPassword: "", 
      phone: employee.phone || "",
      role: employee.role || "EMPLOYEE",
      departmentId: employee.departmentId || "sf-ops-01",
      city: employee.city || "Bangalore",
      employeeCode: employee.employeeCode || "",
      designation: employee.designation || "",
      companyRole: employee.companyRole || "",
      cluster: employee.cluster || "Executive",
      salary: employee.salary || 0,
      status: employee.status || "active",
    });
    setStatus({ type: "idle", message: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ type: "saving", message: "Syncing identity to directory..." });

    try {
      let uid = editingId;
      
      // 1. If it is a NEW employee, create the Firebase Auth account first
      if (!uid) {
        const authApp = getSecondaryProvisionerApp();
        const authInstance = getAuth(authApp);
        const userCredential = await createUserWithEmailAndPassword(authInstance, form.email, form.temporaryPassword);
        uid = userCredential.user.uid;
      }
      
      // 2. Inject MNC Permissions Automatically
      const permissions: EmployeePermissions = {
        employees: { view: true, update: true, manage: true, delete: true },
        finance: { view: true, update: true, manage: true },
        jobs: { read: true, update: true, assign: true },
        system: { fullAccess: form.role === "FOUNDER", write: true, settings: true, manageApplications: true, manageDepartments: true, manageJobs: true, managePayroll: true, systemSettings: true, viewReports: true }
      };

      // 3. Build the Master Payload
      const userRef = doc(db, "users", uid!);
      const isUserActive = form.status === "active";
      
      const payload: EmployeePayload = {
        // MNC Custom Fields
        fullName: form.name,
        name: form.name, 
        email: form.email,
        phone: form.phone,
        role: form.role,
        designation: form.designation,
        companyRole: form.companyRole,
        departmentId: form.departmentId,
        salary: form.salary,
        status: form.status,
        cluster: form.cluster,
        employeeId: form.employeeCode,
        companyId: "SPEEDFIX_MAIN",
        accountType: "internal",
        permissions: permissions,
        updatedAt: serverTimestamp(),
        isSuperAdmin: form.role === "FOUNDER",

        // CRITICAL IAM SECURITY FLAGS (Required for routing)
        active: isUserActive,
        isActive: isUserActive,
        employeeActive: isUserActive,
        employmentActive: isUserActive,
        employmentStatus: isUserActive ? "ACTIVE" : "INACTIVE",
        portalType: "COMPANY", 
      };

      if (!editingId) {
         payload.createdAt = serverTimestamp();
      }

      // 4. Save to Database
      await setDoc(userRef, payload, { merge: true });

      setStatus({ type: "success", message: `Identity ${editingId ? "updated" : "provisioned"} successfully.` });
      setEditingId(null);
      setForm(defaultForm);
    } catch (err: unknown) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Unable to save employee identity.",
      });
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_350px] font-sans text-slate-900 items-start">
      {/* LEFT: Core Provisioning Form */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-4xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ShieldCheck className="text-[#FF6A00] h-6 w-6"/> 
          {editingId ? "Edit Identity Profile" : "Corporate IAM Access"}
        </h2>
        
        <form onSubmit={handleFormSubmit} className="grid md:grid-cols-2 gap-4">
          <Input label="Full Name" value={form.name} onChange={(v: string) => setForm(c => ({...c, name: v}))} />
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Corporate Email</label>
            <input 
              type="email" 
              required
              disabled={!!editingId} // Locks email during edits
              value={form.email} 
              onChange={(e) => setForm(c => ({...c, email: e.target.value}))} 
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:ring-1 focus:ring-[#FF6A00] outline-none disabled:opacity-60 disabled:cursor-not-allowed" 
            />
          </div>

          {!editingId && (
            <Input label="Initial Password" type="text" value={form.temporaryPassword} onChange={(v: string) => setForm(c => ({...c, temporaryPassword: v}))} />
          )}
          
          <Input label="Designation" value={form.designation} onChange={(v: string) => setForm(c => ({...c, designation: v}))} />
          <Input label="Company Role" value={form.companyRole} onChange={(v: string) => setForm(c => ({...c, companyRole: v}))} />
          <Input label="Salary" type="number" value={form.salary} onChange={(v: string) => setForm(c => ({...c, salary: Number(v)}))} />
          <Input label="Cluster" value={form.cluster} onChange={(v: string) => setForm(c => ({...c, cluster: v}))} />
          
          <div className="md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">IAM Role Assignment</label>
            <select 
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:ring-1 focus:ring-[#FF6A00] outline-none mt-1" 
              value={form.role} 
              onChange={e => setForm(c => ({...c, role: e.target.value}))}
            >
              {employeeRoleGroups.map(g => (
                <optgroup key={g.label} label={g.label}>
                  {g.roles.map(r => <option key={r} value={r}>{r}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2 mt-4 flex gap-3">
             <button type="submit" disabled={status.type === "saving"} className="flex-1 h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-70">
               {status.type === "saving" ? "Provisioning..." : editingId ? "Save Identity Updates" : "Provision Master Identity"}
             </button>
             
             {editingId && (
               <button type="button" onClick={() => { setEditingId(null); setForm(defaultForm); }} className="px-6 h-12 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition">
                 Cancel
               </button>
             )}
          </div>
        </form>

        {status.type !== "idle" && (
          <div className={`mt-6 flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium border ${status.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
            {status.type === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
            {status.message}
          </div>
        )}
      </section>

      {/* RIGHT: Recent Employees View */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
         <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Provisions</h3>
         <div className="space-y-3">
           {employees.map(e => (
             <div key={e.id} className="p-4 border border-slate-200 bg-slate-50 rounded-xl flex justify-between items-start group">
                <div>
                  <p className="font-bold text-sm text-slate-900">{e.name}</p>
                  <p className="text-xs text-slate-500 mb-2">{e.email}</p>
                  <span className="rounded bg-white border border-slate-200 px-2 py-1 text-[10px] font-bold uppercase text-slate-600">
                    {e.role.replace(/_/g, " ")}
                  </span>
                </div>
                {/* Arrow function safely prevents render loops */}
                <button 
                  onClick={() => handleEditSetup(e)} 
                  title="Edit Identity"
                  className="p-2 text-slate-400 hover:text-[#FF6A00] bg-white rounded shadow-sm border border-slate-200 opacity-0 group-hover:opacity-100 transition"
                >
                  <Pencil className="h-3.5 w-3.5"/>
                </button>
             </div>
           ))}
           {!employees.length && <p className="text-sm text-slate-500 italic">No recent employees found.</p>}
         </div>
      </section>
    </div>
  );
}

// Clean Form Input Helper
function Input({ label, value, onChange, type = "text" }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</label>
      <input 
        type={type} 
        required
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:ring-1 focus:ring-[#FF6A00] outline-none" 
      />
    </div>
  );
}

// Prevents breaking the logged-in session when creating a new employee auth record
function getSecondaryProvisionerApp() {
  const existing = getApps().find((app) => app.name.startsWith("speedfix-employee-provisioner"));
  if (existing) return existing;
  return initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  }, `speedfix-employee-provisioner-${Date.now()}`);
}
