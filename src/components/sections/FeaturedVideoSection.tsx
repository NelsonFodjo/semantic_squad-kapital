"use client";

// ============================================================
// FeaturedVideoSection — "Why Kapital / Collaborative Network".
// ============================================================

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import SpotlightCard from "@/components/motion/SpotlightCard";
import styles from "./FeaturedVideoSection.module.css";

export default function FeaturedVideoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          ref={ref}
          className={styles.frameContainer}
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.9 }}
        >
          <SpotlightCard hue="palm" className={styles.frame}>
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
              <SpotlightCard hue="palm" className={styles.card}>
                <div className={styles.labelWrapper}>
                  <Sparkles size={14} className={styles.sparkleIcon} />
                  <p className={styles.cardLabel}>Why Kapital</p>
                </div>
                <p className={styles.cardBody}>
                  Internships shouldn&rsquo;t depend on who you know. Every
                  role and challenge here is open, the stipend is stated
                  upfront, and what you ship becomes a public case study —
                  not a line on a CV no one checks.
                </p>
              </SpotlightCard>

              <motion.a
                href="/opportunities"
                className={`liquid-glass ${styles.button}`}
                whileHover={{ scale: 1.08, x: 4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 15 }}
              >
                <span>Explore opportunities</span>
                <ArrowRight size={18} />
              </motion.a>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  );
}
