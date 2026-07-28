// ============================================================
// OpportunityCard — one internship on the board.
// ============================================================
// Receives data and draws it: no state, no fetching. That keeps it
// reusable on the board, the employer page and the dashboard.
//
// The one clever bit is data-hue. hueForSector turns "Ocean Economy"
// into "lagoon", the [data-hue] rule in base.css turns that into a set
// of CSS variables, and every colour in the stylesheet reads those.
// Result: the same sector is always the same colour, site-wide.

import Link from "next/link";
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
};

export default function OpportunityCard({ opportunity }: Props) {
  const org = opportunity.organizations;

  // Turn the deadline red once it is close, so an urgent listing is
  // obvious without reading the date.
  const deadlineText = formatDeadline(opportunity.closes_at);
  const isUrgent =
    deadlineText.includes("today") ||
    deadlineText.includes("tomorrow") ||
    /in [1-5] days/.test(deadlineText);

  return (
    // The whole card is one link, so the entire area is clickable.
    <Link
      href={`/opportunities/${opportunity.slug}`}
      className={`liquid-glass ${styles.card}`}
      data-hue={hueForSector(opportunity.sector)}
    >
      <div className={styles.top}>
        <span className={styles.org}>
          {org?.name ?? "Employer"}
          {/* A tick students can trust: set by an admin after the BRN is
              checked, not by the employer themselves. */}
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

      {/* A definition list is the right markup: each row is a term and
          its value. */}
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

      {/* At most three skills — more than that stops being scannable.
          slice() is safe on a shorter array. */}
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

        <span className={styles.arrow}>
          <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}
