import {
  BodyText,
  EmailHeading,
  EmailShell,
  formatMoney,
  InfoPanel,
  PrimaryButton,
  SecondaryButton,
} from "@/lib/templates/components";

export type QuotationLineItem = {
  service: string;
  price: number;
};

export type QuotationEmailProps = {
  customerName?: string;
  quotationId: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  discount?: number;
  total: number;
  validUntil: string;
  approveUrl: string;
  rejectUrl: string;
};

export function QuotationEmail({
  customerName = "there",
  quotationId,
  lineItems,
  subtotal,
  discount = 0,
  total,
  validUntil,
  approveUrl,
  rejectUrl,
}: QuotationEmailProps) {
  return (
    <EmailShell preview={`Quotation ${quotationId} from SpeedFix`}>
      <EmailHeading>Your service estimate is ready</EmailHeading>
      <BodyText>
        Hi {customerName}, please review the SpeedFix estimate below. You can
        approve or reject it directly from this email.
      </BodyText>
      <InfoPanel
        items={[
          { label: "Quotation ID", value: quotationId },
          { label: "Services", value: lineItems.map((item) => `${item.service}: ${formatMoney(item.price)}`).join(", ") },
          { label: "Subtotal", value: formatMoney(subtotal) },
          { label: "Discount", value: formatMoney(discount) },
          { label: "Total", value: formatMoney(total) },
          { label: "Valid until", value: validUntil },
        ]}
      />
      <PrimaryButton href={approveUrl}>Approve quotation</PrimaryButton>
      <SecondaryButton href={rejectUrl}>Reject</SecondaryButton>
    </EmailShell>
  );
}
