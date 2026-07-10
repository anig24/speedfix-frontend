import { Resend } from "resend";
import { getEmailConfig } from "@/lib/email-config";

let resendClient: Resend | null = null;

export function getResendClient() {
  const config = getEmailConfig();

  if (!config.RESEND_API_KEY) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(config.RESEND_API_KEY);
  }

  return resendClient;
}
