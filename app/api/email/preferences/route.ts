import { NextResponse } from "next/server";
import { z } from "zod";
import { unsubscribeEmail } from "@/lib/email";
import {
  rateLimitedResponse,
  readJsonBody,
  validationErrorResponse,
} from "@/lib/email-route-utils";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

const preferenceSchema = z.object({
  email: z.string().trim().email().max(320),
  action: z.enum(["unsubscribe"]),
});

export async function POST(request: Request) {
  const parsed = preferenceSchema.safeParse(await readJsonBody(request));

  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  const limit = checkRateLimit({
    key: rateLimitKey(request, "email:preferences", parsed.data.email),
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });

  if (!limit.success) {
    return rateLimitedResponse(limit.retryAfterSeconds);
  }

  await unsubscribeEmail(parsed.data.email);

  return NextResponse.json({
    success: true,
    message: "Email preferences updated.",
  });
}
