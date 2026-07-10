import {
  BodyText,
  EmailHeading,
  EmailShell,
  InfoPanel,
  PrimaryButton,
} from "@/lib/templates/components";

export type ReviewRequestEmailProps = {
  customerName?: string;
  bookingId: string;
  service?: string;
  reviewUrl: string;
};

export function ReviewRequestEmail({
  customerName = "there",
  bookingId,
  service,
  reviewUrl,
}: ReviewRequestEmailProps) {
  return (
    <EmailShell preview="How was your SpeedFix service?">
      <EmailHeading>How did we do?</EmailHeading>
      <BodyText>
        Hi {customerName}, your feedback helps us keep SpeedFix service quality
        high and route technicians better.
      </BodyText>
      <InfoPanel
        items={[
          { label: "Booking ID", value: bookingId },
          { label: "Service", value: service },
        ]}
      />
      <PrimaryButton href={reviewUrl}>Leave a review</PrimaryButton>
    </EmailShell>
  );
}
