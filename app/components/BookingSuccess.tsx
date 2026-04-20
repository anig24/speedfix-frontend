"use client";

import { motion } from "framer-motion";

export default function BookingSuccess({
  service,
}: {
  service?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white p-10 rounded-2xl text-center"
      >
        <h2 className="text-xl font-bold mb-4">
          Booking Confirmed 🎉
        </h2>

        <motion.div
          animate={{ x: [0, 100] }}
          transition={{ duration: 2 }}
          className="text-4xl"
        >
          👨‍🔧 → 🏠
        </motion.div>

        <p className="mt-4 text-gray-600">
          {service ? `${service} booking confirmed.` : "Worker is on the way"}
        </p>
      </motion.div>

    </div>
  );
}
