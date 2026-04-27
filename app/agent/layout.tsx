import type { ReactNode } from "react";
import AgentShell from "@/app/components/agent/AgentShell";

export default function AgentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AgentShell>{children}</AgentShell>;
}
