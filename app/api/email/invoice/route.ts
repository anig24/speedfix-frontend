import { NextResponse } from "next/server";
import { sendInvoice } from "@/lib/email";
import { requireEmailApiKey } from "@/lib/email-security";
import { invoiceEmailSchema } from "@/lib/email-validation";
import { readJsonBody, validationErrorResponse } from "@/lib/email-route-utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = requireEmailApiKey(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const parsed = invoiceEmailSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const result = await sendInvoice(parsed.data);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("EMAIL_INVOICE_ERROR", error);
    return NextResponse.json(
      { error: "Unable to send invoice email." },
      { status: 500 }
    );
  }
}
