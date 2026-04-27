import { notFound } from "next/navigation";
import AgentWorkflowBoard from "@/app/components/agent/AgentWorkflowBoard";
import { getAgentQueueBySlug } from "@/lib/agentPortal";

export default async function AgentQueuePage({
  params,
}: {
  params: Promise<{ queueSlug: string }>;
}) {
  const { queueSlug } = await params;
  const queue = getAgentQueueBySlug(queueSlug);

  if (!queue) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 premium-card">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          {queue.title}
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-slate-950">
          {queue.description}
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {queue.summaryStats.map((item) => (
            <span
              key={item}
              className="rounded-full bg-[#fff2df] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <AgentWorkflowBoard
        queueSlug={queue.slug}
        queueType={queue.queueType}
        title={queue.title}
      />
    </div>
  );
}
