import { NextResponse } from "next/server";
import { buildMarketplaceQuote } from "@/lib/server/serviceMarketplaceBackend";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  return NextResponse.json({
    success: true,
    quote: buildMarketplaceQuote(payload),
  });
}
