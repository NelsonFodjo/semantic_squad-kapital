"use client";

// ============================================================
// Reveal — spring gravity drops & scroll reveals.
// ============================================================

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  /** Seconds to wait before starting. */
  delay?: number;
  /** How far it travels, in pixels. Negative values come from above. */
  y?: number;
  /** Slide in from the side instead. */
  x?: number;
  duration?: number;
  /** Enable gravity drop effect: starts at y: -40 with overshoot spring physics */
  gravity?: boolean;
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  duration = 0.7,
  gravity = false,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  const startY = gravity ? -40 : y;

  const transitionConfig = gravity
    ? {
        type: "spring",
        stiffness: 120,
        damping: 14,
        mass: 0.9,
        delay,
      }
    : {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: startY, x }
      }
      animate={
        isInView
          ? shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 1, y: 0, x: 0 }
          : shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: startY, x }
      }
      transition={shouldReduceMotion ? { duration: 0.3, delay } : transitionConfig}
    >
      {children}
    </motion.div>
  );
}
