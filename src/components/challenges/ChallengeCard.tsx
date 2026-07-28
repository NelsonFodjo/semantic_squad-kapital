// ============================================================
// ChallengeCard — one industry challenge or open-source project.
// ============================================================

import Link from "next/link";
import Tag, { TagRow } from "@/components/ui/Tag";
import { formatDeadline, labelChallengeKind } from "@/lib/format";
import type { ChallengeWithOrg } from "@/types/database";
import styles from "./ChallengeCard.module.css";

type Props = {
  challenge: ChallengeWithOrg;
};

export default function ChallengeCard({ challenge }: Props) {
  const org = challenge.organizations;
  const isOpenSource = challenge.kind === "open_source";

  const deadlineText = formatDeadline(challenge.deadline);
  const isUrgent =
    deadlineText.includes("today") ||
    deadlineText.includes("tomorrow") ||
    /in [1-7] days/.test(deadlineText);

  return (
    <Link
      href={`/challenges/${challenge.slug}`}
      className={`liquid-glass ${styles.card} ${isOpenSource ? styles.openSource : ""}`}
    >
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

      {/* Not every challenge offers a reward, so only draw this when
          there is one. */}
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

        {/* Teams are allowed on some challenges and not others. */}
        <span className={styles.team}>
          {challenge.team_size_max > 1
            ? `Teams up to ${challenge.team_size_max}`
            : "Solo"}
        </span>

        <span className={styles.arrow}>→</span>
      </div>
    </Link>
  );
}
