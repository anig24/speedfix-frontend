import {
  BodyText,
  EmailHeading,
  EmailShell,
  InfoPanel,
  PrimaryButton,
} from "@/lib/templates/components";

export type PasswordResetEmailProps = {
  resetUrl: string;
  expiresInMinutes?: number;
};

export function PasswordResetEmail({
  resetUrl,
  expiresInMinutes = 30,
}: PasswordResetEmailProps) {
  return (
    <EmailShell preview="Reset your SpeedFix password">
      <EmailHeading>Reset your password</EmailHeading>
      <BodyText>
        We received a request to reset your SpeedFix password. Use the secure
        link below to continue.
      </BodyText>
      <InfoPanel
        items={[
          { label: "Link expiry", value: `${expiresInMinutes} minutes` },
          { label: "Security note", value: "Ignore this email if you did not request a reset." },
        ]}
      />
      <PrimaryButton href={resetUrl}>Reset password</PrimaryButton>
    </EmailShell>
  );
}
