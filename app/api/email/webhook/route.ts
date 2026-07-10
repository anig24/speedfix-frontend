import { NextResponse } from "next/server";
import { recordEmailEvent } from "@/lib/email";
import { verifyWebhookSignature } from "@/lib/email-security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature =
    request.headers.get("resend-signature") ||
    request.headers.get("svix-signature") ||
    request.headers.get("x-webhook-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as Record<string, unknown>;
  const data = (payload.data || payload.email || {}) as Record<string, unknown>;

  await recordEmailEvent({
    eventType: String(payload.type || payload.event || "email.event"),
    providerMessageId: String(data.id || data.email_id || payload.email_id || ""),
    recipient: String(data.to || data.recipient || ""),
    payload,
  });

  return NextResponse.json({ received: true });
}
