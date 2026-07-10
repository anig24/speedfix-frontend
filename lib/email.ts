import crypto from "crypto";
import type { Prisma } from "@prisma/client";
import type { ReactElement } from "react";
import { AdminNotificationEmail } from "@/lib/templates/admin-notification";
import {
  BookingConfirmationEmail,
  BookingReminderEmail,
  type BookingEmailProps,
} from "@/lib/templates/booking";
import {
  ContactAdminEmail,
  ContactThankYouEmail,
  type ContactTemplateProps,
} from "@/lib/templates/contact";
import { FeedbackThankYouEmail } from "@/lib/templates/feedback";
import { InvoiceEmail } from "@/lib/templates/invoice";
import { OtpEmail } from "@/lib/templates/otp";
import { PasswordResetEmail } from "@/lib/templates/password-reset";
import { PaymentStatusEmail } from "@/lib/templates/payment";
import { QuotationEmail, type QuotationEmailProps } from "@/lib/templates/quotation";
import { RefundProcessedEmail } from "@/lib/templates/refund";
import { ReviewRequestEmail } from "@/lib/templates/review";
import { WelcomeEmail } from "@/lib/templates/welcome";
import { NewServiceRequestEmail, NewUserRegisteredEmail } from "@/lib/templates/user-events";
import {
  getAdminRecipients,
  getEmailConfig,
  getEmailTokenSecret,
} from "@/lib/email-config";
import { generateInvoicePdf, type InvoicePdfInput } from "@/lib/email-pdf";
import { prisma, withPrismaFallback } from "@/lib/prisma";
import { getResendClient } from "@/lib/resend";

export type EmailTemplateName =
  | "welcome"
  | "booking"
  | "booking-reminder"
  | "booking-cancellation"
  | "contact"
  | "contact-thank-you"
  | "otp"
  | "password-reset"
  | "invoice"
  | "quotation"
  | "payment-successful"
  | "payment-failed"
  | "refund-processed"
  | "admin-notification"
  | "new-user-registered"
  | "new-service-request"
  | "review-request"
  | "feedback-thank-you";

export type EmailAttachment = {
  content?: string | Buffer;
  filename?: string | false;
  path?: string;
  contentType?: string;
  contentId?: string;
};

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  template: EmailTemplateName | string;
  react: ReactElement;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  attachments?: EmailAttachment[];
  headers?: Record<string, string>;
  tags?: Array<{ name: string; value: string }>;
  metadata?: Record<string, unknown>;
  idempotencyKey?: string;
  maxAttempts?: number;
};

export type SendEmailResult = {
  id: string;
  logId?: string;
  status: "sent" | "mocked";
  mock: boolean;
};

type AdminNotificationInput = {
  title: string;
  summary?: string;
  channel?: "booking" | "sales" | "support";
  items: Array<{ label: string; value?: string | number | null }>;
};

function toJson(value: unknown) {
  return JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue;
}

function toJsonObject(value: unknown) {
  return JSON.parse(JSON.stringify(value ?? {})) as Record<string, unknown>;
}

