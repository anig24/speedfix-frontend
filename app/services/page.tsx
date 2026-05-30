"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { serviceCatalog } from "@/lib/serviceCatalog";

type ServiceGridItem = {
  title: string;
  href: string;
  image: string;
};

const illustrationBySlug: Record<string, string> = {
  cleaning: "/services/cleaning.png",
  electrician: "/services/electrician.png",
  plumbing: "/services/plumbing.png",
  "ac-service": "/services/ac-service.png",
  "appliance-repair": "/services/appliance-repair.png",
  "fan-installation": "/services/fan-installation.png",
  "water-purifier": "/services/plumbing.png",
  "packers-movers": "/services/appliance-repair.png",
  "laundry-dry-cleaning": "/services/appliance-repair.png",
  "appliance-installation": "/services/appliance-repair.png",
};

const featuredServices: ServiceGridItem[] = [
  {
    title: "Home Cleaning",
    href: "/services/cleaning",
    image: "/services/cleaning.png",
  },
  {
    title: "Bathroom Cleaning",
    href: "/services/cleaning/bathroom-deep-cleaning",
    image: "/services/cleaning.png",
  },
  {
    title: "Laundry",
    href: "/services/laundry-dry-cleaning",
    image: "/services/appliance-repair.png",
  },
  {
    title: "Fan Cleaning",
    href: "/services/fan-installation",
    image: "/services/fan-installation.png",
  },
  {
    title: "Kitchen Cleaning",
    href: "/services/cleaning/kitchen-deep-cleaning",
    image: "/services/cleaning.png",
  },
  {
    title: "Packing & Unpacking",
    href: "/services/packers-movers",
    image: "/services/appliance-repair.png",
  },
  {
    title: "All Services",
    href: "/services",
    image: "/services/ac-service.png",
  },
];

const catalogServices: ServiceGridItem[] = serviceCatalog
  .filter(
    (service) =>
      !new Set([
        "cleaning",
        "fan-installation",
        "packers-movers",
        "laundry-dry-cleaning",
      ]).has(service.slug)
  )
  .map((service) => ({
    title: service.name,
    href: `/services/${service.slug}`,
    image:
      illustrationBySlug[service.slug] ||
      (service.slug.includes("plumbing") || service.slug.includes("purifier")
        ? "/services/plumbing.png"
        : service.slug.includes("electric") ||
            service.slug.includes("cctv") ||
            service.slug.includes("smart") ||
            service.slug.includes("inverter")
          ? "/services/electrician.png"
          : service.slug.includes("ac") || service.slug.includes("appliance")
            ? "/services/ac-service.png"
            : "/services/cleaning.png"),
  }));

const serviceGrid = [...featuredServices, ...catalogServices];

export default function ServicesPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const visibleServices = useMemo(() => {
    if (!deferredQuery) {
      return serviceGrid;
    }

    return serviceGrid.filter((service) =>
      service.title.toLowerCase().includes(deferredQuery)
    );
  }, [deferredQuery]);

  return (
    <main className="bg-white text-[#07111F]">
      <section className="border-b border-[#EAEAEA] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#FF6A00]">
            SpeedFix services
          </p>
          <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="text-4xl font-black leading-tight md:text-5xl">
                Choose the work you need.
              </h1>
              <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-600">
                Clean service cards for booking home help, repairs,
                maintenance, pickup, and installations.
              </p>
            </div>
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search services"
                className="h-12 w-full rounded-full border border-[#EAEAEA] bg-[#F7F7F7] pl-11 pr-4 text-sm font-bold outline-none transition focus:border-[#FF6A00] focus:bg-white"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <div
          id="all-services"
          className="grid justify-center gap-4 sm:justify-start"
          style={{
            gridTemplateColumns: "repeat(auto-fit, 180px)",
          }}
        >
          {visibleServices.map((service) => (
            <ServiceCard key={`${service.title}-${service.href}`} service={service} />
          ))}
        </div>

        {!visibleServices.length && (
          <div className="mt-8 rounded-[24px] border border-[#EAEAEA] bg-[#F7F7F7] p-8 text-center">
            <h2 className="text-2xl font-black">No service found</h2>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              Try searching cleaning, fan, laundry, AC, or plumbing.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function ServiceCard({ service }: { service: ServiceGridItem }) {
  return (
    <Link
      href={service.href}
      className="group relative h-[180px] w-[180px] overflow-hidden rounded-[24px] border border-[#EAEAEA] bg-[#F7F7F7] p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(7,17,31,0.10)]"
    >
      <div className="flex h-[112px] items-center justify-center rounded-[18px] bg-white/45">
        <Image
          src={service.image}
          alt={service.title}
          width={112}
          height={112}
          className="h-[104px] w-[104px] object-contain transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
        <h2 className="max-w-[118px] text-[15px] font-black leading-tight text-[#07111F]">
          {service.title}
        </h2>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#07111F] shadow-sm transition duration-300 group-hover:bg-[#07111F] group-hover:text-white">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
