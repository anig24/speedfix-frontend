import { NextResponse, type NextRequest } from "next/server";
import {
  buildEnterpriseEmployeeDashboard,
  canOpenEnterpriseWorkspace,
  getAuthenticatedPortalUser,
} from "@/lib/server/enterpriseDashboard";
import { type WorkspaceKey } from "@/lib/portalAccess";

function normalizeWorkspace(value: string | null): WorkspaceKey {
  const workspace = (value || "corporate").trim() as WorkspaceKey;

  if (
    [
      "agent",
      "corporate",
      "hr",
      "admin",
      "accounts",
      "audit",
      "founder",
    ].includes(workspace)
  ) {
    return workspace;
  }

  return "corporate";
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedPortalUser(request.headers);

  if (!user) {
    return NextResponse.json(
      { error: "Employee dashboard access requires a signed-in company user." },
      { status: 401 }
    );
  }

  const workspace = normalizeWorkspace(request.nextUrl.searchParams.get("workspace"));

  if (!canOpenEnterpriseWorkspace(user.record, workspace, user.email)) {
    return NextResponse.json(
      { error: "This employee role cannot open the requested enterprise workspace." },
      { status: 403 }
    );
  }

  const dashboard = await buildEnterpriseEmployeeDashboard({
    workspace,
    userRecord: user.record,
    email: user.email,
  });

  return NextResponse.json({ success: true, dashboard });
}