function recipientString(to: string | string[]) {
  return Array.isArray(to) ? to.join(",") : to;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function hashToken(value: string) {
  return crypto
    .createHmac("sha256", getEmailTokenSecret())
    .update(value)
    .digest("hex");
}

function timingSafeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function buildGoogleMapsLink(address?: string | null) {
  return address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : undefined;
}

async function createEmailLog(input: SendEmailInput) {
  return withPrismaFallback(
    "EMAIL_LOG_CREATE",
    () =>
      prisma.emailLog.create({
        data: {
          recipient: recipientString(input.to),
          subject: input.subject,
          template: input.template,
          status: "PENDING",
          provider: "resend",
          metadata: toJson(input.metadata),
        },
      }),
    null
  );
}

async function updateEmailLog(
  logId: string | undefined,
  data: {
    status: "SENT" | "FAILED" | "RETRYING" | "SKIPPED";
    error?: string;
    providerMessageId?: string;
    sentAt?: Date;
    retryCount?: number;
  }
) {
  if (!logId) {
    return;
  }

  await withPrismaFallback(
    "EMAIL_LOG_UPDATE",
    () =>
      prisma.emailLog.update({
        where: { id: logId },
        data,
      }),
    null
  );
}

async function createSkippedEmailLog(input: {
  recipient: string;
  subject: string;
  template: string;
  reason: string;
  metadata?: Record<string, unknown>;
}) {
  await withPrismaFallback(
    "EMAIL_LOG_SKIP",
    () =>
      prisma.emailLog.create({
        data: {
          recipient: input.recipient,
          subject: input.subject,
          template: input.template,
          status: "SKIPPED",
          error: input.reason,
          provider: "resend",
          metadata: toJson(input.metadata),
        },
      }),
    null
  );
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const config = getEmailConfig();
  const log = await createEmailLog(input);
  const maxAttempts = Math.max(1, input.maxAttempts ?? 2);

  if (config.isMockMode) {
    const id = `mock_${crypto.randomUUID()}`;
    console.info("EMAIL_MOCK_SEND", {
      id,
      to: input.to,
      subject: input.subject,
      template: input.template,
    });
    await updateEmailLog(log?.id, {
      status: "SKIPPED",
      providerMessageId: id,
      sentAt: new Date(),
    });

    return {
      id,
      logId: log?.id,
      status: "mocked",
      mock: true,
    };
  }

  const resend = getResendClient();

  if (!resend) {
    await updateEmailLog(log?.id, {
      status: "FAILED",
      error: "RESEND_API_KEY is not configured.",
    });
    throw new Error("RESEND_API_KEY is not configured.");
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await resend.emails.send(
        {
          from: input.from || config.EMAIL_FROM,
          to: input.to,
          subject: input.subject,
          react: input.react,
          cc: input.cc,
          bcc: input.bcc,
          replyTo: input.replyTo,
          attachments: input.attachments,
          headers: input.headers,
          tags: input.tags,
        },
        {
          idempotencyKey:
            input.idempotencyKey ||
            `${input.template}:${crypto
              .createHash("sha256")
              .update(`${recipientString(input.to)}:${input.subject}`)
              .digest("hex")
              .slice(0, 24)}`,
        }
      );

      if (response.error) {
        throw new Error(response.error.message);
      }

      const messageId = response.data?.id || crypto.randomUUID();
      await updateEmailLog(log?.id, {
        status: "SENT",
        providerMessageId: messageId,
        sentAt: new Date(),
        retryCount: attempt - 1,
      });

      return {
        id: messageId,
        logId: log?.id,
        status: "sent",
        mock: false,
      };
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts) {
        await updateEmailLog(log?.id, {
          status: "RETRYING",
          error: error instanceof Error ? error.message : "Unknown email error",
          retryCount: attempt,
        });
      }
    }
  }

  const message = lastError instanceof Error ? lastError.message : "Unknown email error";
  await updateEmailLog(log?.id, {
    status: "FAILED",
    error: message,
    retryCount: maxAttempts,
  });
  throw new Error(message);
}

export async function sendWelcome(input: {
  to: string;
  name?: string;
  dashboardUrl?: string;
}) {
  return sendEmail({
    to: input.to,
    subject: "Welcome to SpeedFix",
    template: "welcome",
    react: WelcomeEmail({ name: input.name, dashboardUrl: input.dashboardUrl }),
    metadata: { name: input.name },
  });
}

export async function sendContact(input: ContactTemplateProps & {
  ipAddress?: string;
  userAgent?: string;
}) {
  const contact = await withPrismaFallback(
    "CONTACT_CREATE",
    () =>
      prisma.contactInquiry.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          service: input.service,
          location: input.location,
          message: input.message,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        },
      }),
    null
  );

  const adminEmail = await sendEmail({
    to: getAdminRecipients("support"),
    replyTo: input.email,
    subject: `New SpeedFix contact request: ${input.service}`,
    template: "contact",
    react: ContactAdminEmail(input),
    metadata: { contactInquiryId: contact?.id, source: "contact-form" },
  });

  const customerEmail = await sendEmail({
    to: input.email,
    subject: "We received your SpeedFix request",
    template: "contact-thank-you",
    react: ContactThankYouEmail(input),
    metadata: { contactInquiryId: contact?.id, source: "contact-form" },
  });

  return {
    contactInquiryId: contact?.id,
    adminEmail,
    customerEmail,
  };
}

