"use client";

// ============================================================
// ServicesSection — "What we do", as two video cards.
// ============================================================
// The cards are staggered: index * 0.15 means card one animates at
// 0.2s and card two at 0.35s. Multiplying the delay by the index is
// the standard way to stagger a list without hand-writing each value.

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import styles from "./ServicesSection.module.css";

const cards = [
  {
    tag: "Placements",
    title: "Internships & Jobs",
    text: "Apply to verified, paid internships and graduate roles in Mauritius. Stipends are always stated upfront, so you know exactly what to expect before applying.",
    href: "/opportunities",
    image: "/images/placements.svg",
    hue: "lagoon",
  },
  {
    tag: "Challenges",
    title: "Solve Real Problems",
    text: "Submit solutions to real-world business challenges. Build your reputation and skip the resume screening based on the sheer quality of your reasoning.",
    href: "/challenges",
    image: "/images/challenges.svg",
    hue: "coral",
  },
  {
    tag: "Open Source",
    title: "Collaborative Projects",
    text: "Contribute to open-source software with other students. Gain production-level coding experience, master version control, and build products worth building.",
    href: "/challenges?kind=open_source",
    image: "/images/opensource.svg",
    hue: "palm",
  },
  {
    tag: "Showcase",
    title: "Public Portfolios",
    text: "Publish comprehensive case studies of your completed work. Showcase the problem, the decisions you made, and what you learned to get noticed by top employers.",
    href: "/showcase",
    image: "/images/showcase.svg",
    hue: "orchid",
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />

      <div ref={ref} className={`container ${styles.inner}`}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className={styles.title}>What we do</h2>
          <p className={styles.headerLabel}>Our services</p>
        </motion.div>

        <div className={styles.grid}>
          {cards.map((card, index) => (
            <motion.a
              key={card.title}
              href={card.href}
              className={`liquid-glass hover-lift ${styles.card}`}
              data-hue={card.hue}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              // Each card waits a little longer than the one before it.
              transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
            >
              <div className={styles.videoFrame}>
                <Image
                  className={styles.video}
                  src={card.image}
                  alt={card.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
                <div className={styles.videoGradient} aria-hidden="true" />
              </div>

              <div className={styles.body}>
                <div className={styles.bodyTop}>
                  <span className={styles.tag}>{card.tag}</span>

                  <span className={`liquid-glass ${styles.arrow}`}>
                    <ArrowUpRight size={16} />
                  </span>
                </div>

                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardText}>{card.text}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
