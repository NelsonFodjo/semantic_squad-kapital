"use client";

// ============================================================
// SpotlightCard — a card with a glow that follows the cursor.
// ============================================================
// Wrap anything and a soft light tracks the pointer across it:
//
//     <SpotlightCard hue="coral">...</SpotlightCard>
//
// How it works: on mousemove we write the pointer's position into two
// CSS variables on the element, and the stylesheet draws a radial
// gradient at that point. Doing it in CSS rather than React state
// means no re-render per mouse pixel — the browser just repaints.

import { useRef } from "react";
import styles from "./SpotlightCard.module.css";

type Props = {
  children: React.ReactNode;
  /** Which colour the spotlight is. Matches the [data-hue] swatches. */
  hue?: "lagoon" | "coral" | "mango" | "palm" | "orchid" | "sky";
  className?: string;
};

export default function SpotlightCard({ children, hue = "lagoon", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const element = ref.current;
    if (!element) return;

    // getBoundingClientRect gives the element's position on screen, so
    // subtracting it converts a page coordinate into one relative to
    // the card's own top-left corner.
    const rect = element.getBoundingClientRect();

    element.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      data-hue={hue}
      onMouseMove={handleMouseMove}
      className={`liquid-glass ${styles.card} ${className}`}
    >
      {/* The glow layer. Sits under the content and ignores clicks. */}
      <span className={styles.spotlight} aria-hidden="true" />

      <div className={styles.content}>{children}</div>
    </div>
  );
}
