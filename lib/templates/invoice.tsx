import {
  BodyText,
  EmailHeading,
  EmailShell,
  formatMoney,
  InfoPanel,
  PrimaryButton,
} from "@/lib/templates/components";

export type InvoiceEmailProps = {
  customerName?: string;
  invoiceNumber: string;
  total: number;
  tax?: number;
  gstNumber?: string;
  paymentLink?: string;
  currency?: string;
};

export function InvoiceEmail({
  customerName = "there",
  invoiceNumber,
  total,
  tax,
  gstNumber,
  paymentLink = "https://speedfix.co.in/customer",
  currency = "INR",
}: InvoiceEmailProps) {
  return (
    <EmailShell preview={`Invoice ${invoiceNumber} from SpeedFix`}>
      <EmailHeading>Your SpeedFix invoice is ready</EmailHeading>
      <BodyText>
        Hi {customerName}, your invoice is attached as a PDF. You can also use
        the payment link below if any amount is pending.
      </BodyText>
      <InfoPanel
        items={[
          { label: "Invoice number", value: invoiceNumber },
          { label: "GST details", value: gstNumber },
          { label: "Tax", value: formatMoney(tax, currency) },
          { label: "Total", value: formatMoney(total, currency) },
        ]}
      />
      <PrimaryButton href={paymentLink}>Open payment link</PrimaryButton>
    </EmailShell>
  );
}
