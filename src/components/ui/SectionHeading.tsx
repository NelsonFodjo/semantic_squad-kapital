// ============================================================
// SectionHeading — the title block above a page section.
// ============================================================
// Used on every list page so section headings look identical.
// `action` is an optional slot on the right, usually a "View all"
// button.

import styles from "./SectionHeading.module.css";

type Props = {
  title: string;
  eyebrow?: string; // small uppercase label above the title
  description?: string;
  action?: React.ReactNode;
  /** Renders as <h1> on pages where this is the page title. */
  as?: "h1" | "h2";
};

export default function SectionHeading({
  title,
  eyebrow,
  description,
  action,
  as = "h2",
}: Props) {
  // Choosing the tag from a prop keeps the heading order correct:
  // one <h1> per page, <h2> for the sections inside it.
  const Title = as;

  return (
    <div className={`${styles.heading} ${action ? styles.withAction : ""}`}>
      <div>
        {eyebrow && (
          <p className={`eyebrow ${styles.eyebrowSpacing}`}>{eyebrow}</p>
        )}

        <Title className={styles.title}>{title}</Title>

        {description && <p className={styles.description}>{description}</p>}
      </div>

      {/* Only rendered if the page passed something in. */}
      {action && <div>{action}</div>}
    </div>
  );
}
