import {
  BodyText,
  EmailHeading,
  EmailShell,
  InfoPanel,
  PrimaryButton,
} from "@/lib/templates/components";

export type CancellationEmailProps = {
  customerName?: string;
  bookingId: string;
  service?: string;
  reason?: string;
  supportUrl?: string;
};

export function CancellationEmail({
  customerName = "there",
  bookingId,
  service,
  reason,
  supportUrl = "https://speedfix.co.in/contact",
}: CancellationEmailProps) {
  return (
    <EmailShell preview={`Booking ${bookingId} cancelled`}>
      <EmailHeading>Your booking was cancelled</EmailHeading>
      <BodyText>
        Hi {customerName}, your SpeedFix booking has been cancelled. If this was
        not expected, our support team can help you restore or recreate it.
      </BodyText>
      <InfoPanel
        items={[
          { label: "Booking ID", value: bookingId },
          { label: "Service", value: service },
          { label: "Reason", value: reason },
        ]}
      />
      <PrimaryButton href={supportUrl}>Contact support</PrimaryButton>
    </EmailShell>
  );
}