export async function sendBookingEmail(input: BookingEmailProps & {
  customerEmail?: string;
  customerPhone?: string;
  bookingCode?: string;
  city?: string;
  pincode?: string;
  paymentStatus?: string;
  assignedTechnicianPhone?: string;
  googleMapsUrl?: string;
}) {
  const bookingId = input.bookingCode || input.bookingId;
  const trackingUrl = `https://speedfix.co.in/track?bookingId=${encodeURIComponent(input.bookingId)}`;
  const service = input.service;
  const address = input.address || [input.city, input.pincode].filter(Boolean).join(" ");
  const googleMapsUrl = input.googleMapsUrl || buildGoogleMapsLink(address);
  const adminRecipients = getAdminRecipients("booking");

  const customerEmail = input.customerEmail
    ? await sendEmail({
        to: input.customerEmail,
        subject: `SpeedFix booking confirmed: ${bookingId}`,
        template: "booking",
        react: BookingConfirmationEmail({
          ...input,
          bookingId,
          service,
          address,
          trackingUrl,
        }),
        metadata: { bookingId: input.bookingId, bookingCode: input.bookingCode },
      })
    : null;

  if (!input.customerEmail) {
    await createSkippedEmailLog({
      recipient: "customer-email-missing",
      subject: `SpeedFix booking confirmed: ${bookingId}`,
      template: "booking",
      reason: "Booking payload did not include customerEmail.",
      metadata: { bookingId: input.bookingId, bookingCode: input.bookingCode },
    });
  }

  const adminEmail = await sendEmail({
    to: adminRecipients,
    subject: `New booking: ${bookingId}`,
    template: "admin-notification",
    react: AdminNotificationEmail({
      title: "New SpeedFix booking",
      summary: "A new service booking has entered the operations queue.",
      items: [
        { label: "Booking ID", value: bookingId },
        { label: "Customer", value: input.customerName },
        { label: "Customer email", value: input.customerEmail || "Not provided" },
        { label: "Customer phone", value: input.customerPhone },
        { label: "Service", value: service },
        { label: "Slot", value: input.date || input.time ? `${input.date || ""} ${input.time || ""}`.trim() : undefined },
        { label: "Address", value: address },
        { label: "Technician", value: input.assignedTechnician || "Assignment in progress" },
        { label: "Technician phone", value: input.assignedTechnicianPhone },
        { label: "Price estimate", value: input.priceEstimate },
        { label: "Payment status", value: input.paymentStatus },
        { label: "Google Maps", value: googleMapsUrl },
      ],
    }),
    metadata: { bookingId: input.bookingId, bookingCode: input.bookingCode },
  });

  return {
    customerEmail,
    adminEmail,
  };
}

export async function sendBookingReminder(input: BookingEmailProps & { customerEmail: string }) {
  return sendEmail({
    to: input.customerEmail,
    subject: `Reminder: SpeedFix booking ${input.bookingId}`,
    template: "booking-reminder",
    react: BookingReminderEmail(input),
    metadata: { bookingId: input.bookingId },
  });
}

