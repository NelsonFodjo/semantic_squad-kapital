"use client";

// ============================================================
// ServicesSection — "What we do", as interactive 3D video/SVG cards.
// ============================================================

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles, Code2, Briefcase, Trophy } from "lucide-react";
import Image from "next/image";
import SpotlightCard from "@/components/motion/SpotlightCard";
import styles from "./ServicesSection.module.css";

const cards = [
  {
    tag: "Placements",
    title: "Internships & Jobs",
    text: "Apply to verified, paid internships and graduate roles in Mauritius. Stipends are always stated upfront, so you know exactly what to expect before applying.",
    href: "/opportunities",
    image: "/images/placements.svg",
    hue: "lagoon" as const,
    icon: Briefcase,
  },
  {
    tag: "Challenges",
    title: "Solve Real Problems",
    text: "Submit solutions to real-world business challenges. Build your reputation and skip the resume screening based on the sheer quality of your reasoning.",
    href: "/challenges",
    image: "/images/challenges.svg",
    hue: "coral" as const,
    icon: Trophy,
  },
  {
    tag: "Open Source",
    title: "Collaborative Projects",
    text: "Contribute to open-source software with other students. Gain production-level coding experience, master version control, and build products worth building.",
    href: "/challenges?kind=open_source",
    image: "/images/opensource.svg",
    hue: "palm" as const,
    icon: Code2,
  },
  {
    tag: "Showcase",
    title: "Public Portfolios",
    text: "Publish comprehensive case studies of your completed work. Showcase the problem, the decisions you made, and what you learned to get noticed by top employers.",
    href: "/showcase",
    image: "/images/showcase.svg",
    hue: "orchid" as const,
    icon: Sparkles,
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />

      <div ref={ref} className={`container ${styles.inner}`}>
        <motion.div
          className={styles.header}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -40 }}
          animate={
            isInView
              ? shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0 }
              : shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -40 }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0.4 }
              : { type: "spring", stiffness: 120, damping: 14, mass: 0.9 }
          }
        >
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            Our services
          </motion.p>
          <h2 className={styles.title}>What we do</h2>
        </motion.div>

        <div className={styles.grid}>
          {cards.map((card, index) => {
            const Icon = card.icon;
            const isHovered = activeCard === card.title;

            return (
              <motion.a
                key={card.title}
                href={card.href}
                className={styles.cardLink}
                onMouseEnter={() => setActiveCard(card.title)}
                onMouseLeave={() => setActiveCard(null)}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -40 }}
                whileInView={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0 }
                }
                viewport={{ once: true, amount: 0.3 }}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: -6,
                        transition: { type: "spring", stiffness: 400, damping: 17 },
                      }
                }
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.3, delay: index * 0.08 }
                    : {
                        type: "spring",
                        stiffness: 120,
                        damping: 14,
                        mass: 0.9,
                        delay: index * 0.08,
                      }
                }
              >
                <SpotlightCard hue={card.hue} className={styles.cardInner}>
                  <div className={styles.videoFrame}>
                    <motion.div
                      animate={{ scale: isHovered ? 1.08 : 1 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className={styles.imageWrapper}
                    >
                      <Image
                        className={styles.video}
                        src={card.image}
                        alt={card.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                      />
                    </motion.div>
                    <div className={styles.videoGradient} aria-hidden="true" />
                  </div>

                  <div className={styles.body}>
                    <div className={styles.bodyTop}>
                      <div className={styles.tagWrapper}>
                        <Icon size={14} className={styles.tagIcon} />
                        <span className={styles.tag}>{card.tag}</span>
                      </div>

                      <motion.span
                        className={`liquid-glass ${styles.arrow}`}
                        animate={{
                          rotate: isHovered ? 45 : 0,
                          scale: isHovered ? 1.15 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <ArrowUpRight size={16} />
                      </motion.span>
                    </div>

                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.text}>{card.text}</p>
                  </div>
                </SpotlightCard>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
