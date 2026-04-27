import type { ReactNode } from "react";
import CorporateShell from "@/app/components/corporate/CorporateShell";

export default function CorporateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <CorporateShell>{children}</CorporateShell>;
}
