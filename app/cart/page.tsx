"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  CartItem,
  getCartCount,
  getCartSubtotal,
  readCart,
  removeCartItem,
  subscribeToCart,
  updateCartItemQuantity,
  validateCoupon,
} from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponPreview, setCouponPreview] = useState("");

  useEffect(() => {
    const sync = () => setItems(readCart());

    sync();
    return subscribeToCart(sync);
  }, []);

  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const cartCount = useMemo(() => getCartCount(items), [items]);
  const previewState = validateCoupon(couponPreview, subtotal);
  const previewDiscount =
    previewState && previewState.discountPercent > 0
      ? Math.round((subtotal * previewState.discountPercent) / 100)
      : 0;

  if (!items.length) {
    return (
      <div className="bg-[#f6efe4] px-6 py-16 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-[2.2rem] border border-slate-200 bg-white p-10 text-center shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <div className="mx-auto inline-flex rounded-full bg-[#fff5ea] p-4 text-orange-500">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h1 className="mt-6 display-font text-4xl text-slate-950">
            Your cart is empty
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Add a service, choose the right package, and build your booking
            before heading to checkout.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Explore services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6efe4] px-6 py-14 text-slate-900 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Your booking cart
            </p>
            <h1 className="mt-3 display-font text-5xl text-slate-950">
              Review services before checkout
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              All selected packages, add-ons, and first-booking coupon savings
              live here before payment.
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700">
            {cartCount} item{cartCount > 1 ? "s" : ""} in cart
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            {items.map((item) => {
              const addonTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0);
              const itemTotal = (item.packagePrice + addonTotal) * item.quantity;

              return (
                <article
                  key={item.id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.06)]"
                >
                  <div className="grid gap-5 md:grid-cols-[120px_1fr]">
                    <div className="relative h-32 overflow-hidden rounded-[1.5rem]">
                      <Image
                        src={item.serviceImage}
                        alt={item.serviceName}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {item.serviceName}
                          </p>
                          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                            {item.subcategoryName || item.packageName}
                          </h2>
                          <p className="mt-2 text-sm text-slate-600">
                            Package: {item.packageName} | {item.turnaround}
                          </p>
                        </div>

                        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
                          Rs. {itemTotal}
                        </div>
                      </div>

                      {Boolean(item.addons.length) && (
                        <div className="flex flex-wrap gap-2">
                          {item.addons.map((addon) => (
                            <span
                              key={addon.name}
                              className="rounded-full bg-[#fff5ea] px-3 py-2 text-xs font-medium text-orange-700"
                            >
                              {addon.name} | Rs. {addon.price}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
                          <button
                            type="button"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            className="rounded-full p-1 text-slate-600 transition hover:bg-slate-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[24px] text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            className="rounded-full p-1 text-slate-600 transition hover:bg-slate-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeCartItem(item.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                First booking offer
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                Use WELCOME30
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Get 30% off your first booking. You can apply it in checkout, or
                preview the savings here before you continue.
              </p>

              <input
                value={couponPreview}
                onChange={(event) => setCouponPreview(event.target.value)}
                placeholder="Try WELCOME30"
                className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />

              {previewState && (
                <div
                  className={`mt-4 rounded-[1.4rem] px-4 py-3 text-sm ${
                    previewState.discountPercent > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {previewState.message}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
              <h2 className="text-2xl font-semibold">Order summary</h2>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Offer preview</span>
                  <span>- Rs. {previewDiscount}</span>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Payable after coupon</span>
                  <span className="text-3xl font-semibold text-white">
                    Rs. {Math.max(subtotal - previewDiscount, 0)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Continue to checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
