import { z } from "zod";

const DEFAULT_APP_URL = "https://speedfix.co.in";
const DEFAULT_SUPPORT_EMAIL = "support@speedfix.co.in";
const DEFAULT_FROM = "SpeedFix <noreply@speedfix.co.in>";

const emailEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().min(1).default(DEFAULT_FROM),
  ADMIN_EMAIL: z.string().min(1).optional(),
  SUPPORT_EMAIL: z.string().email().default(DEFAULT_SUPPORT_EMAIL),
  BOOKING_EMAIL: z.string().min(1).optional(),
  SALES_EMAIL: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  SPEEDFIX_EMAIL_API_KEY: z.string().min(1).optional(),
  EMAIL_MOCK_MODE: z.string().optional(),
  EMAIL_TOKEN_SECRET: z.string().min(24).optional(),
  EMAIL_RETRY_CRON_SECRET: z.string().min(16).optional(),
  RESEND_WEBHOOK_SECRET: z.string().min(16).optional(),
  RECAPTCHA_SECRET_KEY: z.string().min(1).optional(),
  NODE_ENV: z.string().optional(),
  VERCEL_URL: z.string().optional(),
});

export type EmailConfig = z.infer<typeof emailEnvSchema> & {
  appUrl: string;
  isMockMode: boolean;
};

function cleanEnv() {
  return Object.fromEntries(
    Object.entries(process.env).map(([key, value]) => [
      key,
      value && value.trim() ? value : undefined,
    ])
  );
}

function normalizeAppUrl(config: z.infer<typeof emailEnvSchema>) {
  if (config.NEXT_PUBLIC_APP_URL) {
    return config.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (config.VERCEL_URL) {
    const host = config.VERCEL_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }

  return DEFAULT_APP_URL;
}

export function getEmailConfig(): EmailConfig {
  const parsed = emailEnvSchema.safeParse(cleanEnv());

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid email environment configuration: ${message}`);
  }

  const appUrl = normalizeAppUrl(parsed.data);

  return {
    ...parsed.data,
    appUrl,
    isMockMode:
      parsed.data.EMAIL_MOCK_MODE === "true" ||
      (!parsed.data.RESEND_API_KEY && parsed.data.NODE_ENV !== "production"),
  };
}

export function parseEmailList(value?: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getAdminRecipients(channel?: "booking" | "sales" | "support") {
  const config = getEmailConfig();

  const channelRecipients =
    channel === "booking"
      ? parseEmailList(config.BOOKING_EMAIL)
      : channel === "sales"
        ? parseEmailList(config.SALES_EMAIL)
        : channel === "support"
          ? [config.SUPPORT_EMAIL]
          : [];

  return [
    ...channelRecipients,
    ...parseEmailList(config.ADMIN_EMAIL),
    config.SUPPORT_EMAIL,
  ].filter((item, index, list) => item && list.indexOf(item) === index);
}

export function getEmailTokenSecret() {
  return (
    process.env.EMAIL_TOKEN_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.RESEND_API_KEY ||
    "speedfix-development-email-secret-change-before-production"
  );
}
