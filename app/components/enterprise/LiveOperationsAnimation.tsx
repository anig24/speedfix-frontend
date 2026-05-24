"use client";

import { motion } from "framer-motion";
import { liveOperatingSignals } from "@/lib/enterpriseManagement";

type LiveOperationsAnimationProps = {
  compact?: boolean;
};

export default function LiveOperationsAnimation({
  compact = false,
}: LiveOperationsAnimationProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[#07111f] text-white shadow-[0_30px_90px_rgba(2,10,24,0.25)] ${
        compact ? "min-h-[260px] p-5" : "min-h-[420px] p-8"
      }`}
    >
      <div className="absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      </div>

      <motion.div
        className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-300/40 bg-orange-500/15 shadow-[0_0_60px_rgba(255,106,0,0.45)]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
          Live enterprise command
        </p>
        <h3 className="mt-3 max-w-lg text-3xl font-semibold tracking-tight">
          Every team connected through one operating backbone
        </h3>
      </div>

      <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-2">
        {liveOperatingSignals.map((signal, index) => {
          const Icon = signal.icon;

          return (
            <motion.div
              key={signal.label}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 backdrop-blur"
              animate={{ y: [0, index % 2 === 0 ? -5 : 5, 0] }}
              transition={{
                duration: 2.6 + index * 0.16,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${signal.color}`} />
              <Icon className="h-4 w-4 text-white/60" />
              <span className="text-sm font-medium text-white/86">
                {signal.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="absolute bottom-8 left-8 right-8 h-1 rounded-full bg-white/10"
        initial={false}
      >
        <motion.div
          className="h-full rounded-full bg-[#ff6a00]"
          animate={{ width: ["12%", "82%", "38%", "96%", "12%"] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
