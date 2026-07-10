import {
  BodyText,
  EmailHeading,
  EmailShell,
  formatMoney,
  InfoPanel,
  PrimaryButton,
} from "@/lib/templates/components";

export type PaymentStatusEmailProps = {
  customerName?: string;
  bookingId?: string;
  amount: number;
  status: "successful" | "failed";
  paymentLink?: string;
};

export function PaymentStatusEmail({
  customerName = "there",
  bookingId,
  amount,
  status,
  paymentLink = "https://speedfix.co.in/cart",
}: PaymentStatusEmailProps) {
  const successful = status === "successful";

  return (
    <EmailShell preview={successful ? "SpeedFix payment successful" : "SpeedFix payment failed"}>
      <EmailHeading>{successful ? "Payment successful" : "Payment failed"}</EmailHeading>
      <BodyText>
        Hi {customerName}, {successful ? "we received your payment." : "we could not complete your payment. You can retry securely from SpeedFix."}
      </BodyText>
      <InfoPanel
        items={[
          { label: "Booking ID", value: bookingId },
          { label: "Amount", value: formatMoney(amount) },
          { label: "Status", value: successful ? "Successful" : "Failed" },
        ]}
      />
      {!successful ? <PrimaryButton href={paymentLink}>Retry payment</PrimaryButton> : null}
    </EmailShell>
  );
}
