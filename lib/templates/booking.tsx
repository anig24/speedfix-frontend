import {
  BodyText,
  EmailHeading,
  EmailShell,
  formatMoney,
  InfoPanel,
  PrimaryButton,
} from "@/lib/templates/components";

export type BookingEmailProps = {
  customerName?: string;
  bookingId: string;
  service: string;
  date?: string;
  time?: string;
  address?: string;
  assignedTechnician?: string | null;
  priceEstimate?: number | null;
  supportPhone?: string;
  trackingUrl?: string;
};

export function BookingConfirmationEmail({
  customerName = "there",
  bookingId,
  service,
  date,
  time,
  address,
  assignedTechnician,
  priceEstimate,
  supportPhone = "+91-7439769525",
  trackingUrl = "https://speedfix.co.in/track",
}: BookingEmailProps) {
  return (
    <EmailShell preview={`Booking ${bookingId} confirmed`}>
      <EmailHeading>Your booking is confirmed</EmailHeading>
      <BodyText>
        Hi {customerName}, we have received your SpeedFix booking and our
        operations team is coordinating the technician assignment.
      </BodyText>
      <InfoPanel
        items={[
          { label: "Booking ID", value: bookingId },
          { label: "Service", value: service },
          { label: "Date", value: date },
          { label: "Time", value: time },
          { label: "Address", value: address },
          { label: "Assigned technician", value: assignedTechnician || "Assignment in progress" },
          { label: "Price estimate", value: formatMoney(priceEstimate) },
          { label: "Support number", value: supportPhone },
        ]}
      />
      <PrimaryButton href={trackingUrl}>Track booking</PrimaryButton>
    </EmailShell>
  );
}

export function BookingReminderEmail({
  customerName = "there",
  bookingId,
  service,
  date,
  time,
  assignedTechnician,
  trackingUrl = "https://speedfix.co.in/track",
}: BookingEmailProps) {
  return (
    <EmailShell preview={`Reminder for booking ${bookingId}`}>
      <EmailHeading>Your SpeedFix visit is coming up</EmailHeading>
      <BodyText>
        Hi {customerName}, this is a quick reminder for your upcoming {service}
        booking.
      </BodyText>
      <InfoPanel
        items={[
          { label: "Booking ID", value: bookingId },
          { label: "Date", value: date },
          { label: "Time", value: time },
          { label: "Technician", value: assignedTechnician || "Assignment in progress" },
        ]}
      />
      <PrimaryButton href={trackingUrl}>View booking</PrimaryButton>
    </EmailShell>
  );
}
