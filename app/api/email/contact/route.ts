import { NextResponse } from "next/server";
import { sendContact } from "@/lib/email";
import { hasSpamSignals, verifyRecaptcha } from "@/lib/email-security";
import { contactEmailSchema } from "@/lib/email-validation";
import {
  rateLimitedResponse,
  readJsonBody,
  validationErrorResponse,
} from "@/lib/email-route-utils";
import { checkRateLimit, getClientIp, rateLimitKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const parsed = contactEmailSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const limit = checkRateLimit({
      key: rateLimitKey(request, "email:contact", parsed.data.email),
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!limit.success) {
      return rateLimitedResponse(limit.retryAfterSeconds);
    }

    if (hasSpamSignals(parsed.data)) {
      return NextResponse.json(
        { error: "Unable to accept this message." },
        { status: 400 }
      );
    }

    const recaptcha = await verifyRecaptcha(parsed.data.recaptchaToken, request);

    if (!recaptcha.success) {
      return NextResponse.json(
        { error: "Spam protection failed. Please try again." },
        { status: 400 }
      );
    }

    const result = await sendContact({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      service: parsed.data.service,
      location: parsed.data.location,
      message: parsed.data.message,
      ipAddress: getClientIp(request),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({
      success: true,
      contactInquiryId: result.contactInquiryId,
    });
  } catch (error) {
    console.error("EMAIL_CONTACT_ERROR", error);
    return NextResponse.json(
      { error: "Unable to submit your request right now." },
      { status: 500 }
    );
  }
}
