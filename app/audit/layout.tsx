import type { ReactNode } from "react";
import ProtectedWorkspaceShell from "@/app/components/workspace/ProtectedWorkspaceShell";

export default function AuditLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProtectedWorkspaceShell workspace="audit">{children}</ProtectedWorkspaceShell>;
}
