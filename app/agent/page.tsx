import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { agentQueues } from "@/lib/agentPortal";

export default function AgentOverviewPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 premium-card">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Agent operations
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-slate-950">
          Daily call handling and customer management desk
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600">
          This workspace is only for agents handling daily calls, follow-ups,
          customer coordination, and escalation handoff. It stays separate from
          the higher corporate control room.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {agentQueues.map((queue) => {
          const Icon = queue.icon;

          return (
            <article
              key={queue.slug}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card"
            >
              <div className="inline-flex rounded-2xl bg-[#fff2df] p-3 text-orange-500">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-slate-950">
                {queue.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {queue.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {queue.summaryStats.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <Link
                href={`/agent/${queue.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open queue
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          );
        })}
      </section>
    </div>
  );
}
