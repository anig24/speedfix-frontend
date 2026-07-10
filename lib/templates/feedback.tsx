import { BodyText, EmailHeading, EmailShell, PrimaryButton } from "@/lib/templates/components";

export type FeedbackThankYouEmailProps = {
  customerName?: string;
  supportUrl?: string;
};

export function FeedbackThankYouEmail({
  customerName = "there",
  supportUrl = "https://speedfix.co.in/contact",
}: FeedbackThankYouEmailProps) {
  return (
    <EmailShell preview="Thanks for your SpeedFix feedback">
      <EmailHeading>Thanks for the feedback, {customerName}</EmailHeading>
      <BodyText>
        Your note helps us improve technician quality, dispatch accuracy, and
        customer support. Our team reviews every response.
      </BodyText>
      <PrimaryButton href={supportUrl}>Contact support</PrimaryButton>
    </EmailShell>
  );
}
