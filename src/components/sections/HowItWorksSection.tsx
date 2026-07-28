"use client";

// ============================================================
// HowItWorksSection — interactive three-step journey.
// ============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { UserCircle, Send, Sparkles, ArrowRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import SpotlightCard from "@/components/motion/SpotlightCard";
import styles from "./HowItWorksSection.module.css";

const steps = [
  {
    hue: "lagoon" as const,
    Icon: UserCircle,
    stepNum: "01",
    title: "Build your profile",
    body: "Verify with your university email, list your skills, attach your CV once. After that, applying to anything takes two clicks.",
  },
  {
    hue: "orchid" as const,
    Icon: Send,
    stepNum: "02",
    title: "Apply or propose",
    body: "Go for a posted internship, or answer an open industry challenge with your own proposal — solo or as a team.",
  },
  {
    hue: "mango" as const,
    Icon: Sparkles,
    stepNum: "03",
    title: "Ship something real",
    body: "Selected work gets published in the showcase with your name on it. That becomes the portfolio employers actually read.",
  },
];

export default function HowItWorksSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className={styles.section}>
      <span className={`aurora ${styles.aurora1}`} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <Reveal>
          <p className="eyebrow">How it works</p>
          <h2 className={styles.heading}>
            Three steps, <em>no gatekeeping</em>.
          </h2>
        </Reveal>

        <div className={styles.grid}>
          {steps.map((step, index) => {
            const StepIcon = step.Icon;
            const isHovered = hoveredIndex === index;

            return (
              <Reveal key={step.title} delay={index * 0.12}>
                <div
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={styles.cardContainer}
                >
                  <SpotlightCard hue={step.hue} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <motion.span
                        className={styles.step}
                        animate={{
                          scale: isHovered ? 1.15 : 1,
                          rotate: isHovered ? [0, -5, 5, 0] : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {step.stepNum}
                      </motion.span>

                      <motion.div
                        className={styles.iconContainer}
                        animate={{
                          scale: isHovered ? 1.2 : 1,
                          rotate: isHovered ? 12 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 250 }}
                      >
                        <StepIcon className={styles.stepIcon} size={24} />
                      </motion.div>
                    </div>

                    <h3 className={styles.title}>{step.title}</h3>
                    <p className={styles.body}>{step.body}</p>

                    <div className={styles.cardFooter}>
                      <span className={styles.learnMore}>Step {step.stepNum}</span>
                      <motion.div
                        animate={{ x: isHovered ? 6 : 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <ArrowRight size={18} className={styles.arrowIcon} />
                      </motion.div>
                    </div>
                  </SpotlightCard>

                  {index < steps.length - 1 && (
                    <div className={styles.connector} aria-hidden="true">
                      <div className={styles.connectorLine} />
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