export async function sendOTP(input: {
  email: string;
  purpose?: string;
}) {
  const email = normalizeEmail(input.email);
  const purpose = input.purpose || "login";
  const otp = crypto.randomInt(100000, 1000000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const token = await withPrismaFallback(
    "OTP_CREATE",
    async () => {
      await prisma.otpToken.updateMany({
        where: {
          email,
          purpose,
          consumedAt: null,
        },
        data: {
          consumedAt: new Date(),
        },
      });

      return prisma.otpToken.create({
        data: {
          email,
          purpose,
          otpHash: hashToken(otp),
          expiresAt,
        },
      });
    },
    null
  );

  const config = getEmailConfig();

  if (!token && !config.isMockMode) {
    throw new Error("OTP storage is unavailable.");
  }

  const result = await sendEmail({
    to: email,
    subject: "Your SpeedFix verification code",
    template: "otp",
    react: OtpEmail({ otp, purpose, expiresInMinutes: 10 }),
    metadata: { purpose, tokenId: token?.id },
  });

  return {
    email,
    expiresAt,
    emailResult: result,
    debugOtp: config.isMockMode ? otp : undefined,
  };
}

export async function verifyOTP(input: {
  email: string;
  purpose?: string;
  otp: string;
}) {
  const email = normalizeEmail(input.email);
  const purpose = input.purpose || "login";
  const otpHash = hashToken(input.otp);
  const now = new Date();

  const token = await withPrismaFallback(
    "OTP_FIND",
    () =>
      prisma.otpToken.findFirst({
        where: {
          email,
          purpose,
          consumedAt: null,
          expiresAt: {
            gt: now,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    null
  );

  if (!token) {
    return { verified: false, reason: "OTP expired or not found." };
  }

  if (token.attempts >= 5) {
    await prisma.otpToken.update({
      where: { id: token.id },
      data: { consumedAt: now },
    }).catch(() => undefined);

    return { verified: false, reason: "Too many attempts." };
  }

  if (!timingSafeEqual(token.otpHash, otpHash)) {
    await prisma.otpToken.update({
      where: { id: token.id },
      data: { attempts: { increment: 1 } },
    }).catch(() => undefined);

    return { verified: false, reason: "Invalid OTP." };
  }

  await prisma.otpToken.update({
    where: { id: token.id },
    data: { consumedAt: now },
  }).catch(() => undefined);

  return { verified: true };
}

export async function sendPasswordReset(input: {
  email: string;
  name?: string;
  redirectPath?: string;
}) {
  const config = getEmailConfig();
  const email = normalizeEmail(input.email);
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  const redirectPath = input.redirectPath || "/auth/reset-password";
  const resetUrl = `${config.appUrl}${redirectPath}?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  const record = await withPrismaFallback(
    "PASSWORD_RESET_CREATE",
    async () => {
      await prisma.passwordResetToken.updateMany({
        where: {
          email,
          consumedAt: null,
        },
        data: {
          consumedAt: new Date(),
        },
      });

      return prisma.passwordResetToken.create({
        data: {
          email,
          tokenHash: hashToken(token),
          expiresAt,
        },
      });
    },
    null
  );

  if (!record && !config.isMockMode) {
    throw new Error("Password reset storage is unavailable.");
  }

  const emailResult = await sendEmail({
    to: email,
    subject: "Reset your SpeedFix password",
    template: "password-reset",
    react: PasswordResetEmail({ resetUrl, expiresInMinutes: 30 }),
    metadata: { resetTokenId: record?.id },
  });

  return {
    expiresAt,
    emailResult,
    debugResetUrl: config.isMockMode ? resetUrl : undefined,
  };
}

export async function sendInvoice(input: InvoicePdfInput & { customerEmail: string }) {
  const pdf = await generateInvoicePdf(input);

  return sendEmail({
    to: input.customerEmail,
    subject: `SpeedFix invoice ${input.invoiceNumber}`,
    template: "invoice",
    react: InvoiceEmail({
      customerName: input.customerName,
      invoiceNumber: input.invoiceNumber,
      total: input.total,
      tax: input.tax,
      gstNumber: input.gstNumber,
      paymentLink: input.paymentLink,
      currency: input.currency,
    }),
    attachments: [
      {
        filename: `speedfix-invoice-${input.invoiceNumber}.pdf`,
        content: pdf,
        contentType: "application/pdf",
      },
    ],
    metadata: { invoiceNumber: input.invoiceNumber },
  });
}

export async function sendQuotation(input: QuotationEmailProps & { customerEmail: string }) {
  return sendEmail({
    to: input.customerEmail,
    subject: `SpeedFix quotation ${input.quotationId}`,
    template: "quotation",
    react: QuotationEmail(input),
    metadata: { quotationId: input.quotationId },
  });
}

export async function sendAdminNotification(input: AdminNotificationInput) {
  return sendEmail({
    to: getAdminRecipients(input.channel),
    subject: input.title,
    template: "admin-notification",
    react: AdminNotificationEmail(input),
    metadata: { channel: input.channel },
  });
}

export async function sendPaymentStatus(input: {
  customerEmail: string;
  customerName?: string;
  bookingId?: string;
  amount: number;
  status: "successful" | "failed";
  paymentLink?: string;
}) {
  return sendEmail({
    to: input.customerEmail,
    subject:
      input.status === "successful"
        ? "SpeedFix payment successful"
        : "SpeedFix payment failed",
    template: input.status === "successful" ? "payment-successful" : "payment-failed",
    react: PaymentStatusEmail(input),
    metadata: { bookingId: input.bookingId, status: input.status },
  });
}

export async function sendRefundProcessed(input: {
  customerEmail: string;
  customerName?: string;
  bookingId?: string;
  refundId?: string;
  amount: number;
  expectedTimeline?: string;
}) {
  return sendEmail({
    to: input.customerEmail,
    subject: "Your SpeedFix refund has been processed",
    template: "refund-processed",
    react: RefundProcessedEmail(input),
    metadata: { bookingId: input.bookingId, refundId: input.refundId },
  });
}

export async function sendReviewRequest(input: {
  customerEmail: string;
  customerName?: string;
  bookingId: string;
  service?: string;
  reviewUrl: string;
}) {
  return sendEmail({
    to: input.customerEmail,
    subject: "How was your SpeedFix service?",
    template: "review-request",
    react: ReviewRequestEmail(input),
    metadata: { bookingId: input.bookingId },
  });
}

export async function sendFeedbackThankYou(input: {
  customerEmail: string;
  customerName?: string;
}) {
  return sendEmail({
    to: input.customerEmail,
    subject: "Thanks for your SpeedFix feedback",
    template: "feedback-thank-you",
    react: FeedbackThankYouEmail(input),
    metadata: { source: "feedback" },
  });
}

export async function sendNewUserRegisteredNotification(input: {
  name?: string;
  email: string;
  phone?: string;
}) {
  return sendEmail({
    to: getAdminRecipients("support"),
    subject: "New SpeedFix user registered",
    template: "new-user-registered",
    react: NewUserRegisteredEmail({
      title: "New user registered",
      summary: "A new customer account was created.",
      items: [
        { label: "Name", value: input.name },
        { label: "Email", value: input.email },
        { label: "Phone", value: input.phone },
      ],
    }),
    metadata: { userEmail: input.email },
  });
}

export async function sendNewServiceRequestNotification(input: {
  requestId?: string;
  customerName?: string;
  customerEmail?: string;
  service: string;
  location?: string;
}) {
  return sendEmail({
    to: getAdminRecipients("booking"),
    subject: `New service request: ${input.service}`,
    template: "new-service-request",
    react: NewServiceRequestEmail({
      title: "New service request",
      summary: "A new service request needs operations review.",
      items: [
        { label: "Request ID", value: input.requestId },
        { label: "Customer", value: input.customerName },
        { label: "Email", value: input.customerEmail },
        { label: "Service", value: input.service },
        { label: "Location", value: input.location },
      ],
    }),
    metadata: { requestId: input.requestId },
  });
}

export async function queueEmail(input: {
  to: string;
  subject: string;
  template: EmailTemplateName;
  payload: Record<string, unknown>;
  nextRunAt?: Date;
  maxAttempts?: number;
}) {
  return withPrismaFallback(
    "EMAIL_QUEUE_CREATE",
    () =>
      prisma.emailQueue.create({
        data: {
          recipient: input.to,
          subject: input.subject,
          template: input.template,
          payload: toJson(input.payload),
          nextRunAt: input.nextRunAt,
          maxAttempts: input.maxAttempts ?? 3,
        },
      }),
    null
  );
}

function renderQueuedTemplate(template: string, payload: Record<string, unknown>) {
  switch (template) {
    case "welcome":
      return WelcomeEmail(payload as { name?: string; dashboardUrl?: string });
    case "admin-notification":
      return AdminNotificationEmail(payload as AdminNotificationInput);
    case "feedback-thank-you":
      return FeedbackThankYouEmail(payload as { customerName?: string });
    default:
      return AdminNotificationEmail({
        title: "Queued SpeedFix email",
        summary: `Template ${template} requires manual replay.`,
        items: [{ label: "Payload", value: JSON.stringify(payload).slice(0, 800) }],
      });
  }
}

export async function processEmailQueue(limit = 20) {
  const now = new Date();
  const jobs = await withPrismaFallback(
    "EMAIL_QUEUE_LIST",
    () =>
      prisma.emailQueue.findMany({
        where: {
          status: {
            in: ["PENDING", "FAILED"],
          },
          nextRunAt: {
            lte: now,
          },
          attempts: {
            lt: 3,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        take: limit,
      }),
    []
  );

  const results = [];

  for (const job of jobs) {
    await prisma.emailQueue.update({
      where: { id: job.id },
      data: {
        status: "PROCESSING",
        attempts: { increment: 1 },
      },
    }).catch(() => undefined);

    try {
      const payload = toJsonObject(job.payload);
      const email = await sendEmail({
        to: job.recipient,
        subject: job.subject,
        template: job.template,
        react: renderQueuedTemplate(job.template, payload),
        metadata: { queueId: job.id },
      });

      await prisma.emailQueue.update({
        where: { id: job.id },
        data: {
          status: "SENT",
          sentAt: new Date(),
          lastError: null,
        },
      });

      results.push({ id: job.id, status: "sent", emailId: email.id });
    } catch (error) {
      const attempts = job.attempts + 1;
      const failedPermanently = attempts >= job.maxAttempts;

      await prisma.emailQueue.update({
        where: { id: job.id },
        data: {
          status: failedPermanently ? "FAILED" : "PENDING",
          lastError: error instanceof Error ? error.message : "Unknown queue error",
          nextRunAt: new Date(Date.now() + Math.min(60, attempts * attempts * 5) * 60 * 1000),
        },
      }).catch(() => undefined);

      results.push({ id: job.id, status: failedPermanently ? "failed" : "retrying" });
    }
  }

  return {
    processed: results.length,
    results,
  };
}

export async function recordEmailEvent(input: {
  eventType: string;
  providerMessageId?: string;
  recipient?: string;
  payload: Record<string, unknown>;
}) {
  return withPrismaFallback(
    "EMAIL_EVENT_CREATE",
    () =>
      prisma.emailEvent.create({
        data: {
          eventType: input.eventType,
          providerMessageId: input.providerMessageId,
          recipient: input.recipient,
          payload: toJson(input.payload),
        },
      }),
    null
  );
}

export async function handleInboundEmail(payload: Record<string, unknown>) {
  const fromEmail =
    String(payload.from || payload.sender || payload.from_email || "").trim() ||
    "unknown@example.com";
  const toEmail = String(payload.to || payload.recipient || "").trim() || null;
  const subject = String(payload.subject || "Inbound SpeedFix email").trim();
  const textBody = String(payload.text || payload.textBody || payload.body || "").trim();
  const htmlBody = String(payload.html || payload.htmlBody || "").trim();
  const attachments = Array.isArray(payload.attachments) ? payload.attachments : [];

  const inbound = await withPrismaFallback(
    "INBOUND_EMAIL_CREATE",
    () =>
      prisma.inboundEmail.create({
        data: {
          provider: "resend",
          messageId: String(payload.messageId || payload.id || "") || null,
          fromEmail,
          toEmail,
          subject,
          textBody,
          htmlBody,
          attachments: toJson(attachments),
          rawPayload: toJson(payload),
        },
      }),
    null
  );

  const ticket = await withPrismaFallback(
    "SUPPORT_TICKET_CREATE",
    () =>
      prisma.supportTicket.create({
        data: {
          inboundEmailId: inbound?.id,
          requesterEmail: fromEmail,
          subject,
          priority: "NORMAL",
          metadata: toJson({ source: "inbound-email" }),
        },
      }),
    null
  );

  await sendAdminNotification({
    title: "Inbound support email received",
    summary: "An inbound email was received and a support ticket was created.",
    channel: "support",
    items: [
      { label: "From", value: fromEmail },
      { label: "To", value: toEmail },
      { label: "Subject", value: subject },
      { label: "Ticket ID", value: ticket?.id },
    ],
  }).catch((error) => console.error("INBOUND_EMAIL_ADMIN_NOTIFY_FAILED", error));

  return {
    inboundEmailId: inbound?.id,
    supportTicketId: ticket?.id,
  };
}

export async function unsubscribeEmail(email: string) {
  const normalized = normalizeEmail(email);

  return withPrismaFallback(
    "EMAIL_UNSUBSCRIBE",
    () =>
      prisma.emailPreference.upsert({
        where: { email: normalized },
        create: {
          email: normalized,
          marketingEnabled: false,
          reviewRequestsEnabled: false,
          unsubscribedAt: new Date(),
        },
        update: {
          marketingEnabled: false,
          reviewRequestsEnabled: false,
          unsubscribedAt: new Date(),
        },
      }),
    null
  );
}
