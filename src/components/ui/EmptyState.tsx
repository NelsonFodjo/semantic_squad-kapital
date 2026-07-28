// ============================================================
// EmptyState — what to show when a list has nothing in it.
// ============================================================
// An empty page looks broken. This says "nothing here yet, and here
// is what to do about it", which is much better than blank space.

import Button from "./Button";
import styles from "./EmptyState.module.css";

type Props = {
  title: string;
  body?: string;
  /** Optional button, e.g. "Clear filters" or "Post a role". */
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  title,
  body,
  actionLabel,
  actionHref,
}: Props) {
  return (
    <div className={styles.empty}>
      <p className={styles.title}>{title}</p>

      {body && <p className={styles.body}>{body}</p>}

      {/* Only render the button if both a label and a link were given. */}
      {actionLabel && actionHref && (
        <div className={styles.action}>
          <Button href={actionHref} variant="secondary" size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
