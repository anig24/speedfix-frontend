import EmployeeAccessManager from "@/app/components/hr/EmployeeAccessManager";

export const metadata = {
  title: "Access Control | Corporate HQ",
  description: "Provision employee identities and manage role access.",
};

export default function AccessControlPage() {
  return (
    <div className="space-y-6">
      {/* Page Header mimicking the SaaS standard */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6A00]/10 rounded-md mb-4 border border-[#FF6A00]/20">
             <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6A00]">
               HR & People Ops
             </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Identity & Access Management</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Provision new employee accounts and verify corporate clearance.
          </p>
        </div>
      </div>

      {/* Mount the Tool */}
      <EmployeeAccessManager />
    </div>
  );
}