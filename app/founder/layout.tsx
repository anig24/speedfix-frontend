import type { ReactNode } from "react";
import ProtectedWorkspaceShell from "@/app/components/workspace/ProtectedWorkspaceShell";

export default function FounderLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProtectedWorkspaceShell workspace="founder">{children}</ProtectedWorkspaceShell>;
}
