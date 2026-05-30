"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function GlobalMotionSystem() {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[11] overflow-hidden opacity-60"
    >
      <div
        className="absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(7,17,31,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(7,17,31,0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <motion.div
        className="absolute left-[6%] top-[18%] h-px w-56 bg-gradient-to-r from-transparent via-[#FF6A00]/35 to-transparent"
        animate={{ x: ["-16vw", "116vw"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[22%] right-[4%] h-px w-64 bg-gradient-to-r from-transparent via-[#07111F]/18 to-transparent"
        animate={{ x: ["22vw", "-118vw"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute left-[14%] top-[42%] h-2 w-2 rounded-full bg-[#FF6A00]/55"
        animate={{ y: [0, -14, 0], opacity: [0.35, 0.8, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[18%] top-[30%] h-2 w-2 rounded-full bg-[#07111F]/35"
        animate={{ y: [0, 12, 0], opacity: [0.28, 0.65, 0.28] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[18%] left-[38%] h-2 w-2 rounded-full bg-[#FF6A00]/45"
        animate={{ x: [0, 18, 0], opacity: [0.25, 0.72, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        className="absolute inset-x-0 top-[16%] h-[360px] w-full opacity-[0.22]"
        viewBox="0 0 1440 360"
        fill="none"
      >
        <motion.path
          d="M-40 250 C 160 120, 310 310, 520 170 S 850 74, 1010 190 S 1240 292, 1480 130"
          stroke="#FF6A00"
          strokeWidth="2"
          strokeDasharray="8 18"
          strokeLinecap="round"
          animate={{ strokeDashoffset: [0, -120] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M-80 90 C 180 180, 350 46, 590 116 S 970 260, 1190 116 S 1390 70, 1500 190"
          stroke="#07111F"
          strokeWidth="1.5"
          strokeDasharray="6 22"
          strokeLinecap="round"
          animate={{ strokeDashoffset: [0, 110] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}
