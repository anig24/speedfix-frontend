import { NextResponse } from "next/server";
import { sendOTP, verifyOTP } from "@/lib/email";
import { otpEmailSchema } from "@/lib/email-validation";
import {
  rateLimitedResponse,
  readJsonBody,
  validationErrorResponse,
} from "@/lib/email-route-utils";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const parsed = otpEmailSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const limit = checkRateLimit({
      key: rateLimitKey(
        request,
        `email:otp:${parsed.data.action}`,
        parsed.data.email
      ),
      limit: parsed.data.action === "verify" ? 10 : 3,
      windowMs: 10 * 60 * 1000,
    });

    if (!limit.success) {
      return rateLimitedResponse(limit.retryAfterSeconds);
    }

    if (parsed.data.action === "verify") {
      if (!parsed.data.otp) {
        return NextResponse.json(
          { error: "OTP is required for verification." },
          { status: 400 }
        );
      }

      const result = await verifyOTP({
        email: parsed.data.email,
        purpose: parsed.data.purpose,
        otp: parsed.data.otp,
      });

      return NextResponse.json(result, { status: result.verified ? 200 : 400 });
    }

    const result = await sendOTP({
      email: parsed.data.email,
      purpose: parsed.data.purpose,
    });

    return NextResponse.json({
      success: true,
      expiresAt: result.expiresAt,
      debugOtp: result.debugOtp,
    });
  } catch (error) {
    console.error("EMAIL_OTP_ERROR", error);
    return NextResponse.json(
      { error: "Unable to process OTP request." },
      { status: 500 }
    );
  }
}
