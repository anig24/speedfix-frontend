"use client";

import {
  createContext,
  useContext,
  type ComponentType,
  type ReactNode,
} from "react";
import type { CorporateSection } from "@/lib/corporatePortal";
import type { CorporateDashboardScope } from "@/lib/corporateWorkspaceAccess";

type LinkItem = {
  title?: string;
  label?: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

export type CorporateAccessContextValue = {
  profile: {
    name: string;
    email: string;
    role: string;
    roleKey: string;
  };
  scope: CorporateDashboardScope;
  sections: CorporateSection[];
  quickLinks: LinkItem[];
  footerLinks: LinkItem[];
};

const CorporateAccessContext = createContext<CorporateAccessContextValue | null>(
  null
);

export function CorporateAccessProvider({
  value,
  children,
}: {
  value: CorporateAccessContextValue;
  children: ReactNode;
}) {
  return (
    <CorporateAccessContext.Provider value={value}>
      {children}
    </CorporateAccessContext.Provider>
  );
}

export function useCorporateAccess() {
  const context = useContext(CorporateAccessContext);

  if (!context) {
    throw new Error("useCorporateAccess must be used within CorporateAccessProvider.");
  }

  return context;
}
