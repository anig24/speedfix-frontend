import { BodyText, EmailHeading, EmailShell, formatMoney, InfoPanel } from "@/lib/templates/components";

export type RefundProcessedEmailProps = {
  customerName?: string;
  bookingId?: string;
  refundId?: string;
  amount: number;
  expectedTimeline?: string;
};

export function RefundProcessedEmail({
  customerName = "there",
  bookingId,
  refundId,
  amount,
  expectedTimeline = "5 to 7 business days",
}: RefundProcessedEmailProps) {
  return (
    <EmailShell preview="Your SpeedFix refund has been processed">
      <EmailHeading>Refund processed</EmailHeading>
      <BodyText>
        Hi {customerName}, your refund has been processed by SpeedFix. Bank
        settlement timelines may vary by payment method.
      </BodyText>
      <InfoPanel
        items={[
          { label: "Booking ID", value: bookingId },
          { label: "Refund ID", value: refundId },
          { label: "Amount", value: formatMoney(amount) },
          { label: "Expected timeline", value: expectedTimeline },
        ]}
      />
    </EmailShell>
  );
}
