"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type ServiceType = {
  title: string;
  basePrice: number;
  description: string;
};

const services: Record<string, ServiceType> = {
  electrician: {
    title: "Professional Electrician Service",
    basePrice: 149,
    description:
      "Certified electricians for wiring, installations, repairs and maintenance.",
  },
  plumbing: {
    title: "Reliable Plumbing Service",
    basePrice: 149,
    description:
      "Leak fixes, pipe repairs, bathroom fittings and more.",
  },
  cleaning: {
    title: "Deep Home Cleaning",
    basePrice: 499,
    description:
      "Complete home cleaning with professional equipment.",
  },
  ac_service: {
    title: "AC Repair & Maintenance",
    basePrice: 299,
    description:
      "Gas refill, servicing, installation and repair by certified technicians.",
  },
};

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function ServicePage() {
  const { slug } = useParams();
  const router = useRouter();

  const service = services[slug as string];

  const [user, setUser] = useState<any>(null);
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [slot, setSlot] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Service Not Found</h1>
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

  const handleBooking = async () => {
    if (!user) {
      router.push(`/login?redirect=/services/${slug}`);
      return;
    }

    if (!city || !pincode || !slot) {
      alert("Please complete all booking details");
      return;
    }

    if (pincode.length !== 6) {
      alert("Enter valid 6-digit pincode");
      return;
    }

    setLoading(true);

    try {
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        alert("Payment SDK failed");
        return;
      }

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: service.basePrice }),
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
                userId: user.uid,
                service: slug,
                city,
                pincode,
                slot,
                amount: service.basePrice,
              },
            }),
          });

          const data = await verifyRes.json();

          if (data.success) {
            router.push("/dashboard");
          } else {
            alert("Payment verification failed");
          }
        },
        theme: { color: "#f97316" },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error(error);
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 py-14 px-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Service Info */}
        <div className="bg-white rounded-2xl shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
          <p className="text-gray-600 mb-6">{service.description}</p>
          <div className="text-2xl font-semibold text-orange-500">
            ₹{service.basePrice}
          </div>
        </div>

        {/* Booking Section */}
        <div className="bg-white rounded-2xl shadow-lg p-10 space-y-8">

          {/* City */}
          <div>
            <label className="font-semibold block mb-2">Select City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Choose City</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Howrah">Howrah</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </div>

          {/* Pincode */}
          <div>
            <label className="font-semibold block mb-2">Enter Pincode</label>
            <input
              type="number"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="6-digit pincode"
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Slot Selection */}
          <div>
            <label className="font-semibold block mb-4">Select Time Slot</label>
            <div className="grid md:grid-cols-2 gap-4">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  className={`border p-4 rounded-lg ${
                    slot === s
                      ? "bg-orange-500 text-white"
                      : "hover:border-orange-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Book Button */}
          <button
            onClick={handleBooking}
            disabled={loading}
            className="w-full bg-orange-500 text-white py-4 rounded-lg text-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </section>
  );
}