import { NextResponse } from "next/server";
import { sendQuotation } from "@/lib/email";
import { requireEmailApiKey } from "@/lib/email-security";
import { quotationEmailSchema } from "@/lib/email-validation";
import { readJsonBody, validationErrorResponse } from "@/lib/email-route-utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = requireEmailApiKey(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const parsed = quotationEmailSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const result = await sendQuotation(parsed.data);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("EMAIL_QUOTATION_ERROR", error);
    return NextResponse.json(
      { error: "Unable to send quotation email." },
      { status: 500 }
    );
  }
}
