"use client";

// ============================================================
// FeaturedVideoSection — the wide video with an overlaid glass card.
// ============================================================
// This video uses the plain `loop` attribute rather than the hero's
// hand-rolled crossfade. It is smaller and partly covered, so a hard
// loop point is not noticeable — and it keeps the code simple where
// the complexity would buy nothing.

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import styles from "./FeaturedVideoSection.module.css";

export default function FeaturedVideoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          ref={ref}
          className={`liquid-glass hover-lift ${styles.frame}`}
          data-hue="palm"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.9 }}
        >
          <Image
            className={styles.video}
            src="/images/collaboration.svg"
            alt="Collaborative Network"
            fill
            unoptimized
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />

          <div className={styles.gradient} aria-hidden="true" />

          <div className={styles.overlay}>
            <div className={`liquid-glass ${styles.card}`}>
              <p className={styles.cardLabel}>Why Kapital</p>
              <p className={styles.cardBody}>
                Internships shouldn&rsquo;t depend on who you know. Every
                role and challenge here is open, the stipend is stated
                upfront, and what you ship becomes a public case study —
                not a line on a CV no one checks.
              </p>
            </div>

            {/* whileHover and whileTap give the button physical feedback
                without a single line of CSS transition. framer-motion
                handles the spring for us. */}
            <motion.a
              href="/opportunities"
              className={`liquid-glass ${styles.button}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore more
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
