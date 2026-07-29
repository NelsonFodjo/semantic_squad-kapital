"use client";

// ============================================================
// OpportunityCard — one internship on the board.
// ============================================================

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, ArrowRight } from "lucide-react";
import Tag, { TagRow } from "@/components/ui/Tag";
import { hueForSector } from "@/lib/hues";
import {
  formatStipend,
  formatDeadline,
  formatDuration,
  labelKind,
  labelMode,
} from "@/lib/format";
import type { OpportunityWithOrg } from "@/types/database";
import styles from "./OpportunityCard.module.css";

type Props = {
  opportunity: OpportunityWithOrg;
  index?: number;
};

export default function OpportunityCard({ opportunity, index = 0 }: Props) {
  const org = opportunity.organizations;
  const shouldReduceMotion = useReducedMotion();

  const deadlineText = formatDeadline(opportunity.closes_at);
  const isUrgent =
    deadlineText.includes("today") ||
    deadlineText.includes("tomorrow") ||
    /in [1-5] days/.test(deadlineText);

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
          ? { duration: 0.3, delay: index * 0.05 }
          : {
              type: "spring",
              stiffness: 120,
              damping: 14,
              mass: 0.9,
              delay: index * 0.05,
            }
      }
    >
      <Link
        href={`/opportunities/${opportunity.slug}`}
        className={`liquid-glass ${styles.card}`}
        data-hue={hueForSector(opportunity.sector)}
      >
        <div className={styles.top}>
          <span className={styles.org}>
            {org?.name ?? "Employer"}
            {org?.is_verified && (
              <BadgeCheck
                size={15}
                className={styles.verified}
                aria-label="Verified employer"
              />
            )}
          </span>

          <Tag tone="hue">{labelKind(opportunity.kind)}</Tag>
        </div>

        <h3 className={styles.title}>{opportunity.title}</h3>
        <p className={styles.summary}>{opportunity.summary}</p>

        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt className={styles.factLabel}>Stipend</dt>
            <dd
              className={`${styles.factValue} ${
                opportunity.is_paid ? styles.stipend : styles.unpaid
              }`}
            >
              {formatStipend(
                opportunity.is_paid,
                opportunity.stipend_min,
                opportunity.stipend_max,
              )}
            </dd>
          </div>

          <div className={styles.fact}>
            <dt className={styles.factLabel}>Where</dt>
            <dd className={styles.factValue}>
              {opportunity.locality} · {labelMode(opportunity.mode)}
            </dd>
          </div>

          <div className={styles.fact}>
            <dt className={styles.factLabel}>Length</dt>
            <dd className={styles.factValue}>
              {formatDuration(opportunity.duration_weeks)}
            </dd>
          </div>
        </dl>

        {opportunity.skills_required.length > 0 && (
          <TagRow>
            {opportunity.skills_required.slice(0, 3).map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
            {opportunity.skills_required.length > 3 && (
              <Tag tone="outline">+{opportunity.skills_required.length - 3}</Tag>
            )}
          </TagRow>
        )}

        <div className={styles.footer}>
          <span className={isUrgent ? styles.deadlineUrgent : styles.deadline}>
            {deadlineText}
          </span>
          <span className={styles.arrowWrapper}>
            <ArrowRight size={16} className={styles.arrow} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
