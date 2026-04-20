const managementCards = [
  "City performance review",
  "Lead funnel health",
  "Escalation turnaround",
];

export default function ManagementDashboard() {
  return (
    <div className="min-h-screen bg-[#0B1220] p-10 text-white">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-400">
          Management
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Management dashboard</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {managementCards.map((card) => (
            <div
              key={card}
              className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-200"
            >
              {card}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
