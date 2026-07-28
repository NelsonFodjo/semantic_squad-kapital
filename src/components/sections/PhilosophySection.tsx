"use client";

// ============================================================
// PhilosophySection — "Innovation x Vision".
// ============================================================
// The two columns animate in from opposite sides: the video from the
// left, the text from the right. They meet in the middle, which reads
// as the two halves of the heading coming together.

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import styles from "./PhilosophySection.module.css";

// The two text blocks, kept as data so the markup below stays short.
const blocks = [
  {
    label: "For students",
    body: "A CV alone does not show what you can actually do. Kapital gives you real problems from real employers to solve, with the results published under your name — proof of work employers can check for themselves.",
  },
  {
    label: "For employers",
    body: "Meet the next hire before you offer the role. Post an internship or a challenge, watch how candidates actually work, and skip the guesswork a resume screen can never remove.",
  },
];

export default function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={styles.section}>
      <div ref={ref} className="container">
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          Students <em className={styles.em}>x</em> Employers
        </motion.h2>

        <div className={styles.grid}>
          {/* Negative x = starts to the left of where it belongs, then
              slides right into place. */}
          <motion.div
            className={`liquid-glass hover-lift ${styles.videoFrame}`}
            data-hue="coral"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <Image
              className={styles.video}
              src="/images/innovation.svg"
              alt="Innovation x Vision"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </motion.div>

          <motion.div
            className={styles.blocks}
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            {blocks.map((block, index) => (
              // Fragment lets us return two siblings — the divider and
              // the block — without wrapping them in an extra element
              // that would break the grid gap.
              <div key={block.label}>
                {/* A rule above every block except the first. */}
                {index > 0 && <hr className={styles.divider} />}

                <div style={{ marginTop: index > 0 ? "1.5rem" : 0 }}>
                  <p className={styles.label}>{block.label}</p>
                  <p className={styles.body}>{block.body}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
