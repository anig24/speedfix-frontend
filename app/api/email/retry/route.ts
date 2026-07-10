import { NextResponse } from "next/server";
import { processEmailQueue } from "@/lib/email";
import { getEmailConfig } from "@/lib/email-config";
import { requireEmailApiKey } from "@/lib/email-security";

export const runtime = "nodejs";

function isCronAuthorized(request: Request) {
  const config = getEmailConfig();
  const cronSecret = request.headers.get("x-cron-secret");

  return Boolean(config.EMAIL_RETRY_CRON_SECRET && cronSecret === config.EMAIL_RETRY_CRON_SECRET);
}

export async function POST(request: Request) {
  const auth = isCronAuthorized(request)
    ? { ok: true as const }
    : requireEmailApiKey(request);

  if (!auth.ok) {
    return auth.response;
  }

  const result = await processEmailQueue();

  return NextResponse.json({
    success: true,
    ...result,
  });
}
