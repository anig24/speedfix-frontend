"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  Headset,
  MapPinned,
  Radar,
  ShieldCheck,
  Truck,
} from "lucide-react";

const routeSignals = [
  "Search",
  "Quote",
  "Schedule",
  "Match",
  "Dispatch",
  "Track",
  "QA",
  "Support",
];

const liveSteps = [
  { label: "Booking", icon: CheckCircle2 },
  { label: "Provider", icon: Radar },
  { label: "ETA", icon: Truck },
  { label: "Quality", icon: ShieldCheck },
  { label: "Support", icon: Headset },
];

export default function GlobalMotionSystem() {
  const pathname = usePathname();

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <motion.div
          key={`glow-${pathname}`}
          className="absolute -right-28 top-20 h-72 w-72 rounded-full bg-orange-400/12 blur-3xl"
          animate={{ x: [0, -24, 0], y: [0, 18, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-24 bottom-28 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl"
          animate={{ x: [0, 22, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 global-motion-grid opacity-[0.28]" />
        <motion.div
          className="absolute left-0 top-[112px] h-px w-1/3 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"
          animate={{ x: ["-40vw", "140vw"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-[18%] right-0 h-px w-1/4 bg-gradient-to-r from-transparent via-sky-400/45 to-transparent"
          animate={{ x: ["35vw", "-140vw"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <motion.div
        key={pathname}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-[76px] z-[60] h-1 bg-[#ff6a00]"
        initial={{ width: "0%" }}
        animate={{ width: ["0%", "48%", "100%", "0%"] }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />

      <motion.div
        aria-label="Live service routing"
        className="fixed bottom-4 left-1/2 z-40 hidden w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 rounded-full border border-slate-200 bg-white/92 px-3 py-2 shadow-[0_20px_70px_rgba(15,23,42,0.16)] backdrop-blur-xl md:block"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex items-center justify-between gap-2">
          {liveSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.label}
                className="relative flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <motion.span
                  className="absolute inset-0 rounded-full bg-slate-100"
                  animate={{ opacity: [0.18, index === 1 ? 0.72 : 0.36, 0.18] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    delay: index * 0.22,
                    ease: "easeInOut",
                  }}
                />
                <Icon className="relative h-4 w-4 text-orange-500" />
                <span className="relative">{step.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
      >
        <div className="rounded-full border border-white/70 bg-white/70 p-2 shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="flex flex-col items-center gap-2">
            {routeSignals.map((signal, index) => (
              <motion.div
                key={signal}
                className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500"
                animate={{ y: [0, index % 2 ? 3 : -3, 0] }}
                transition={{
                  duration: 3 + index * 0.18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {index === 2 ? (
                  <Clock3 className="h-4 w-4" />
                ) : index === 5 ? (
                  <MapPinned className="h-4 w-4" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                )}
                <span className="absolute right-11 hidden whitespace-nowrap rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold text-white group-hover:block">
                  {signal}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
