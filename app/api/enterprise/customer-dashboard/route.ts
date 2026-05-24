import { NextResponse, type NextRequest } from "next/server";
import {
  buildEnterpriseCustomerDashboard,
  getAuthenticatedPortalUser,
} from "@/lib/server/enterpriseDashboard";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedPortalUser(request.headers);

  if (!user) {
    return NextResponse.json(
      { error: "Customer dashboard access requires a signed-in user." },
      { status: 401 }
    );
  }

  const dashboard = await buildEnterpriseCustomerDashboard({
    uid: user.uid,
    email: user.email,
  });

  return NextResponse.json({ success: true, dashboard });
}
