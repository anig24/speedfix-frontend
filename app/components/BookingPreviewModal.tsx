"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BookingSuccess from "@/app/components/BookingSuccess";

type BookingPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  service: string;
};

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
};

type RazorpayOptions = {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayPaymentResponse) => void;
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

export default function BookingPreviewModal({
  open,
  onClose,
  service,
}: BookingPreviewModalProps) {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) {
    return null;
  }

  const saveBooking = async (paymentId: string) => {
    setLoading(true);

    try {
      const city = localStorage.getItem("city");

      await addDoc(collection(db, "bookings"), {
        service,
        date,
        time,
        address,
        city,
        paymentId,
        status: "confirmed",
        createdAt: new Date(),
      });

      setSuccess(true);
      setTimeout(onClose, 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!window.Razorpay) {
      console.error("Razorpay checkout script is not available.");
      return;
    }

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: 499 * 100,
      currency: "INR",
      name: "SpeedFix",
      description: service,
      handler: (response) => {
        saveBooking(response.razorpay_payment_id);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 text-black shadow-2xl"
      >
        {success ? (
          <BookingSuccess service={service} />
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {step === 1 && "Select Date & Time"}
                {step === 2 && "Enter Address"}
                {step === 3 && "Confirm Payment"}
              </h3>

              <button type="button" onClick={onClose}>
                x
              </button>
            </div>

            {step === 1 && (
              <>
                <input
                  type="date"
                  className="mb-3 w-full rounded border p-2"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />

                <input
                  type="time"
                  className="w-full rounded border p-2"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-4 w-full rounded bg-[#FF6A00] py-2 text-white"
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <textarea
                  className="w-full rounded border p-2"
                  placeholder="Enter your full address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="mt-4 w-full rounded bg-[#FF6A00] py-2 text-white"
                >
                  Continue
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <div className="mb-4 space-y-2 text-sm">
                  <p>
                    <strong>Service:</strong> {service}
                  </p>
                  <p>
                    <strong>Date:</strong> {date}
                  </p>
                  <p>
                    <strong>Time:</strong> {time}
                  </p>
                  <p>
                    <strong>Address:</strong> {address}
                  </p>
                  <p>
                    <strong>Price:</strong> Rs 499
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full rounded bg-[#FF6A00] py-3 text-white"
                >
                  {loading ? "Processing..." : "Pay & Confirm"}
                </button>
              </>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
