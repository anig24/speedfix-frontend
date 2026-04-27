import type { ReactNode } from "react";
import ProtectedWorkspaceShell from "@/app/components/workspace/ProtectedWorkspaceShell";

export default function HRLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProtectedWorkspaceShell workspace="hr">{children}</ProtectedWorkspaceShell>;
}
