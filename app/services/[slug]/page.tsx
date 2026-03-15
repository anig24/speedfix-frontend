"use client";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebase";


export default function ServicePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

 
  const user = auth.currentUser;
  const [selectedSlot, setSelectedSlot] = useState("");

  const serviceData: any = {
    electrician: {
      title: "Professional Electrician Service",
      price: 149,
      description:
        "Expert electricians for wiring, installations, repairs and maintenance.",
    },
    plumbing: {
      title: "Reliable Plumbing Service",
      price: 149,
      description:
        "Leak fixes, pipe repairs, bathroom fittings and more.",
    },
    cleaning: {
      title: "Deep Home Cleaning",
      price: 499,
      description:
        "Complete home cleaning with professional equipment.",
    },
    "ac-service": {
      title: "AC Repair & Maintenance",
      price: 299,
      description:
        "Gas refill, servicing, installation and repair by certified technicians.",
    },
  };

  const service = serviceData[slug];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Service not found</h1>
      </div>
    );
  }

  const slots = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
  ];

const handleBook = async () => {
if (!user) {
  router.push(`/login?redirect=${slug}`);
  return;
}

  if (!selectedSlot) {
    alert("Please select a slot");
    return;
  }

  const loaded = await loadRazorpayScript();

  if (!loaded) {
    alert("Razorpay SDK failed to load");
    return;
  }

  // 1️⃣ Create order from backend
  const orderRes = await fetch("/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: service.price }),
  });

  const order = await orderRes.json();

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    name: "SpeedFix",
    description: service.title,

    handler: async function (response: any) {
      const verifyRes = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          bookingData: {
            service: slug,
            city: "SelectedCityHere", // we connect later
            slot: selectedSlot,
            amount: service.price,
          },
        }),
      });

      const data = await verifyRes.json();

      if (data.success) {
        alert("Booking Confirmed ✅");
        router.push("/dashboard");
      } else {
        alert("Payment verification failed ❌");
      }
    },

    theme: {
      color: "#f97316",
    },
  };

  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.open();
};
  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <div className="bg-white shadow-xl rounded-xl p-10 mb-12">
          <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
          <p className="text-gray-600 mb-6">{service.description}</p>

          <div className="text-2xl font-semibold text-orange-500">
            Starting at ₹{service.price}
          </div>
        </div>

        {/* Slot Selection */}
        <div className="bg-white shadow-xl rounded-xl p-10">
          <h2 className="text-2xl font-bold mb-6">Select a Time Slot</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {slots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`border p-4 rounded-lg transition ${
                  selectedSlot === slot
                    ? "bg-orange-500 text-white"
                    : "hover:border-orange-500"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          <button
            onClick={handleBook}
            className="w-full bg-orange-500 text-white py-4 rounded-lg text-lg hover:bg-orange-600 transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
}