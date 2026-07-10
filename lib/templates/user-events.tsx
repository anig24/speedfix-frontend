import { BodyText, EmailHeading, EmailShell, InfoItem, InfoPanel } from "@/lib/templates/components";

export type UserEventEmailProps = {
  title: string;
  summary: string;
  items: InfoItem[];
};

export function NewUserRegisteredEmail(props: UserEventEmailProps) {
  return (
    <EmailShell preview={props.title}>
      <EmailHeading>{props.title}</EmailHeading>
      <BodyText>{props.summary}</BodyText>
      <InfoPanel items={props.items} />
    </EmailShell>
  );
}

export function NewServiceRequestEmail(props: UserEventEmailProps) {
  return (
    <EmailShell preview={props.title}>
      <EmailHeading>{props.title}</EmailHeading>
      <BodyText>{props.summary}</BodyText>
      <InfoPanel items={props.items} />
    </EmailShell>
  );
}
