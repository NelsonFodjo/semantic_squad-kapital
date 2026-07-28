// ============================================================
// Tag — a small label. Skills, sectors, statuses, verified ticks.
// ============================================================
//   <Tag>React</Tag>
//   <Tag tone="success">Shortlisted</Tag>
//
// TagRow wraps a group of them:
//   <TagRow><Tag>React</Tag><Tag>SQL</Tag></TagRow>

import styles from "./Tag.module.css";

type Tone =
  | "neutral"
  | "outline"
  | "hue" // takes the colour of the card it sits in
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "solid";

type Props = {
  children: React.ReactNode;
  tone?: Tone;
};

export default function Tag({ children, tone = "neutral" }: Props) {
  return <span className={`${styles.tag} ${styles[tone]}`}>{children}</span>;
}

/** A wrapping row of tags. */
export function TagRow({ children }: { children: React.ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}

/**
 * Picks a colour for an application or proposal status, so the same
 * status always looks the same wherever it appears.
 */
export function statusTone(status: string): Tone {
  switch (status) {
    case "offer":
    case "accepted":
      return "success";
    case "shortlisted":
    case "interview":
      return "accent";
    case "rejected":
    case "withdrawn":
      return "danger";
    default:
      return "neutral"; // applied, submitted
  }
}
