"use client";

// ============================================================
// ScrollProgress — the thin gradient bar across the top of the page.
// ============================================================
// Shows how far down the page you are. Cheap to add, and on long pages
// it makes scrolling feel like it is going somewhere.
//
// useScroll gives a value from 0 (top) to 1 (bottom). useSpring then
// smooths it, so the bar glides instead of jittering with the wheel.

import { motion, useScroll, useSpring } from "framer-motion";
import styles from "./ScrollProgress.module.css";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  // stiffness/damping tune the spring: higher stiffness snaps faster,
  // higher damping settles with less wobble. restDelta stops the
  // animation once it is within a hair of the target.
  const width = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    // scaleX animates on the compositor — much cheaper than animating
    // width, which would force a layout on every frame.
    <motion.div
      className={styles.bar}
      style={{ scaleX: width }}
      aria-hidden="true"
    />
  );
}
