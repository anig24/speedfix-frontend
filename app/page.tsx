"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  CalendarDays,
  ChevronRight,
  LocateFixed,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import {
  type ReactNode,
  useDeferredValue,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import LocationGate from "@/app/components/LocationGate";
import { getFeaturedSubcategories } from "@/lib/serviceCatalog";
import { readStoredCity, subscribeToStoredCity } from "@/lib/locationStorage";

type TaskCard = {
  title: string;
  href: string;
  image: string;
  position: string;
  status: string;
};

const taskCards: TaskCard[] = [
  {
    title: "Kitchen Cleaning",
    href: "/services/cleaning",
    image: "/services/speedfix-cleaning-kitchen.png",
    position: "center 34%",
    status: "Kitchen reset",
  },
  {
    title: "Electrician",
    href: "/services/electrician",
    image: "/services/speedfix-electrician-switch.png",
    position: "center 34%",
    status: "Switch check",
  },
  {
    title: "Plumbing",
    href: "/services/plumbing",
    image: "/services/speedfix-plumbing-sink.png",
    position: "center 42%",
    status: "Leak repair",
  },
  {
    title: "AC Service",
    href: "/services/ac-service",
    image: "/services/speedfix-ac-service.png",
    position: "center 38%",
    status: "Cooling tune-up",
  },
  {
    title: "Appliance Repair",
    href: "/services/appliance-repair",
    image: "/services/speedfix-appliance-repair.png",
    position: "center 35%",
    status: "Machine test",
  },
  {
    title: "TV Setup",
    href: "/services/appliance-installation",
    image: "/services/speedfix-tv-installation.png",
    position: "center 36%",
    status: "Home setup",
  },
];

const trustPills: Array<{ label: string; icon: LucideIcon }> = [
  { label: "Top rated experts", icon: Star },
  { label: "Verified workers", icon: ShieldCheck },
  { label: "Professional training", icon: UserCheck },
];

const cityCoverage = [
  {
    city: "Bengaluru",
    areas: 27,
    image: "/cities/bangalore.png",
    neighborhoods: [
      "Bellandur",
      "Koramangala",
      "Brookefield",
      "Indiranagar",
      "BTM Layout",
      "Hebbal",
      "HSR Layout",
      "Whitefield",
      "Hoodi",
      "Electronic City",
      "Yelahanka",
      "Sarjapura",
      "Marathahalli",
      "Hulimavu",
      "Kudlu",
      "Mahadevapura",
      "Mahalakshmi Layout",
      "Munnekollal",
      "Nagasandra",
      "Raysandra",
      "Seegahalli",
      "Singasandra",
      "Tejaswini Nagar",
      "Thanisandra",
      "Varthur",
      "Yeshwanthpur",
      "Banashankari",
    ],
  },
  {
    city: "Kolkata",
    areas: 12,
    image: "/cities/kolkata.png",
    neighborhoods: [
      "Salt Lake",
      "New Town",
      "Park Street",
      "Ballygunge",
      "Alipore",
      "Tollygunge",
      "Dum Dum",
      "Howrah",
      "Behala",
      "Rajarhat",
      "Garia",
      "Jadavpur",
    ],
  },
  {
    city: "Mumbai",
    areas: 24,
    image: "/cities/mumbai.png",
    neighborhoods: [
      "Andheri",
      "Bandra",
      "Powai",
      "Chembur",
      "Dadar",
      "Worli",
      "Borivali",
      "Malad",
      "Thane",
      "Navi Mumbai",
      "Goregaon",
      "Ghatkopar",
      "Mulund",
      "Juhu",
      "Colaba",
      "Lower Parel",
      "Vikhroli",
      "Kandivali",
      "Santacruz",
      "Versova",
      "Mira Road",
      "Bhayandar",
      "Khar",
      "Sion",
    ],
  },
  {
    city: "Delhi NCR",
    areas: 18,
    image: "/cities/delhi.png",
    neighborhoods: [
      "South Delhi",
      "Dwarka",
      "Rohini",
      "Janakpuri",
      "Noida",
      "Gurugram",
      "Ghaziabad",
      "Faridabad",
      "Greater Noida",
      "Indirapuram",
      "Saket",
      "Vasant Kunj",
      "Karol Bagh",
      "Lajpat Nagar",
      "Mayur Vihar",
      "Pitampura",
      "Preet Vihar",
      "Rajouri Garden",
    ],
  },
  {
    city: "Hyderabad",
    areas: 16,
    image: "/cities/hyderabad.png",
    neighborhoods: [
      "HITEC City",
      "Gachibowli",
      "Madhapur",
      "Kondapur",
      "Jubilee Hills",
      "Banjara Hills",
      "Kukatpally",
      "Miyapur",
      "Begumpet",
      "Secunderabad",
      "Manikonda",
      "Kompally",
      "Nallagandla",
      "Ameerpet",
      "Uppal",
      "Attapur",
    ],
  },
  {
    city: "Chennai",
    areas: 14,
    image: "/cities/chennai.png",
    neighborhoods: [
      "Adyar",
      "Anna Nagar",
      "T Nagar",
      "Velachery",
      "OMR",
      "Porur",
      "Tambaram",
      "Nungambakkam",
      "Mylapore",
      "Guindy",
      "Chromepet",
      "Sholinganallur",
      "Perungudi",
      "Medavakkam",
    ],
  },
];

const steps: Array<{ title: string; text: string; icon: LucideIcon }> = [
  {
    title: "Choose a service",
    text: "Pick the work you need from clear home-service cards.",
    icon: Sparkles,
  },
  {
    title: "Select time and address",
    text: "Add your home location and choose a comfortable slot.",
    icon: CalendarDays,
  },
  {
    title: "Track every update",
    text: "Follow worker, rider, payment, and support status in one place.",
    icon: LocateFixed,
  },
];

export default function HomePage() {
  const city = useSyncExternalStore(subscribeToStoredCity, readStoredCity, () => "");
  const [query, setQuery] = useState("");
  const [showLocationGate, setShowLocationGate] = useState(false);
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [showAllAreas, setShowAllAreas] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const featuredTasks = getFeaturedSubcategories(6);
  const selectedCoverage = cityCoverage[selectedCityIndex] || cityCoverage[0];
  const visibleAreas = showAllAreas
    ? selectedCoverage.neighborhoods
    : selectedCoverage.neighborhoods.slice(0, 12);

  const selectCoverageCity = (index: number) => {
    setSelectedCityIndex(index);
    setShowAllAreas(false);
  };

  const searchHref = useMemo(() => {
    return deferredQuery ? `/services?search=${encodeURIComponent(query)}` : "/services";
  }, [deferredQuery, query]);

  return (
    <main className="bg-white text-[#07111F]">
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/20 bg-[#FF6A00]/10 px-4 py-2 text-sm font-extrabold text-[#07111F]">
              <Sparkles className="h-4 w-4 text-[#FF6A00]" />
              SpeedFix home services in {city || "your city"}
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
              One house help expert, <span className="text-[#FF6A00]">to do it all</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              Book trained SpeedFix professionals for cleaning, repairs,
              maintenance, installations, and bike pickup.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {trustPills.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-[#07111F] shadow-sm"
                >
                  <Icon className="h-4 w-4 text-[#FF6A00]" />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-7 max-w-2xl rounded-[1.5rem] border border-slate-200 bg-white p-2.5 shadow-[0_18px_50px_rgba(7,17,31,0.08)]">
              <div className="grid gap-2.5 md:grid-cols-[auto_minmax(0,1fr)_auto]">
                <button
                  type="button"
                  onClick={() => setShowLocationGate(true)}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-extrabold text-[#07111F]"
                >
                  <MapPin className="h-4 w-4 text-[#FF6A00]" />
                  {city || "Bengaluru"}
                </button>
                <label className="relative block">
                  <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search cleaning, plumber, AC repair..."
                    className="h-14 w-full rounded-full border border-slate-200 bg-slate-50 pl-12 pr-5 text-sm font-bold text-[#07111F] outline-none transition focus:border-[#FF6A00] focus:bg-white"
                  />
                </label>
                <Link
                  href={searchHref}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#FF6A00] px-6 text-sm font-black text-white shadow-[0_14px_30px_rgba(255,106,0,0.18)] transition hover:bg-[#07111F]"
                >
                  Book now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_22px_70px_rgba(7,17,31,0.1)]">
            <div className="relative h-[340px] md:h-[460px]">
              <Image
                src="/hero.png"
                alt="SpeedFix professionals ready for home service"
                fill
                priority
                sizes="(min-width: 1024px) 640px, 100vw"
                className="object-cover object-[66%_center]"
              />
            </div>
            <div className="absolute bottom-5 left-5 rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 text-[#07111F] shadow-lg">
              <p className="text-sm font-black">4.9 rated teams</p>
              <p className="mt-1 text-xs font-bold text-slate-500">
                cleaning + repair + pickup
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#FF6A00]">
              Services
            </p>
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">
              What can your house help do?
            </h2>
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(7,17,31,0.08)] md:p-5">
            <div className="grid gap-5 rounded-[1.4rem] bg-[#f7f8fa] p-4 md:p-5 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="flex flex-col justify-center rounded-[1.2rem] border border-slate-200 bg-white p-6 md:p-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6A00]">
                  SpeedFix services
                </p>
                <h3 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
                  Clean, repair, install, and maintain.
                </h3>
                <p className="mt-4 max-w-md text-sm font-semibold leading-7 text-slate-600">
                  Live worker flow, clear service cards, and gentle motion so
                  customers can understand what to book without strain.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Booked", "Assigned", "On the way"].map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#07111F]"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#FF6A00] motion-pulse-dot" />
                      {label}
                    </span>
                  ))}
                </div>
                <Link
                  href="/services"
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#07111F] px-5 py-3 text-sm font-black text-white transition hover:bg-[#FF6A00]"
                >
                  View all services
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="relative overflow-hidden rounded-[1.2rem] border border-slate-200 bg-white">
                <video
                  className="h-[280px] w-full object-cover object-center md:h-[360px]"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/services/speedfix-cleaning-kitchen.png"
                >
                  <source src="/videos/speedfix-live-worker.mp4" type="video/mp4" />
                </video>
                <div className="border-t border-slate-200 bg-white px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FF6A00]">
                        Live crew preview
                      </p>
                      <p className="mt-1 text-sm font-black text-[#07111F]">
                        Real task movement, calm customer flow
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#fff2df] px-3 py-2 text-xs font-black text-[#07111F]">
                      <span className="h-2 w-2 rounded-full bg-[#FF6A00] motion-pulse-dot" />
                      Active slots
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="service-live-slider mt-5">
              <div className="service-live-rail">
                {[...taskCards, ...taskCards].map((task, index) => (
                  <div
                    key={`${task.title}-${index}`}
                    className="w-[252px] shrink-0 px-2 md:w-[282px]"
                  >
                    <PhotoTaskCard task={task} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-[#fafafa] py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#FF6A00]">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              Book home help in 3 simple steps
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-600">
              Pick the task, choose a time, and watch every update from one
              clean SpeedFix flow.
            </p>
          </div>

          <SpeedFixBookingFlow />
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#FF6A00]">
              Where we serve
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              SpeedFix across India
            </h2>
          </div>

          <div className="coverage-live-slider mx-auto mt-7 max-w-5xl">
            <div className="coverage-live-rail">
              {[...cityCoverage, ...cityCoverage].map((item, index) => {
                const originalIndex = index % cityCoverage.length;
                const isSelected = originalIndex === selectedCityIndex;

                return (
                  <button
                    key={`${item.city}-${index}`}
                    type="button"
                    onClick={() => selectCoverageCity(originalIndex)}
                    className={`w-[150px] shrink-0 rounded-[1rem] border bg-white p-2.5 text-center shadow-sm transition hover:border-[#FF6A00] md:w-[168px] ${
                      isSelected
                      ? "border-[#FF6A00]"
                      : "border-slate-200"
                    }`}
                  >
                    <div className="relative h-20 overflow-hidden rounded-[0.8rem] bg-slate-100">
                      <Image
                        src={item.image}
                        alt={`${item.city} service area`}
                        fill
                        sizes="180px"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="mt-2 text-base font-black">{item.city}</h3>
                    <p className="text-xs font-bold text-slate-500">
                      {item.areas} areas
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-[1.2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-black md:text-lg">
                Serving{" "}
                <span className="text-[#FF6A00]">
                  {selectedCoverage.areas} areas
                </span>{" "}
                in {selectedCoverage.city}
              </h3>
              <button
                type="button"
                onClick={() => setShowAllAreas((current) => !current)}
                className="rounded-full border border-[#FF6A00]/30 px-4 py-2 text-sm font-black text-[#FF6A00]"
              >
                {showAllAreas ? "Show less" : "View all"}
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {visibleAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setShowLocationGate(true)}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#FF6A00] hover:text-[#FF6A00]"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="rounded-[1.6rem] bg-[#FF6A00] p-6 text-white shadow-[0_18px_45px_rgba(255,106,0,0.16)] md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em]">
                  Bike pickup
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                  Search pickup and drop points on the map.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/90 md:text-base">
                  Customers can use current location, search pickup and drop
                  addresses, and switch satellite mode on the ride map.
                </p>
                <Link
                  href="/rides"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#07111F] px-5 py-3 text-sm font-black text-white"
                >
                  <Bike className="h-4 w-4" />
                  Open bike pickup
                </Link>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {cityCoverage.map((item, index) => (
                  <button
                    key={item.city}
                    type="button"
                    onClick={() => selectCoverageCity(index)}
                    className="rounded-[1rem] border border-white/35 bg-white px-4 py-3 text-left text-sm font-black text-[#07111F] shadow-[0_12px_28px_rgba(7,17,31,0.08)] transition hover:bg-[#07111F] hover:text-white"
                  >
                    <MapPin className="mb-2 h-4 w-4 text-[#FF6A00]" />
                    {item.city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="grid items-center gap-6 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#FF6A00]">
                  Popular now
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight">
                  Clear tasks, clear price, clean booking.
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {featuredTasks.map(({ service, subcategory }) => (
                  <Link
                    key={`${service.slug}-${subcategory.slug}`}
                    href={`/services/${service.slug}/${subcategory.slug}`}
                    className="group flex items-center gap-4 rounded-[1rem] border border-slate-200 bg-white p-3 transition hover:border-[#FF6A00] hover:shadow-md"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF6A00]/10 text-[#FF6A00]">
                      <BadgeCheck className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black">{subcategory.name}</p>
                      <p className="truncate text-xs font-bold text-slate-500">
                        {service.name} / {subcategory.turnaround}
                      </p>
                    </div>
                    <p className="text-sm font-black">Rs. {subcategory.starterPrice}+</p>
                    <ChevronRight className="h-5 w-5 text-[#FF6A00] transition group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {showLocationGate && <LocationGate onClose={() => setShowLocationGate(false)} />}
    </main>
  );
}

function PhotoTaskCard({ task }: { task: TaskCard }) {
  return (
    <Link
      href={task.href}
      className="group flex min-h-[282px] flex-col overflow-hidden rounded-[1.15rem] border border-slate-200 bg-white shadow-[0_14px_35px_rgba(7,17,31,0.08)]"
    >
      <div className="relative h-52 overflow-hidden bg-[#f7f8fa]">
        <Image
          src={task.image}
          alt={task.title}
          fill
          sizes="282px"
          className="object-contain transition duration-500 group-hover:scale-[1.035]"
          style={{ objectPosition: task.position }}
        />
      </div>
      <div className="flex flex-1 items-end justify-between gap-3 p-4">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-[#fff2df] px-2.5 py-1 text-[11px] font-black text-[#07111F]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00] motion-pulse-dot" />
            {task.status}
          </p>
          <h3 className="mt-2 text-lg font-black leading-tight text-[#07111F]">
            {task.title}
          </h3>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#FF6A00] shadow-[0_10px_24px_rgba(7,17,31,0.18)] transition group-hover:translate-x-0.5">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function SpeedFixBookingFlow() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-7 lg:flex-row lg:items-end lg:gap-10">
      <PhoneShowcase step="01" title={steps[0].title} text={steps[0].text}>
        <ChoosePhoneScreen />
      </PhoneShowcase>

      <PhoneShowcase step="02" title={steps[1].title} text={steps[1].text} active>
        <SchedulePhoneScreen />
      </PhoneShowcase>

      <PhoneShowcase step="03" title={steps[2].title} text={steps[2].text}>
        <TrackPhoneScreen />
      </PhoneShowcase>
    </div>
  );
}

function PhoneShowcase({
  step,
  title,
  text,
  active = false,
  children,
}: {
  step: string;
  title: string;
  text: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`w-full max-w-[300px] ${active ? "lg:max-w-[360px]" : "lg:max-w-[270px]"}`}>
      <div
        className={`rounded-[2.25rem] bg-white p-2 shadow-[0_24px_70px_rgba(7,17,31,0.1)] ${
          active ? "border-2 border-[#FF6A00]" : "border border-slate-200"
        }`}
      >
        <div className="overflow-hidden rounded-[1.9rem] border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="text-[11px] font-black">12:15</span>
            <span className="h-1.5 w-16 rounded-full bg-slate-200" />
            <span className="rounded-full bg-[#07111F] px-2 py-1 text-[10px] font-black text-white">
              SF
            </span>
          </div>
          <div className={active ? "min-h-[500px]" : "min-h-[430px]"}>
            {children}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FF6A00]">
          Step {step}
        </p>
        <h3 className="mt-2 text-xl font-black">{title}</h3>
        <p className="mx-auto mt-2 max-w-[280px] text-sm font-semibold leading-6 text-slate-600">
          {text}
        </p>
      </div>
    </div>
  );
}

function ChoosePhoneScreen() {
  const items = [
    ["Cleaning", "/services/speedfix-cleaning-kitchen.png"],
    ["Electrician", "/services/speedfix-electrician-switch.png"],
    ["Plumbing", "/services/speedfix-plumbing-sink.png"],
    ["AC Service", "/services/speedfix-ac-service.png"],
  ];

  return (
    <div className="bg-[#fffaf5] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#FF6A00]">
        SpeedFix home
      </p>
      <h4 className="mt-2 text-2xl font-black leading-tight">
        What do you need today?
      </h4>
      <div className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-400">
        Search cleaning, repairs...
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {items.map(([label, image]) => (
          <div
            key={label}
            className="overflow-hidden rounded-[1rem] border border-slate-200 bg-white shadow-sm"
          >
            <div className="relative h-28 bg-slate-100">
              <Image
                src={image}
                alt={label}
                fill
                sizes="140px"
                className="object-cover object-center"
              />
            </div>
            <p className="px-3 py-2 text-sm font-black">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SchedulePhoneScreen() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const dates = ["24", "25", "26", "27", "28", "29", "30"];

  return (
    <div className="bg-white p-5">
      <div className="rounded-[1.3rem] border border-[#FF6A00]/30 bg-[#fff7ef] p-5 text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF6A00]">
          At your time
        </p>
        <h4 className="mt-2 text-3xl font-black leading-tight">Time & schedule</h4>
      </div>
      <div className="mt-5 rounded-[1.2rem] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-black">Schedule</p>
          <span className="rounded-full bg-[#fff2df] px-3 py-1 text-xs font-black">
            Multiple
          </span>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
          {days.map((day, index) => (
            <div key={`${day}-${index}`}>
              <p className="text-[10px] font-black text-slate-400">{day}</p>
              <span
                className={`mt-2 flex h-9 items-center justify-center rounded-full text-xs font-black ${
                  index === 4
                    ? "bg-[#FF6A00] text-white speedfix-selected-day"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {dates[index]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2">
          {["Kitchen cleaning", "6:30 PM", "Pay after service"].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-full border border-slate-200 px-3 py-2 text-xs font-black"
            >
              <span>{item}</span>
              <BadgeCheck className="h-4 w-4 text-[#FF6A00]" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 overflow-hidden rounded-[1.2rem] border border-slate-200 bg-white shadow-sm">
        <div className="relative h-28">
          <Image
            src="/services/speedfix-cleaning-kitchen.png"
            alt="SpeedFix worker assigned"
            fill
            sizes="280px"
            className="object-cover object-[center_30%]"
          />
        </div>
      </div>
    </div>
  );
}

function TrackPhoneScreen() {
  return (
    <div className="bg-[#fffaf5] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#FF6A00]">
        Google map live
      </p>
      <h4 className="mt-2 text-2xl font-black leading-tight">
        Track your expert.
      </h4>
      <div className="relative mt-4 h-52 overflow-hidden rounded-[1.2rem] border border-slate-200 bg-slate-100">
        <iframe
          title="Google map showing SpeedFix worker route in Bengaluru"
          src="https://www.google.com/maps?q=Bengaluru&z=13&output=embed"
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute bottom-4 left-4 right-4 rounded-[1rem] border border-slate-200 bg-white p-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-sm">
              <Image
                src="/services/speedfix-cleaning-kitchen.png"
                alt="SpeedFix worker"
                fill
                sizes="48px"
                className="object-cover object-[center_18%]"
              />
            </div>
            <div>
              <p className="text-sm font-black">SpeedFix expert</p>
              <p className="text-xs font-bold text-slate-500">10 min away</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-[1.2rem] border border-slate-200 bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          Updates
        </p>
        <div className="mt-3 space-y-2">
          {["Professional assigned", "On the way", "Support online"].map((item) => (
            <p key={item} className="flex items-center gap-2 text-xs font-black">
              <span className="h-2 w-2 rounded-full bg-[#FF6A00] motion-pulse-dot" />
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
