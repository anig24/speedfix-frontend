import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { CSSProperties, ReactNode } from "react";

const baseUrl = "https://speedfix.co.in";

const styles: Record<string, CSSProperties> = {
  body: {
    margin: 0,
    backgroundColor: "#f6f7fb",
    color: "#172033",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "640px",
    margin: "0 auto",
    padding: "24px 12px",
  },
  card: {
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    backgroundColor: "#ffffff",
  },
  header: {
    padding: "28px 32px 18px",
    backgroundColor: "#111827",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
  },
  brand: {
    margin: 0,
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: "0",
  },
  tagline: {
    margin: "8px 0 0",
    color: "#cbd5e1",
    fontSize: "13px",
    lineHeight: "20px",
  },
  content: {
    padding: "32px",
  },
  heading: {
    margin: "0 0 12px",
    color: "#111827",
    fontSize: "28px",
    lineHeight: "34px",
    fontWeight: 800,
    letterSpacing: "0",
  },
  text: {
    margin: "0 0 16px",
    color: "#475569",
    fontSize: "15px",
    lineHeight: "24px",
  },
  panel: {
    margin: "22px 0",
    padding: "18px",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
  },
  label: {
    margin: "0 0 4px",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  value: {
    margin: "0 0 14px",
    color: "#111827",
    fontSize: "15px",
    lineHeight: "22px",
    fontWeight: 600,
  },
  footer: {
    padding: "24px 32px 30px",
    backgroundColor: "#f8fafc",
  },
  footerText: {
    margin: "0 0 8px",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "18px",
  },
  social: {
    display: "inline-block",
    marginRight: "8px",
    padding: "7px 9px",
    borderRadius: "999px",
    backgroundColor: "#111827",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: 700,
    textDecoration: "none",
  },
  button: {
    display: "inline-block",
    borderRadius: "999px",
    backgroundColor: "#f97316",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 800,
    lineHeight: "20px",
    padding: "13px 20px",
    textDecoration: "none",
  },
  secondaryButton: {
    display: "inline-block",
    marginLeft: "8px",
    border: "1px solid #cbd5e1",
    borderRadius: "999px",
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    fontWeight: 800,
    lineHeight: "20px",
    padding: "12px 18px",
    textDecoration: "none",
  },
};

export type InfoItem = {
  label: string;
  value?: string | number | null;
};

export function formatMoney(amount?: number | null, currency = "INR") {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return null;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function EmailShell({
  preview,
  children,
}: {
  preview: string;
  children: ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.card}>
            <Section style={styles.header}>
              <div style={styles.brandRow}>
                <Img
                  src={`${baseUrl}/icon.png`}
                  alt="SpeedFix"
                  width="42"
                  height="42"
                  style={styles.logo}
                />
                <div>
                  <Text style={styles.brand}>SpeedFix</Text>
                  <Text style={styles.tagline}>
                    Fast, managed home services across Indian metro zones.
                  </Text>
                </div>
              </div>
            </Section>
            <Section style={styles.content}>{children}</Section>
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                SpeedFix Support: +91-7439769525 | support@speedfix.co.in
              </Text>
              <Text style={styles.footerText}>
                SpeedFix, Kolkata, India. You are receiving this transactional
                email because you used SpeedFix.
              </Text>
              <div>
                <Link href="https://www.instagram.com/speedfix" style={styles.social}>
                  IG
                </Link>
                <Link href="https://www.linkedin.com/company/speedfix" style={styles.social}>
                  in
                </Link>
                <Link href="https://speedfix.co.in/contact" style={styles.social}>
                  Help
                </Link>
              </div>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function EmailHeading({ children }: { children: ReactNode }) {
  return <Heading style={styles.heading}>{children}</Heading>;
}

export function BodyText({ children }: { children: ReactNode }) {
  return <Text style={styles.text}>{children}</Text>;
}

export function InfoPanel({ items }: { items: InfoItem[] }) {
  const visibleItems = items.filter(
    (item) => item.value !== undefined && item.value !== null && item.value !== ""
  );

  return (
    <Section style={styles.panel}>
      {visibleItems.map((item) => (
        <div key={item.label}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </div>
      ))}
    </Section>
  );
}

export function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Button href={href} style={styles.button}>
      {children}
    </Button>
  );
}

export function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Button href={href} style={styles.secondaryButton}>
      {children}
    </Button>
  );
}

export function Divider() {
  return <Hr style={{ borderColor: "#e2e8f0", margin: "24px 0" }} />;
}
