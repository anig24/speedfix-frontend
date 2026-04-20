const supportLanes = [
  {
    title: "Customer tickets",
    description: "Handle customer questions, status checks and booking updates.",
  },
  {
    title: "Success follow-ups",
    description: "Track service quality and keep high-value customers warm.",
  },
  {
    title: "Technical resolutions",
    description: "Coordinate deeper issues with payments, routing and service flow.",
  },
];

export default function SupportDashboard() {
  return (
    <div className="min-h-screen bg-[#0B1220] p-10 text-white">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-400">
          Support
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Support dashboard</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          This route now renders without depending on a missing page prop and
          can be wired to role-aware data later.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {supportLanes.map((lane) => (
            <div
              key={lane.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
            >
              <h2 className="text-lg font-semibold text-white">{lane.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {lane.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
