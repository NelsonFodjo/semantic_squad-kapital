"use client";

// ============================================================
// AboutSection — "About Kapital".
// ============================================================

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SpotlightCard from "@/components/motion/SpotlightCard";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />
      <span className={`aurora ${styles.auroraCenter}`} aria-hidden="true" />

      <div ref={ref} className={`container ${styles.inner}`}>
        <SpotlightCard hue="mango" className={styles.glassBanner}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <p className="eyebrow">About Kapital</p>
          </motion.div>

          <motion.h2
            className={styles.heading}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.12 }}
          >
            Connecting <em className={styles.emHighlight}>Mauritian students</em> with{" "}
            <span className={styles.lineBreak} />
            <em className={styles.em}>real internships and industry work.</em>
          </motion.h2>
        </SpotlightCard>
      </div>
    </section>
  );
}
