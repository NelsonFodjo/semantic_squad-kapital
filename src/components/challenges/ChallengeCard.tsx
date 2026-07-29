"use client";

// ============================================================
// ChallengeCard — one industry challenge or open-source project.
// ============================================================

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Tag, { TagRow } from "@/components/ui/Tag";
import { formatDeadline, labelChallengeKind, getChallengeCoverImage } from "@/lib/format";
import type { ChallengeWithOrg } from "@/types/database";
import styles from "./ChallengeCard.module.css";

type Props = {
  challenge: ChallengeWithOrg;
  index?: number;
};

export default function ChallengeCard({ challenge, index = 0 }: Props) {
  const org = challenge.organizations;
  const isOpenSource = challenge.kind === "open_source";
  const defaultImage = isOpenSource ? "/images/opensource.svg" : "/images/challenges.svg";
  const shouldReduceMotion = useReducedMotion();

  const [imgSrc, setImgSrc] = useState(getChallengeCoverImage(challenge));

  const deadlineText = formatDeadline(challenge.deadline);
  const isUrgent =
    deadlineText.includes("today") ||
    deadlineText.includes("tomorrow") ||
    /in [1-7] days/.test(deadlineText);

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -40 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
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
          ? { duration: 0.3, delay: index * 0.06 }
          : {
              type: "spring",
              stiffness: 120,
              damping: 14,
              mass: 0.9,
              delay: index * 0.06,
            }
      }
    >
      <Link
        href={`/challenges/${challenge.slug}`}
        className={`liquid-glass ${styles.card} ${isOpenSource ? styles.openSource : ""}`}
      >
        <div className={styles.imageFrame}>
          <Image
            src={imgSrc}
            alt={challenge.title}
            fill
            unoptimized
            onError={() => setImgSrc(defaultImage)}
            style={{ objectFit: "cover" }}
            className={styles.image}
          />
        </div>

        <div className={styles.top}>
          <span className={styles.org}>
            {org?.name ?? "Organisation"}
            {org?.is_verified && (
              <span className={styles.verified} title="Verified organisation">
                ✓
              </span>
            )}
          </span>

          <Tag tone={isOpenSource ? "warning" : "accent"}>
            {labelChallengeKind(challenge.kind)}
          </Tag>
        </div>

        <h3 className={styles.title}>{challenge.title}</h3>
        <p className={styles.summary}>{challenge.summary}</p>

        {challenge.reward && (
          <p className={styles.reward}>
            <span className={styles.rewardLabel}>Reward</span>
            <span className={styles.rewardValue}>{challenge.reward}</span>
          </p>
        )}

        {challenge.skills.length > 0 && (
          <TagRow>
            {challenge.skills.slice(0, 3).map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
            {challenge.skills.length > 3 && (
              <Tag tone="outline">+{challenge.skills.length - 3}</Tag>
            )}
          </TagRow>
        )}

        <div className={styles.footer}>
          <span className={isUrgent ? styles.deadlineUrgent : styles.deadline}>
            {deadlineText}
          </span>

          <span className={styles.team}>
            {challenge.team_size_max > 1
              ? `Teams up to ${challenge.team_size_max}`
              : "Solo"}
          </span>

          <span className={styles.arrow}>→</span>
        </div>
      </Link>
    </motion.div>
  );
}
