import { BodyText, EmailHeading, EmailShell, InfoItem, InfoPanel } from "@/lib/templates/components";

export type AdminNotificationEmailProps = {
  title: string;
  summary?: string;
  items: InfoItem[];
};

export function AdminNotificationEmail({
  title,
  summary = "A SpeedFix operations event needs review.",
  items,
}: AdminNotificationEmailProps) {
  return (
    <EmailShell preview={title}>
      <EmailHeading>{title}</EmailHeading>
      <BodyText>{summary}</BodyText>
      <InfoPanel items={items} />
    </EmailShell>
  );
}
