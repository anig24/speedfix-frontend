import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { operatingCities } from "@/lib/serviceCatalog";

const contactCards = [
  {
    title: "Customer support",
    value: "support@speedfix.co.in",
    href: "mailto:support@speedfix.co.in",
    icon: Mail,
  },
  {
    title: "Phone",
    value: "+91-7439769525",
    href: "tel:+917439769525",
    icon: Phone,
  },
  {
    title: "Service coverage",
    value: "Major metro service zones",
    href: "/services",
    icon: MapPin,
  },
];

export default function ContactPage() {
  return (
    <div className="bg-[#f6efe4] text-slate-900">
      <section className="border-b border-slate-200/80">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Contact
          </p>
          <h1 className="mt-4 display-font text-5xl text-slate-950 md:text-6xl">
            Talk to SpeedFix support, service, or booking teams
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            Use the contact options below for service help, booking questions,
            pricing clarifications, or customer support follow-ups.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {contactCards.map(({ title, value, href, icon: Icon }) => (
            <a
              key={title}
              href={href}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card transition hover:-translate-y-1"
            >
              <div className="inline-flex rounded-2xl bg-[#fff2df] p-3 text-orange-500">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-slate-950">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{value}</p>
            </a>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 premium-card">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Operating cities
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {operatingCities.map((city) => (
                <span
                  key={city}
                  className="rounded-full bg-[#fff2df] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white premium-card">
            <div className="inline-flex rounded-2xl bg-white/10 p-3 text-orange-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold">Need to book now?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Browse services, select the right subcategory, add to cart, and
              complete checkout with address and payment.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Browse services
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30"
              >
                View cart
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
