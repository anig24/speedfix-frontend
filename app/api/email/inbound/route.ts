import { NextResponse } from "next/server";
import { handleInboundEmail } from "@/lib/email";
import { verifyWebhookSignature } from "@/lib/email-security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature =
    request.headers.get("resend-signature") ||
    request.headers.get("svix-signature") ||
    request.headers.get("x-webhook-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid inbound signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as Record<string, unknown>;
  const result = await handleInboundEmail(payload);

  return NextResponse.json({ success: true, ...result });
}
