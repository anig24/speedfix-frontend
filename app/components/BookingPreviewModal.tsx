"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BookingSuccess from "@/app/components/BookingSuccess";

export default function BookingPreviewModal({
  open,
  onClose,
  service,
}: any) {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // 🔥 SAVE BOOKING
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

      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // 💳 RAZORPAY
  const handlePayment = async () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: 499 * 100,
      currency: "INR",
      name: "SpeedFix",
      description: service,
      handler: function (response: any) {
        saveBooking(response.razorpay_payment_id);
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-black rounded-2xl w-full max-w-md p-6 shadow-2xl"
      >

        {success ? (
          <BookingSuccess service={service} />
        ) : (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold">
                {step === 1 && "Select Date & Time"}
                {step === 2 && "Enter Address"}
                {step === 3 && "Confirm Payment"}
              </h3>

              <button onClick={onClose}>✕</button>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <input
                  type="date"
                  className="w-full border p-2 rounded mb-3"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <input
                  type="time"
                  className="w-full border p-2 rounded"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />

                <button
                  onClick={() => setStep(2)}
                  className="mt-4 bg-[#FF6A00] text-white w-full py-2 rounded"
                >
                  Continue
                </button>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <textarea
                  className="w-full border p-2 rounded"
                  placeholder="Enter your full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <button
                  onClick={() => setStep(3)}
                  className="mt-4 bg-[#FF6A00] text-white w-full py-2 rounded"
                >
                  Continue
                </button>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <div className="mb-4 text-sm space-y-2">
                  <p><strong>Service:</strong> {service}</p>
                  <p><strong>Date:</strong> {date}</p>
                  <p><strong>Time:</strong> {time}</p>
                  <p><strong>Address:</strong> {address}</p>
                  <p><strong>Price:</strong> ₹499</p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="bg-[#FF6A00] text-white w-full py-3 rounded"
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