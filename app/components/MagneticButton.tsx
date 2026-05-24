"use client";

import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";
import type { MouseEvent } from "react";
import { useRef } from "react";

export default function MagneticButton({
  children,
  className = "",
  ...props
}: HTMLMotionProps<"button">) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);

    x.set(offsetX * 0.2);
    y.set(offsetY * 0.2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      className={`bg-[#FF6A00] text-white px-8 py-4 rounded-lg font-semibold ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
