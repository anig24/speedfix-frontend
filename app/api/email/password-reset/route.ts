import { NextResponse } from "next/server";
import { sendPasswordReset } from "@/lib/email";
import { passwordResetEmailSchema } from "@/lib/email-validation";
import {
  rateLimitedResponse,
  readJsonBody,
  validationErrorResponse,
} from "@/lib/email-route-utils";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const parsed = passwordResetEmailSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const limit = checkRateLimit({
      key: rateLimitKey(request, "email:password-reset", parsed.data.email),
      limit: 3,
      windowMs: 60 * 60 * 1000,
    });

    if (!limit.success) {
      return rateLimitedResponse(limit.retryAfterSeconds);
    }

    const result = await sendPasswordReset(parsed.data);

    return NextResponse.json({
      success: true,
      expiresAt: result.expiresAt,
      debugResetUrl: result.debugResetUrl,
    });
  } catch (error) {
    console.error("EMAIL_PASSWORD_RESET_ERROR", error);
    return NextResponse.json(
      { error: "Unable to send password reset email." },
      { status: 500 }
    );
  }
}
