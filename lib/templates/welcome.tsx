import {
  BodyText,
  EmailHeading,
  EmailShell,
  InfoPanel,
  PrimaryButton,
} from "@/lib/templates/components";

export type WelcomeEmailProps = {
  name?: string;
  dashboardUrl?: string;
};

export function WelcomeEmail({ name = "there", dashboardUrl = "https://speedfix.co.in/customer" }: WelcomeEmailProps) {
  return (
    <EmailShell preview="Welcome to SpeedFix">
      <EmailHeading>Welcome to SpeedFix, {name}</EmailHeading>
      <BodyText>
        Your SpeedFix account is ready. You can book services, track technicians,
        manage invoices, and reach support from one place.
      </BodyText>
      <InfoPanel
        items={[
          { label: "Support", value: "+91-7439769525" },
          { label: "Website", value: "speedfix.co.in" },
        ]}
      />
      <PrimaryButton href={dashboardUrl}>Open dashboard</PrimaryButton>
    </EmailShell>
  );
}
