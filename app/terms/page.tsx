const termsSections = [
  {
    title: "Service use",
    body: [
      "SpeedFix helps customers discover and book service professionals across categories such as cleaning, electrical, plumbing, appliance care, and AC service.",
      "Category pages, subcategory pages, and package pricing are designed to guide booking decisions, but final job scope may still depend on the on-site assessment.",
    ],
  },
  {
    title: "Customer responsibilities",
    body: [
      "Customers should provide accurate contact, address, and booking details.",
      "Safe access to the property and respectful treatment of service professionals are required during every booking.",
    ],
  },
  {
    title: "Payments and coupons",
    body: [
      "Online payments are processed through Razorpay. Pay-after-service may be available for selected bookings.",
      "Coupons, including first-booking offers such as WELCOME30, may be subject to eligibility limits and may be changed or withdrawn.",
    ],
  },
  {
    title: "Cancellations and changes",
    body: [
      "Cancellation or refund outcomes may vary depending on booking stage, service type, and payment status.",
      "Rescheduling or changing a booking after confirmation can affect technician availability or pricing.",
    ],
  },
  {
    title: "Liability",
    body: [
      "SpeedFix operates as a platform and service coordination layer. We work to improve quality and issue resolution, but service outcomes can depend on site conditions and approved job scope.",
      "Where disputes arise, customers should contact support so the issue can be reviewed and handled.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="bg-[#f6efe4] text-slate-900">
      <section className="border-b border-slate-200/80">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Terms and conditions
          </p>
          <h1 className="mt-4 display-font text-5xl text-slate-950 md:text-6xl">
            The booking terms behind the SpeedFix experience
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            These terms explain how bookings, payments, promotions, and service
            responsibilities work across the SpeedFix platform.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {termsSections.map((section) => (
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
            Support
          </p>
          <p className="mt-3 text-base leading-8 text-slate-300">
            For legal or service-related support, reach out at{" "}
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
