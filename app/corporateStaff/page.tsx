const staffPanels = [
  "Assigned requests",
  "Customer callbacks",
  "Same-day escalations",
];

export default function StaffDashboard() {
  return (
    <div className="min-h-screen bg-[#0B1220] p-10 text-white">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-400">
          Corporate Staff
        </p>
        <h1 className="mt-3 text-3xl font-semibold">
          Corporate staff dashboard
        </h1>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {staffPanels.map((panel) => (
            <div
              key={panel}
              className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-200"
            >
              {panel}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
