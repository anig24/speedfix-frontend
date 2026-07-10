import crypto from "crypto";
import { NextResponse } from "next/server";
import { getEmailConfig } from "@/lib/email-config";
import { getClientIp } from "@/lib/rate-limit";

export function requireEmailApiKey(request: Request) {
  const config = getEmailConfig();

  if (!config.SPEEDFIX_EMAIL_API_KEY) {
    return config.NODE_ENV === "production"
      ? { ok: false, response: NextResponse.json({ error: "Email API key is not configured." }, { status: 500 }) }
      : { ok: true as const };
  }

  const headerKey =
    request.headers.get("x-speedfix-email-key") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (headerKey === config.SPEEDFIX_EMAIL_API_KEY) {
    return { ok: true as const };
  }

  return {
    ok: false as const,
    response: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
  };
}

export async function verifyRecaptcha(token: string | undefined, request: Request) {
  const config = getEmailConfig();

  if (!config.RECAPTCHA_SECRET_KEY) {
    return { success: true, skipped: true };
  }

  if (!token) {
    return { success: false, skipped: false };
  }

  const body = new URLSearchParams({
    secret: config.RECAPTCHA_SECRET_KEY,
    response: token,
    remoteip: getClientIp(request),
  });

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  }).catch(() => null);

  if (!response) {
    return { success: false, skipped: false };
  }

  const result = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    score?: number;
  };

  return {
    success: Boolean(result.success) && (result.score === undefined || result.score >= 0.5),
    skipped: false,
  };
}

export function hasSpamSignals(input: { message?: string; company?: string }) {
  if (input.company) {
    return true;
  }

  const message = input.message || "";
  const links = message.match(/https?:\/\//gi) || [];

  return links.length > 3;
}

export function verifyWebhookSignature(rawBody: string, signature?: string | null) {
  const config = getEmailConfig();

  if (!config.RESEND_WEBHOOK_SECRET) {
    return config.NODE_ENV !== "production";
  }

  if (!signature) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", config.RESEND_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  const incoming = signature.replace(/^sha256=/i, "");
  const expectedBuffer = Buffer.from(expected);
  const incomingBuffer = Buffer.from(incoming);

  return (
    expectedBuffer.length === incomingBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, incomingBuffer)
  );
}
