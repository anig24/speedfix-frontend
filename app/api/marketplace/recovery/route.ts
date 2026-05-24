import { NextResponse } from "next/server";
import { createMarketplaceRecoveryCase } from "@/lib/server/serviceMarketplaceBackend";

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const result = await createMarketplaceRecoveryCase(payload);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      recovery: result,
    });
  } catch (error) {
    console.error("MARKETPLACE_RECOVERY_ERROR", error);

    return NextResponse.json(
      { error: "Unable to open support recovery right now." },
      { status: 500 }
    );
  }
}
