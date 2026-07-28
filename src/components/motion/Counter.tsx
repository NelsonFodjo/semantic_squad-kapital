"use client";

// ============================================================
// Counter — a number that counts up when it scrolls into view.
// ============================================================
//     <Counter to={48} suffix="+" />
//
// It counts with requestAnimationFrame rather than setInterval,
// because rAF is tied to the screen's refresh rate: the number moves
// in step with the display instead of stuttering against it.

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type Props = {
  to: number;
  /** How long the count takes, in milliseconds. */
  duration?: number;
  prefix?: string;
  suffix?: string;
};

export default function Counter({ to, duration = 1400, prefix, suffix }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const [value, setValue] = useState(0);

  useEffect(() => {
    // Do nothing until it is actually on screen.
    if (!isInView) return;

    // Someone who asked for reduced motion should just see the final
    // number rather than watch it spin.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    let frame: number;
    const start = performance.now();

    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);

      // Ease-out cubic. Without easing the count runs at a constant
      // rate and stops dead, which feels mechanical; this decelerates
      // into the final value.
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round(to * eased));

      if (progress < 1) frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);

    // Cancel if the component unmounts mid-count.
    return () => cancelAnimationFrame(frame);
  }, [isInView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
