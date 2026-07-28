"use client";

// ============================================================
// AboutSection — the first block below the hero.
// ============================================================
// Introduces the scroll-reveal pattern the rest of the page reuses:
//
//   useRef      -> points at the element we are watching
//   useInView   -> true once that element scrolls into view
//   animate     -> switches between two states based on that boolean
//
// `once: true` means it animates in and then stays — it does not
// replay every time you scroll past, which gets irritating fast.
//
// `margin: "-100px"` shrinks the trigger area by 100px, so the reveal
// fires slightly after the element enters the viewport rather than the
// instant its top edge appears.

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />

      <div ref={ref} className={`container ${styles.inner}`}>
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          About Kapital
        </motion.p>

        {/* The heading arrives a beat after the label, and travels
            further. Staggering the two makes the block feel composed
            rather than everything snapping in at once. */}
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Connecting <em className={styles.em}>Mauritian students</em> with
          <span className={styles.lineBreak} />{" "}
          <em className={styles.em}>real internships and industry work.</em>
        </motion.h2>
      </div>
    </section>
  );
}
