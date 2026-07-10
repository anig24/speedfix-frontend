import { NextResponse } from "next/server";
import {
  sendAdminNotification,
  sendBookingEmail,
  sendInvoice,
  sendOTP,
  sendQuotation,
  sendWelcome,
} from "@/lib/email";
import { getAdminRecipients, getEmailConfig } from "@/lib/email-config";
import { requireEmailApiKey } from "@/lib/email-security";
import { emailTestSchema } from "@/lib/email-validation";
import { readJsonBody, validationErrorResponse } from "@/lib/email-route-utils";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = requireEmailApiKey(request);

  if (!auth.ok) {
    return auth.response;
  }

  const config = getEmailConfig();

  return NextResponse.json({
    success: true,
    mode: config.isMockMode ? "mock" : "resend",
    from: config.EMAIL_FROM,
    appUrl: config.appUrl,
    hasResendApiKey: Boolean(config.RESEND_API_KEY),
    adminRecipients: getAdminRecipients(),
  });
}

export async function POST(request: Request) {
  const auth = requireEmailApiKey(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const parsed = emailTestSchema.safeParse(await readJsonBody(request));

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { to, type } = parsed.data;
    const result =
      type === "booking"
        ? await sendBookingEmail({
            customerEmail: to,
            customerName: "SpeedFix Test Customer",
            bookingId: "SFX-TEST-001",
            service: "AC service",
            date: "Tomorrow",
            time: "10:00 - 12:00",
            address: "SpeedFix demo address",
            assignedTechnician: "Demo Technician",
            priceEstimate: 999,
          })
        : type === "otp"
          ? await sendOTP({ email: to, purpose: "test" })
          : type === "invoice"
            ? await sendInvoice({
                customerEmail: to,
                customerName: "SpeedFix Test Customer",
                customerAddress: "SpeedFix demo address",
                invoiceNumber: "INV-TEST-001",
                subtotal: 999,
                tax: 180,
                total: 1179,
                lineItems: [
                  {
                    description: "AC service test line",
                    quantity: 1,
                    unitPrice: 999,
                    total: 999,
                  },
                ],
              })
            : type === "quotation"
              ? await sendQuotation({
                  customerEmail: to,
                  customerName: "SpeedFix Test Customer",
                  quotationId: "QTN-TEST-001",
                  lineItems: [{ service: "Deep cleaning", price: 2499 }],
                  subtotal: 2499,
                  discount: 250,
                  total: 2249,
                  validUntil: "7 days",
                  approveUrl: "https://speedfix.co.in/services",
                  rejectUrl: "https://speedfix.co.in/contact",
                })
              : type === "admin"
                ? await sendAdminNotification({
                    title: "SpeedFix admin email test",
                    summary: "This confirms admin notifications are wired.",
                    items: [{ label: "Recipient", value: to }],
                  })
                : await sendWelcome({
                    to,
                    name: "SpeedFix Test Customer",
                  });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("EMAIL_TEST_ERROR", error);
    return NextResponse.json(
      { error: "Unable to send test email." },
      { status: 500 }
    );
  }
}
