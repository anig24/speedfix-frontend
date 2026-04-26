const privacySections = [
  {
    title: "Information we collect",
    body: [
      "We may collect your name, phone number, email address, service address, city, pincode, and booking details.",
      "If you use optional location features, city and pincode can also be used to improve service discovery and checkout.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "To process bookings, connect customers with service partners, and provide status updates.",
      "To improve pricing, category discovery, customer support, and service quality.",
    ],
  },
  {
    title: "Payments",
    body: [
      "Online payments are processed through Razorpay. SpeedFix does not store full card or bank credentials.",
      "Payment-related data is used only to confirm bookings, support refunds when applicable, and maintain transaction records.",
    ],
  },
  {
    title: "Third-party services",
    body: [
      "We rely on trusted services such as Firebase for app infrastructure and Razorpay for payment processing.",
      "These partners follow their own security and privacy practices for the services they provide.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You can request correction or deletion of personal data by reaching out to our support team.",
      "For privacy questions, contact support@speedfix.co.in.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f6efe4] text-slate-900">
      <section className="border-b border-slate-200/80">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Privacy policy
          </p>
          <h1 className="mt-4 display-font text-5xl text-slate-950 md:text-6xl">
            How SpeedFix handles customer information
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            This page explains what information we collect, why we use it, and
            how booking, checkout, and communication details are handled on the
            platform.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {privacySections.map((section) => (
            <article
              key={section.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card"
            >
              <h2 className="text-2xl font-semibold text-slate-950">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3">
                {section.body.map((item) => (
                  <p key={item} className="text-sm leading-7 text-slate-600">
                    {item}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white premium-card">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
            Contact
          </p>
          <p className="mt-3 text-base leading-8 text-slate-300">
            For privacy-related questions or requests, email{" "}
            <a
              href="mailto:support@speedfix.co.in"
              className="font-semibold text-white underline underline-offset-4"
            >
              support@speedfix.co.in
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
