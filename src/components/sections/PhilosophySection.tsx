"use client";

// ============================================================
// PhilosophySection — "Students x Employers".
// ============================================================

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Building2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import SpotlightCard from "@/components/motion/SpotlightCard";
import styles from "./PhilosophySection.module.css";

const blocks = [
  {
    hue: "coral" as const,
    label: "For students",
    icon: GraduationCap,
    body: "A CV alone does not show what you can actually do. Kapital gives you real problems from real employers to solve, with the results published under your name — proof of work employers can check for themselves.",
    perks: ["Verified proof of work", "Transparent stipends", "Public portfolio case studies"],
  },
  {
    hue: "lagoon" as const,
    label: "For employers",
    icon: Building2,
    body: "Meet the next hire before you offer the role. Post an internship or a challenge, watch how candidates actually work, and skip the guesswork a resume screen can never remove.",
    perks: ["Evaluate real reasoning", "No resume guesswork", "Direct campus talent pipeline"],
  },
];

export default function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
          {/* Left Column: Image with magnetic 3D frame */}
          <motion.div
            className={styles.videoFrameContainer}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <SpotlightCard hue="coral" className={styles.videoFrameCard}>
              <div className={styles.videoFrameInner}>
                <Image
                  className={styles.video}
                  src="/images/innovation.svg"
                  alt="Innovation x Vision"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
                <div className={styles.gradientOverlay} />
                <div className={styles.badge}>
                  <p className={styles.badgeLabel}>Innovation x Vision</p>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Right Column: Interactive cards for Students & Employers */}
          <div className={styles.blocks}>
            {blocks.map((block, index) => {
              const BlockIcon = block.icon;
              const isHovered = hoveredCard === block.label;

              return (
                <motion.div
                  key={block.label}
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
                  onMouseEnter={() => setHoveredCard(block.label)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <SpotlightCard hue={block.hue} className={styles.blockCard}>
                    <div className={styles.blockHeader}>
                      <div className={styles.iconBadge}>
                        <BlockIcon size={20} className={styles.blockIcon} />
                      </div>
                      <p className={styles.label}>{block.label}</p>
                    </div>

                    <p className={styles.body}>{block.body}</p>

                    <div className={styles.perksList}>
                      {block.perks.map((perk) => (
                        <div key={perk} className={styles.perkItem}>
                          <CheckCircle2 size={14} className={styles.checkIcon} />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
