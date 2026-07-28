"use client";

// ============================================================
// Reveal — fades and slides its children in on scroll.
// ============================================================
// A wrapper so any page can get the scroll-reveal effect without
// repeating the useRef/useInView/motion boilerplate five times:
//
//     <Reveal delay={0.1}>
//       <h2>Anything at all</h2>
//     </Reveal>
//
// It is a client component, which means a server page CAN still use
// it: the page stays on the server and only this wrapper ships JS.

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Props = {
  children: React.ReactNode;
  /** Seconds to wait before starting. Stagger a list by passing index * 0.08. */
  delay?: number;
  /** How far it travels, in pixels. Negative values come from above. */
  y?: number;
  /** Slide in from the side instead. */
  x?: number;
  duration?: number;
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  duration = 0.7,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // once: true  -> animates in and stays. Replaying on every scroll
  //                past gets irritating quickly.
  // margin      -> shrinks the trigger box so the reveal fires just
  //                after the element appears, not the instant its top
  //                edge crosses the fold.
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
