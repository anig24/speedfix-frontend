"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, BadgeCheck, CalendarDays, Clock3, Star } from "lucide-react";
import { getServiceBySlug, ServiceCatalogItem } from "@/lib/serviceCatalog";

export default function ServicePage() {
  const params = useParams<{ slug: string }>();
  const service = getServiceBySlug(String(params.slug || ""));

  if (!service) {
    return (
      <div className="bg-[#f6efe4] px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <h1 className="text-3xl font-semibold text-slate-950">
            Service not found
          </h1>
          <p className="mt-4 text-slate-600">
            That service slug does not exist in the shared catalog yet.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return <ServiceDetailView key={service.slug} service={service} />;
}

function ServiceDetailView({ service }: { service: ServiceCatalogItem }) {
  const router = useRouter();
  const [selectedPackageName, setSelectedPackageName] = useState(
    service.packages[1]?.name || service.packages[0].name
  );
  const [addons, setAddons] = useState<string[]>([]);

  const selectedPackage =
    service.packages.find((item) => item.name === selectedPackageName) ||
    service.packages[0];

  const toggleAddon = (addon: string) => {
    setAddons((current) =>
      current.includes(addon)
        ? current.filter((item) => item !== addon)
        : [...current, addon]
    );
  };

  const total =
    selectedPackage.price +
    service.addons
      .filter((addon) => addons.includes(addon.name))
      .reduce((sum, addon) => sum + addon.price, 0);

  return (
    <div className="bg-[#f6efe4] text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              {service.name}
            </p>
            <h1 className="display-font text-5xl leading-tight text-slate-950">
              {service.tagline}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              {service.description}
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2">
                <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                {service.rating}
              </span>
              <span className="rounded-full bg-white px-4 py-2">
                {service.reviews}
              </span>
              <span className="rounded-full bg-white px-4 py-2">
                {service.jobsCompleted}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
                <Clock3 className="h-4 w-4 text-orange-500" />
                {service.responseTime}
              </span>
            </div>

            <div className="relative h-[22rem] overflow-hidden rounded-[2rem]">
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-slate-950">
                  Common problems solved
                </h2>
                <div className="mt-4 space-y-3">
                  {service.problemsSolved.map((problem) => (
                    <div
                      key={problem}
                      className="flex items-start gap-2 text-sm leading-7 text-slate-600"
                    >
                      <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                      {problem}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-slate-950">
                  Why customers book this
                </h2>
                <div className="mt-4 space-y-3">
                  {service.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-2 text-sm leading-7 text-slate-600"
                    >
                      <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Packages
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    Pick the right visit type
                  </h2>
                </div>
                <div className="rounded-full bg-[#fff5ea] px-4 py-2 text-sm font-medium text-orange-600">
                  Starts at Rs. {service.basePrice}
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {service.packages.map((pkg) => (
                  <button
                    key={pkg.name}
                    type="button"
                    onClick={() => setSelectedPackageName(pkg.name)}
                    className={`w-full rounded-[1.6rem] border p-5 text-left transition ${
                      selectedPackage.name === pkg.name
                        ? "border-slate-900 bg-slate-950 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold">{pkg.name}</h3>
                        <p className="mt-2 text-sm leading-7 opacity-80">
                          {pkg.description}
                        </p>
                      </div>
                      <p className="rounded-full bg-white/15 px-3 py-2 text-sm font-medium">
                        Rs. {pkg.price}
                      </p>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm opacity-80">
                      <CalendarDays className="h-4 w-4" />
                      {pkg.turnaround}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
              <h2 className="text-2xl font-semibold text-slate-950">
                Add-ons
              </h2>
              <div className="mt-5 space-y-3">
                {service.addons.map((addon) => (
                  <button
                    key={addon.name}
                    type="button"
                    onClick={() => toggleAddon(addon.name)}
                    className={`flex w-full items-center justify-between rounded-[1.4rem] border px-4 py-4 text-left transition ${
                      addons.includes(addon.name)
                        ? "border-slate-900 bg-slate-950 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-sm font-medium">{addon.name}</span>
                    <span className="text-sm">Rs. {addon.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
              <h2 className="text-2xl font-semibold">Booking summary</h2>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <p>Package: {selectedPackage.name}</p>
                <p>Add-ons selected: {addons.length}</p>
                <p>Coverage: {service.coverage}</p>
                <p>Expected turnaround: {selectedPackage.turnaround}</p>
              </div>

              <div className="mt-6 rounded-[1.5rem] bg-white/5 p-4">
                <p className="text-sm text-slate-300">Estimated total</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  Rs. {total}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/checkout?service=${encodeURIComponent(
                      service.slug
                    )}&total=${total}`
                  )
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Continue to checkout
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/#lead-form"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-4 text-sm font-semibold text-white transition hover:border-white/30"
              >
                Use quick request instead
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
