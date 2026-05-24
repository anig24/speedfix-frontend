"use client";

import {
  canAccessWorkspace,
  getDefaultWorkspaceHref,
  type WorkspaceKey,
} from "@/lib/portalAccess";

const protectedWorkspacePrefixes: Array<{
  prefix: string;
  workspace: WorkspaceKey;
}> = [
  { prefix: "/agent", workspace: "agent" },
  { prefix: "/corporate", workspace: "corporate" },
  { prefix: "/admin", workspace: "corporate" },
  { prefix: "/dashboard", workspace: "corporate" },
  { prefix: "/executive", workspace: "founder" },
  { prefix: "/founder", workspace: "founder" },
  { prefix: "/hr", workspace: "hr" },
  { prefix: "/management", workspace: "corporate" },
  { prefix: "/operations", workspace: "corporate" },
  { prefix: "/support", workspace: "corporate" },
  { prefix: "/corporateStaff", workspace: "corporate" },
  { prefix: "/entry", workspace: "corporate" },
  { prefix: "/accounts", workspace: "accounts" },
  { prefix: "/audit", workspace: "audit" },
  { prefix: "/customer", workspace: "customer" },
];

function isSafeInternalPath(value?: string | null) {
  return Boolean(value && value.startsWith("/") && !value.startsWith("//"));
}

function getWorkspaceForPath(pathname: string) {
  return protectedWorkspacePrefixes.find(
    (item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`)
  )?.workspace;
}

async function callSessionRoute(path: string, method: "POST" | "DELETE") {
  await fetch(path, { method }).catch(() => undefined);
}

export async function clearWorkspaceSessionCookies() {
  await Promise.all([
    callSessionRoute("/api/corporate-session", "DELETE"),
    callSessionRoute("/api/agent-session", "DELETE"),
  ]);
}

export async function syncWorkspaceSessionCookies(
  record: unknown,
  email?: string | null
) {
  await clearWorkspaceSessionCookies();

  const requests: Array<Promise<void>> = [];

  if (canAccessWorkspace(record, "corporate", email)) {
    requests.push(callSessionRoute("/api/corporate-session", "POST"));
  }

  if (canAccessWorkspace(record, "agent", email)) {
    requests.push(callSessionRoute("/api/agent-session", "POST"));
  }

  await Promise.all(requests);
}

export function getPostLoginHref(
  record: unknown,
  email?: string | null,
  requestedPath?: string | null
) {
  if (isSafeInternalPath(requestedPath)) {
    const workspace = getWorkspaceForPath(requestedPath!);

    if (!workspace || canAccessWorkspace(record, workspace, email)) {
      return requestedPath!;
    }
  }

  return getDefaultWorkspaceHref(record, email);
}
