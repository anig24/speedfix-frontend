import type { ReactNode } from "react";
import ProtectedWorkspaceShell from "@/app/components/workspace/ProtectedWorkspaceShell";

export default function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProtectedWorkspaceShell workspace="customer">{children}</ProtectedWorkspaceShell>;
}
