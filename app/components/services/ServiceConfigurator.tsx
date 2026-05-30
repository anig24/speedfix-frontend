"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, ShoppingBag } from "lucide-react";
import {
  addItemToCart,
  CartItem,
} from "@/lib/cart";
import {
  ServiceCatalogItem,
  ServiceSubcategory,
} from "@/lib/serviceCatalog";

type ServiceConfiguratorProps = {
  service: ServiceCatalogItem;
  subcategory?: ServiceSubcategory;
};

function createCartId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `cart_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export default function ServiceConfigurator({
  service,
  subcategory,
}: ServiceConfiguratorProps) {
  const router = useRouter();
  const [selectedPackageName, setSelectedPackageName] = useState(
    subcategory?.recommendedPackage ||
      service.packages[1]?.name ||
      service.packages[0].name
  );
  const [selectedAddonNames, setSelectedAddonNames] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  const selectedPackage = useMemo(() => {
    return (
      service.packages.find((item) => item.name === selectedPackageName) ||
      service.packages[0]
    );
  }, [selectedPackageName, service.packages]);

  const selectedAddons = service.addons.filter((addon) =>
    selectedAddonNames.includes(addon.name)
  );

  const total =
    selectedPackage.price +
    selectedAddons.reduce((sum, addon) => sum + addon.price, 0);

  const toggleAddon = (addonName: string) => {
    setSelectedAddonNames((current) =>
      current.includes(addonName)
        ? current.filter((name) => name !== addonName)
        : [...current, addonName]
    );
  };

  const buildCartItem = (): CartItem => ({
    id: createCartId(),
    serviceSlug: service.slug,
    serviceName: service.name,
    serviceImage: service.image,
    subcategorySlug: subcategory?.slug,
    subcategoryName: subcategory?.name,
    packageName: selectedPackage.name,
    packagePrice: selectedPackage.price,
    addons: selectedAddons,
    quantity: 1,
    turnaround: selectedPackage.turnaround,
  });

  const handleAddToCart = () => {
    addItemToCart(buildCartItem());
    setNotice("Added to cart. You can keep browsing or head to checkout.");
  };

  const handleBuyNow = () => {
    addItemToCart(buildCartItem());
    router.push("/checkout");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              {subcategory ? "Recommended plans" : "Packages"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {subcategory
                ? `Choose a plan for ${subcategory.name}`
                : "Pick the right visit type"}
            </h2>
          </div>
          <div className="rounded-full bg-[#fff5ea] px-4 py-2 text-sm font-medium text-orange-600">
            Starts at Rs. {subcategory?.starterPrice || service.basePrice}
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
                  ? "border-[#FF6A00] bg-[#fff7ef] text-[#07111F]"
                  : "border-slate-200 bg-slate-50 text-[#07111F] hover:border-[#FF6A00]/50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{pkg.name}</h3>
                  <p className="mt-2 text-sm leading-7 opacity-80">
                    {pkg.description}
                  </p>
                </div>
                <p className="rounded-full bg-white px-3 py-2 text-sm font-bold text-[#07111F] shadow-sm">
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
        <h2 className="text-2xl font-semibold text-slate-950">Add-ons</h2>
        <div className="mt-5 space-y-3">
          {service.addons.map((addon) => (
            <button
              key={addon.name}
              type="button"
              onClick={() => toggleAddon(addon.name)}
              className={`flex w-full items-center justify-between rounded-[1.4rem] border px-4 py-4 text-left transition ${
                selectedAddonNames.includes(addon.name)
                  ? "border-[#FF6A00] bg-[#fff7ef] text-[#07111F]"
                  : "border-slate-200 bg-slate-50 text-[#07111F] hover:border-[#FF6A00]/50"
              }`}
            >
              <span className="text-sm font-medium">{addon.name}</span>
              <span className="text-sm">Rs. {addon.price}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-[#07111F] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
        <h2 className="text-2xl font-semibold">Booking summary</h2>
        <div className="mt-5 space-y-3 text-sm text-slate-600">
          <p>Service: {service.name}</p>
          {subcategory && <p>Subcategory: {subcategory.name}</p>}
          <p>Package: {selectedPackage.name}</p>
          <p>Add-ons selected: {selectedAddons.length}</p>
          <p>Expected turnaround: {selectedPackage.turnaround}</p>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-[#FF6A00]/20 bg-[#fff7ef] p-4">
          <p className="text-sm text-slate-600">Estimated total</p>
          <p className="mt-2 text-3xl font-semibold text-[#07111F]">Rs. {total}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-4 text-sm font-semibold text-[#07111F] transition hover:border-[#FF6A00]/50 hover:bg-[#fff7ef]"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to cart
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FF6A00] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#07111F]"
          >
            Continue to checkout
            <ArrowRight className="h-4 w-4" />
          </button>

          <Link
            href="/cart"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-4 text-sm font-semibold text-[#07111F] transition hover:border-[#FF6A00]/50"
          >
            View cart
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {notice && (
          <div className="mt-4 flex items-start gap-2 rounded-[1.5rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            {notice}
          </div>
        )}
      </div>
    </div>
  );
}
