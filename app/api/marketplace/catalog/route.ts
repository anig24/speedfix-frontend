import { NextResponse, type NextRequest } from "next/server";
import { buildMarketplaceCatalog } from "@/lib/server/serviceMarketplaceBackend";

export async function GET(request: NextRequest) {
  const dashboard = buildMarketplaceCatalog({
    city: request.nextUrl.searchParams.get("city"),
    pincode: request.nextUrl.searchParams.get("pincode"),
    query: request.nextUrl.searchParams.get("q"),
  });

  return NextResponse.json({
    success: true,
    marketplace: dashboard,
  });
}
