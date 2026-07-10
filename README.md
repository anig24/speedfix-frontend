This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Create `.env.local` with the app secrets. Customer chat is handled by the
Tawk.to widget configured in `app/components/TawkChatWidget.tsx`.

## SpeedFix Email Infrastructure

Outbound email is handled through Resend with React Email templates, Prisma
logging, rate-limited public routes, and mock-mode development fallbacks.

Folder structure:

```text
lib/
  email.ts
  email-config.ts
  email-pdf.ts
  email-security.ts
  email-validation.ts
  prisma.ts
  resend.ts
  templates/
app/api/email/
  contact
  booking
  otp
  password-reset
  invoice
  quotation
  test
  retry
  webhook
  inbound
  preferences
prisma/
  schema.prisma
prisma.config.ts
```

Environment variables are listed in `.env.example`. At minimum, production needs
`DATABASE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL`,
`SUPPORT_EMAIL`, `BOOKING_EMAIL`, `SALES_EMAIL`, `SPEEDFIX_EMAIL_API_KEY`, and
`EMAIL_TOKEN_SECRET`. `EMAIL_MOCK_MODE=true` or a missing Resend key causes
emails to log to the console in development.

Prisma setup:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name email-infrastructure
```

Email endpoints:

```text
POST /api/email/contact
POST /api/email/booking
POST /api/email/otp
POST /api/email/password-reset
POST /api/email/invoice
POST /api/email/quotation
GET/POST /api/email/test
POST /api/email/retry
POST /api/email/webhook
POST /api/email/inbound
POST /api/email/preferences
```

Internal endpoints require `x-speedfix-email-key: SPEEDFIX_EMAIL_API_KEY` in
production. Public contact, OTP, password reset, and preference routes use Zod
validation plus in-memory rate limiting. Contact submissions are saved to
PostgreSQL when `DATABASE_URL` is configured, then sent to admins and acknowledged
to the customer.

Booking emails are wired into the existing booking APIs. Checkout now captures a
customer email so SpeedFix can send confirmation emails; admins are notified even
when a legacy booking payload does not include customer email.

Testing:

```bash
npm run lint
npm run build
curl -X GET http://localhost:3000/api/email/test \
  -H "x-speedfix-email-key: $SPEEDFIX_EMAIL_API_KEY"
curl -X POST http://localhost:3000/api/email/test \
  -H "content-type: application/json" \
  -H "x-speedfix-email-key: $SPEEDFIX_EMAIL_API_KEY" \
  -d '{"to":"you@example.com","type":"welcome"}'
```

Production checklist:

- Verify `speedfix.co.in` as the Resend sending domain and keep SPF, DKIM, and
  DMARC passing.
- Set all email secrets in Vercel project environment variables.
- Run the Prisma migration against PostgreSQL before enabling live sends.
- Configure Resend delivery/open/click/bounce webhooks to
  `/api/email/webhook`.
- Configure inbound email webhooks to `/api/email/inbound` if Resend inbound is
  available.
- Schedule retries by calling `/api/email/retry` with `x-cron-secret:
  EMAIL_RETRY_CRON_SECRET` or `x-speedfix-email-key`.
- Keep `EMAIL_MOCK_MODE=false` in production and never expose Resend keys in
  client code.

Inbound email note: if Resend inbound cannot be used because existing MX records
are required for mailboxes, use Cloudflare Email Routing, Zoho Mail, or Google
Workspace for receiving mail while continuing to use Resend for outbound
transactional email.

## Tawk.to Automation

Use these values in the Tawk.to OpenAPI Server popup after the site is deployed:

```text
Schema File URL: https://www.speedfix.co.in/tawk-openapi.json
API base URL: https://www.speedfix.co.in
Authentication method: No Auth
```

The schema exposes public service search, service detail, operating cities,
pincode lookup, booking guidance, and service request lead creation.
Use the `www` domain for both fields. The non-`www` domain redirects, and some
OpenAPI importers do not follow that redirect while validating the schema.

## Management Backend

Internal work and employee management now runs through Next.js API routes:

```text
GET/POST /api/management/work
GET/PATCH/DELETE /api/management/work/:workId
GET/POST /api/management/employees
GET/PATCH/DELETE /api/management/employees/:employeeId
```

Work items are stored in `corporateWorkflowItems`; employee access profiles are
stored in `users`, with audit entries in `managementAuditLog` and
`employeeAccessLog`. Set `SPEEDFIX_MANAGEMENT_API_KEY` in production if these
routes should also accept server-to-server calls through the
`x-speedfix-management-key` header. Browser calls send the signed-in Firebase ID
token and are checked against the employee role stored in `users`.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
