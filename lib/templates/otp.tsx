import { BodyText, EmailHeading, EmailShell, InfoPanel } from "@/lib/templates/components";

export type OtpEmailProps = {
  otp: string;
  purpose?: string;
  expiresInMinutes?: number;
};

export function OtpEmail({
  otp,
  purpose = "verification",
  expiresInMinutes = 10,
}: OtpEmailProps) {
  return (
    <EmailShell preview={`Your SpeedFix OTP is ${otp}`}>
      <EmailHeading>Your verification code</EmailHeading>
      <BodyText>
        Use this code to complete your SpeedFix {purpose}. Do not share it with
        anyone from support or operations.
      </BodyText>
      <InfoPanel
        items={[
          { label: "OTP", value: otp },
          { label: "Expires in", value: `${expiresInMinutes} minutes` },
        ]}
      />
    </EmailShell>
  );
}
