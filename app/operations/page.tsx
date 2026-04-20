const opsQueues = [
  "Awaiting technician assignment",
  "In-progress jobs",
  "Payment verification follow-ups",
];

export default function OperationsDashboard() {
  return (
    <div className="min-h-screen bg-[#0B1220] p-10 text-white">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-400">
          Operations
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Operations dashboard</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {opsQueues.map((queue) => (
            <div
              key={queue}
              className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-200"
            >
              {queue}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
