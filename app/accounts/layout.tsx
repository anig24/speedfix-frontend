import type { ReactNode } from "react";
import ProtectedWorkspaceShell from "@/app/components/workspace/ProtectedWorkspaceShell";

export default function AccountsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProtectedWorkspaceShell workspace="accounts">{children}</ProtectedWorkspaceShell>;
}
