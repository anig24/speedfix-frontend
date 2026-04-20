import Link from "next/link";

const technicianActions = [
  "Login and review assigned jobs",
  "Update arrival status",
  "Share live progress with operations",
];

export default function TechnicianPage() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
        Technician
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-900">
        Technician workspace
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
        This page is now a stable technician landing screen. It can later be
        wired to live tracking using the shared Firebase setup instead of a
        duplicate app initialization.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {technicianActions.map((action) => (
          <div
            key={action}
            className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700"
          >
            {action}
          </div>
        ))}
      </div>

      <Link
        href="/technician/login"
        className="mt-8 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Go to technician login
      </Link>
    </div>
  );
}
