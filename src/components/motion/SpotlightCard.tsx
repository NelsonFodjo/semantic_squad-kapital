"use client";

// ============================================================
// SpotlightCard — a 3D magnetic card with a cursor-following glow.
// ============================================================
// Wrap any content in <SpotlightCard hue="lagoon"> to give it 3D tilt,
// magnetic depth, dynamic light sweep, and spring animations on hover.

import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import styles from "./SpotlightCard.module.css";

type Props = {
  children: React.ReactNode;
  /** Which colour the spotlight is. Matches the [data-hue] swatches. */
  hue?: "lagoon" | "coral" | "mango" | "palm" | "orchid" | "sky";
  className?: string;
  enableTilt?: boolean;
};

export default function SpotlightCard({
  children,
  hue = "lagoon",
  className = "",
  enableTilt = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Spring options for silky smooth 3D tilt & reset
  const springConfig = { stiffness: 260, damping: 20 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Update CSS variables for spotlight position
    element.style.setProperty("--spot-x", `${x}px`);
    element.style.setProperty("--spot-y", `${y}px`);

    if (enableTilt) {
      // Calculate normalized coordinates (-0.5 to 0.5)
      const normX = x / rect.width - 0.5;
      const normY = y / rect.height - 0.5;

      // Calculate tilt angles (max 12 deg)
      rotateX.set(-normY * 12);
      rotateY.set(normX * 12);
    }
  }

  function handleMouseEnter() {
    setIsHovered(true);
    if (enableTilt) {
      scale.set(1.025);
    }
  }

  function handleMouseLeave() {
    setIsHovered(false);
    if (enableTilt) {
      rotateX.set(0);
      rotateY.set(0);
      scale.set(1);
    }
  }

  return (
    <motion.div
      ref={ref}
      data-hue={hue}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        scale: enableTilt ? scale : 1,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`liquid-glass ${styles.card} ${className}`}
    >
      {/* Dynamic light sweep & spotlight layer */}
      <span className={styles.spotlight} aria-hidden="true" />
      <span
        className={styles.ambientBeam}
        data-hover={isHovered}
        aria-hidden="true"
      />

      <div
        className={styles.content}
        style={{ transform: "translateZ(20px)" }}
      >
        {children}
      </div>
    </motion.div>
  );
}
