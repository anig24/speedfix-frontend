import {
  BodyText,
  EmailHeading,
  EmailShell,
  InfoPanel,
  PrimaryButton,
} from "@/lib/templates/components";

export type ContactTemplateProps = {
  name: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  message: string;
};

export function ContactAdminEmail(props: ContactTemplateProps) {
  return (
    <EmailShell preview={`New contact request from ${props.name}`}>
      <EmailHeading>New contact form request</EmailHeading>
      <BodyText>A website visitor submitted the SpeedFix contact form.</BodyText>
      <InfoPanel
        items={[
          { label: "Name", value: props.name },
          { label: "Email", value: props.email },
          { label: "Phone", value: props.phone },
          { label: "Service", value: props.service },
          { label: "Location", value: props.location },
          { label: "Message", value: props.message },
        ]}
      />
    </EmailShell>
  );
}

export function ContactThankYouEmail({
  name,
  service,
  location,
}: Pick<ContactTemplateProps, "name" | "service" | "location">) {
  return (
    <EmailShell preview="We received your SpeedFix request">
      <EmailHeading>Thanks, {name}</EmailHeading>
      <BodyText>
        We received your request for {service} in {location}. A SpeedFix support
        specialist will review the details and get back to you soon.
      </BodyText>
      <InfoPanel
        items={[
          { label: "Next step", value: "Support review and callback" },
          { label: "Support", value: "+91-7439769525" },
        ]}
      />
      <PrimaryButton href="https://speedfix.co.in/services">Browse services</PrimaryButton>
    </EmailShell>
  );
}
