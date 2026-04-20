"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const params = useSearchParams();

  const service = params.get("service");
  const total = params.get("total");

  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Number(total) * 100,
      currency: "INR",
      name: "SpeedFix",
      description: service,

      handler: function () {
        alert("Booking Confirmed 🎉");
      },
    };

    new (window as any).Razorpay(options).open();

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6">
      <div className="max-w-md mx-auto bg-white text-black p-6 rounded-xl">

        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        <p>Service: {service}</p>
        <p>Total: ₹{total}</p>

        <button
          onClick={handlePayment}
          className="mt-6 w-full bg-orange-500 text-white py-3 rounded"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

      </div>
    </div>
  );
}