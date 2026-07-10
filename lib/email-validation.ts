import { z } from "zod";

const email = z.string().trim().email().max(320);
const phone = z
  .string()
  .trim()
  .min(7)
  .max(18)
  .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number.");

export const contactEmailSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email,
  phone,
  service: z.string().trim().min(2).max(160),
  location: z.string().trim().min(2).max(180),
  message: z.string().trim().min(10).max(2500),
  recaptchaToken: z.string().trim().optional(),
  company: z.string().max(0).optional(),
});

export const bookingEmailSchema = z
  .object({
    customerEmail: email.optional(),
    customerName: z.string().trim().min(1).max(120).optional(),
    customerPhone: z.string().trim().max(18).optional(),
    bookingId: z.string().trim().min(1).max(80),
    bookingCode: z.string().trim().max(80).optional(),
    service: z.string().trim().min(1).max(160),
    serviceName: z.string().trim().max(160).optional(),
    date: z.string().trim().max(80).optional(),
    time: z.string().trim().max(80).optional(),
    requestedSlot: z.string().trim().max(120).optional(),
    address: z.string().trim().max(600).optional(),
    city: z.string().trim().max(100).optional(),
    pincode: z.string().trim().max(12).optional(),
    assignedTechnician: z.string().trim().max(120).optional(),
    assignedTechnicianPhone: z.string().trim().max(18).optional(),
    priceEstimate: z.coerce.number().finite().nonnegative().optional(),
    paymentStatus: z.string().trim().max(80).optional(),
    googleMapsUrl: z.string().url().optional(),
  })
  .passthrough();

export const otpEmailSchema = z.object({
  action: z.enum(["send", "resend", "verify"]).default("send"),
  email,
  purpose: z.string().trim().min(2).max(80).default("login"),
  otp: z.string().trim().regex(/^\d{6}$/).optional(),
});

export const passwordResetEmailSchema = z.object({
  email,
  name: z.string().trim().max(120).optional(),
  redirectPath: z.string().trim().max(180).optional(),
});

export const invoiceEmailSchema = z.object({
  customerEmail: email,
  customerName: z.string().trim().min(1).max(120),
  customerAddress: z.string().trim().max(600).optional(),
  invoiceNumber: z.string().trim().min(1).max(80),
  gstNumber: z.string().trim().max(80).optional(),
  paymentLink: z.string().url().optional(),
  currency: z.string().trim().length(3).default("INR"),
  subtotal: z.coerce.number().finite().nonnegative(),
  tax: z.coerce.number().finite().nonnegative().default(0),
  total: z.coerce.number().finite().nonnegative(),
  lineItems: z
    .array(
      z.object({
        description: z.string().trim().min(1).max(220),
        quantity: z.coerce.number().finite().positive(),
        unitPrice: z.coerce.number().finite().nonnegative(),
        total: z.coerce.number().finite().nonnegative(),
      })
    )
    .min(1)
    .max(40),
});

export const quotationEmailSchema = z.object({
  customerEmail: email,
  customerName: z.string().trim().max(120).optional(),
  quotationId: z.string().trim().min(1).max(80),
  lineItems: z
    .array(
      z.object({
        service: z.string().trim().min(1).max(180),
        price: z.coerce.number().finite().nonnegative(),
      })
    )
    .min(1)
    .max(40),
  subtotal: z.coerce.number().finite().nonnegative(),
  discount: z.coerce.number().finite().nonnegative().default(0),
  total: z.coerce.number().finite().nonnegative(),
  validUntil: z.string().trim().min(1).max(80),
  approveUrl: z.string().url(),
  rejectUrl: z.string().url(),
});

export const adminNotificationSchema = z.object({
  title: z.string().trim().min(2).max(160),
  summary: z.string().trim().max(800).optional(),
  channel: z.enum(["booking", "sales", "support"]).optional(),
  items: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(80),
        value: z.union([z.string(), z.number(), z.null()]).optional(),
      })
    )
    .min(1)
    .max(30),
});

export const emailTestSchema = z.object({
  to: email,
  type: z
    .enum(["welcome", "booking", "otp", "invoice", "quotation", "admin"])
    .default("welcome"),
});
