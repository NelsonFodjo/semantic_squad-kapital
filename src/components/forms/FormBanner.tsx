// ============================================================
// FormBanner — the message box above or below a form.
// ============================================================
// Three tones: "error" for a failed submit (usually straight from
// Supabase), "success" for a completed one, "info" for guidance.

import styles from "./FormBanner.module.css";

type Props = {
  tone: "error" | "success" | "info";
  title: string;
  children?: React.ReactNode;
};

// The symbol shown for each tone.
const icons = {
  error: "!",
  success: "✓",
  info: "i",
};

export default function FormBanner({ tone, title, children }: Props) {
  return (
    <div
      className={`${styles.banner} ${styles[tone]}`}
      // "alert" interrupts a screen reader immediately, which is right
      // for an error. "status" waits politely, right for the others.
      role={tone === "error" ? "alert" : "status"}
    >
      <span className={styles.icon} aria-hidden="true">
        {icons[tone]}
      </span>

      <div>
        <p className={styles.title}>{title}</p>
        {children && <p className={styles.body}>{children}</p>}
      </div>
    </div>
  );
}
