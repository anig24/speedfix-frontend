"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  CreditCard,
  House,
  LoaderCircle,
} from "lucide-react";
import {
  CartAddress,
  CartItem,
  clearCart,
  getCartSubtotal,
  markFirstBookingUsed,
  readCart,
  readCheckoutAddress,
  validateCoupon,
  writeCheckoutAddress,
} from "@/lib/cart";
import { readStoredCoordinates } from "@/lib/locationStorage";

type PaymentMethod = "razorpay" | "pay-on-service";
type RazorpayWindow = Window &
  typeof globalThis & {
    Razorpay?: new (options: unknown) => { open: () => void };
  };

const EMPTY_ADDRESS: CartAddress = {
  fullName: "",
  phone: "",
  city: "",
  pincode: "",
  addressLine: "",
  landmark: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<CartAddress>(EMPTY_ADDRESS);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [hasHydratedAddress, setHasHydratedAddress] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setAddress(readCheckoutAddress());
    setHasHydratedAddress(true);
  }, []);

  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const activeCoupon = useMemo(
    () => validateCoupon(appliedCouponCode, subtotal),
    [appliedCouponCode, subtotal]
  );
  const discountAmount =
    activeCoupon && activeCoupon.discountPercent > 0
      ? Math.round((subtotal * activeCoupon.discountPercent) / 100)
      : 0;
  const finalTotal = Math.max(subtotal - discountAmount, 0);

  useEffect(() => {
    if (!hasHydratedAddress) {
      return;
    }

    writeCheckoutAddress(address);
  }, [address, hasHydratedAddress]);

  const handleAddressChange = <K extends keyof CartAddress>(
    field: K,
    value: CartAddress[K]
  ) => {
    setAddress((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const applyCoupon = () => {
    const couponState = validateCoupon(couponCode, subtotal);

    if (!couponState) {
      setAppliedCouponCode("");
      setCouponMessage("");
      return;
    }

    setCouponMessage(couponState.message);

    if (couponState.discountPercent > 0) {
      setAppliedCouponCode(couponState.code);
    } else {
      setAppliedCouponCode("");
    }
  };

  const validateAddress = () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.city ||
      !address.pincode ||
      !address.addressLine
    ) {
      setCouponMessage("Please complete name, phone, city, pincode, and address.");
      return false;
    }

    return true;
  };

  const buildBookingData = () => {
    const primaryItem = items[0];
    const customerCoordinates = readStoredCoordinates();

    return {
      service: primaryItem.serviceSlug,
      serviceName: primaryItem.serviceName,
      subcategoryName: primaryItem.subcategoryName || null,
      customerName: address.fullName,
      customerPhone: address.phone,
      city: address.city,
      pincode: address.pincode,
      address: `${address.addressLine}${address.landmark ? `, ${address.landmark}` : ""}`,
      amount: finalTotal,
      subtotal,
      discountAmount,
      couponCode: activeCoupon?.discountPercent ? activeCoupon.code : null,
      paymentMethod,
      customerLocation: customerCoordinates,
      items: items.map((item) => ({
        serviceName: item.serviceName,
        subcategoryName: item.subcategoryName || null,
        packageName: item.packageName,
        packagePrice: item.packagePrice,
        quantity: item.quantity,
        addons: item.addons,
      })),
    };
  };

  const finishBooking = (bookingId: string, assigned: boolean) => {
    markFirstBookingUsed();
    clearCart();
    localStorage.setItem("speedfix_latest_booking_id", bookingId);
    setSuccessMessage(
      assigned
        ? "Booking confirmed. A nearby technician has been assigned."
        : "Booking confirmed. We are assigning the nearest available technician now."
    );
    setTimeout(() => {
      router.push(`/track?bookingId=${bookingId}`);
    }, 2200);
  };

  const handlePayAfterService = async () => {
    const response = await fetch("/api/create-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingData: {
          ...buildBookingData(),
          paymentStatus: "PENDING",
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to place your booking.");
    }

    return result as {
      bookingId: string;
      assigned: boolean;
    };
  };

  const handleRazorpay = async () => {
    const orderResponse = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: finalTotal }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      throw new Error(orderData.error || "Unable to create payment order.");
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "SpeedFix",
      description: items[0]?.serviceName || "SpeedFix booking",
      order_id: orderData.id,
      handler: async function (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) {
        const verifyResponse = await fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...response,
            bookingData: {
              ...buildBookingData(),
              paymentStatus: "PAID",
            },
          }),
        });

        const verifyResult = await verifyResponse.json();

        if (!verifyResponse.ok) {
          throw new Error(verifyResult.error || "Payment verification failed.");
        }

        finishBooking(verifyResult.bookingId, Boolean(verifyResult.assigned));
      },
      prefill: {
        name: address.fullName,
        contact: address.phone,
      },
      theme: {
        color: "#111827",
      },
    };

    const Razorpay = (window as RazorpayWindow).Razorpay;

    if (!Razorpay) {
      throw new Error("Payment checkout is not available right now.");
    }

    new Razorpay(options).open();
  };

  const handlePlaceOrder = async () => {
    if (!items.length) {
      setCouponMessage("Your cart is empty.");
      return;
    }

    if (!validateAddress()) {
      return;
    }

    setLoading(true);
    setCouponMessage("");

    try {
      if (paymentMethod === "pay-on-service") {
        const result = await handlePayAfterService();
        finishBooking(result.bookingId, Boolean(result.assigned));
      } else {
        await handleRazorpay();
      }
    } catch (error) {
      setCouponMessage(
        error instanceof Error ? error.message : "Unable to complete checkout."
      );
    } finally {
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="bg-[#f6efe4] px-6 py-16 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-[2.2rem] border border-slate-200 bg-white p-10 text-center shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <div className="mx-auto inline-flex rounded-full bg-emerald-100 p-4 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h1 className="mt-6 display-font text-4xl text-slate-950">
            Booking confirmed
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">{successMessage}</p>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="bg-[#f6efe4] px-6 py-16 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-[2.2rem] border border-slate-200 bg-white p-10 text-center shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <h1 className="display-font text-4xl text-slate-950">
            Your cart is empty
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Add a service first, then come back here to finish the booking.
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
              Checkout
            </p>
            <h1 className="mt-3 display-font text-5xl text-slate-950">
              Address, coupon, payment
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Finalize your booking details, apply your first-booking offer, and
              complete the payment securely.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3">
                <House className="h-5 w-5 text-orange-500" />
                <h2 className="text-2xl font-semibold text-slate-950">
                  Service address
                </h2>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input
                  value={address.fullName}
                  onChange={(event) => handleAddressChange("fullName", event.target.value)}
                  placeholder="Full name"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
                <input
                  value={address.phone}
                  onChange={(event) =>
                    handleAddressChange("phone", event.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="Mobile number"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
                <input
                  value={address.city}
                  onChange={(event) => handleAddressChange("city", event.target.value)}
                  placeholder="City"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
                <input
                  value={address.pincode}
                  onChange={(event) =>
                    handleAddressChange("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Pincode"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
              </div>

              <textarea
                value={address.addressLine}
                onChange={(event) => handleAddressChange("addressLine", event.target.value)}
                rows={3}
                placeholder="Flat, building, street, area"
                className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              />

              <input
                value={address.landmark}
                onChange={(event) => handleAddressChange("landmark", event.target.value)}
                placeholder="Landmark (optional)"
                className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              />
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3">
                <BadgePercent className="h-5 w-5 text-orange-500" />
                <h2 className="text-2xl font-semibold text-slate-950">
                  Coupon
                </h2>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="Try WELCOME30"
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Apply coupon
                </button>
              </div>

              <div className="mt-4 rounded-[1.4rem] bg-[#fff5ea] px-4 py-3 text-sm text-slate-700">
                First booking offer: 30% off with WELCOME30.
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-orange-500" />
                <h2 className="text-2xl font-semibold text-slate-950">
                  Payment option
                </h2>
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  {
                    id: "razorpay" as const,
                    title: "Razorpay secure checkout",
                    description: "Pay now with card, UPI, or net banking.",
                  },
                  {
                    id: "pay-on-service" as const,
                    title: "Pay after service",
                    description: "Book now and settle the bill after the visit.",
                  },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id)}
                    className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                      paymentMethod === option.id
                        ? "border-slate-900 bg-slate-950 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    <h3 className="text-base font-semibold">{option.title}</h3>
                    <p className="mt-2 text-sm opacity-80">{option.description}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
              <h2 className="text-2xl font-semibold text-slate-950">
                Booking items
              </h2>

              <div className="mt-5 space-y-4">
                {items.map((item) => {
                  const addonTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0);
                  const total = (item.packagePrice + addonTotal) * item.quantity;

                  return (
                    <div key={item.id} className="rounded-[1.5rem] border border-slate-200 p-4">
                      <div className="flex gap-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
                          <Image
                            src={item.serviceImage}
                            alt={item.serviceName}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-950">
                            {item.subcategoryName || item.serviceName}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {item.packageName} | Qty {item.quantity}
                          </p>
                          <p className="mt-2 text-sm font-medium text-slate-900">
                            Rs. {total}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
              <h2 className="text-2xl font-semibold">Total payable</h2>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Coupon savings</span>
                  <span>- Rs. {discountAmount}</span>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Final amount</span>
                  <span className="text-3xl font-semibold text-white">
                    Rs. {finalTotal}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    Confirm booking
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {couponMessage && (
                <div className="mt-4 rounded-[1.4rem] bg-white/5 px-4 py-3 text-sm text-slate-200">
                  {couponMessage}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
