const entryTasks = [
  "Review new service requests",
  "Verify address and pincode details",
  "Route escalations to the right ops queue",
];

export default function EntryDashboard() {
  return (
    <div className="min-h-screen bg-[#0B1220] p-10 text-white">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-400">
          Entry Team
        </p>
        <h1 className="mt-3 text-3xl font-semibold">
          Entry-level operations dashboard
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          This route now renders safely during prerendering and can be expanded
          later with real assignment and intake data.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {entryTasks.map((task) => (
            <div
              key={task}
              className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-200"
            >
              {task}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
