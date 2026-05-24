import { NextResponse, type NextRequest } from "next/server";
import { authorizeManagementRequest } from "@/lib/managementBackend";
import { buildMarketplaceOperationsDashboard } from "@/lib/server/serviceMarketplaceBackend";

export async function GET(request: NextRequest) {
  const actor = await authorizeManagementRequest(request, undefined, "corporate");

  if (!actor) {
    return NextResponse.json(
      { error: "Corporate marketplace operations access is required." },
      { status: 401 }
    );
  }

  const dashboard = await buildMarketplaceOperationsDashboard();

  return NextResponse.json({
    success: true,
    actor,
    dashboard,
  });
}
