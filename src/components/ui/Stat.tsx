// ============================================================
// Stat — one big number with a label underneath.
// ============================================================
// Used in rows on the home page. The optional `prefix` is the
// dimmed leading zero that makes a stat row look composed:
//
//   <Stat prefix="0" value="48" suffix="+" label="Live internships" />
//   renders as   048+

import styles from "./Stat.module.css";

type Props = {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
};

export default function Stat({ value, label, prefix, suffix }: Props) {
  return (
    <div className={styles.stat}>
      <span className={styles.value}>
        {/* aria-hidden hides the decorative zero from screen readers,
            so they announce "48+" and not "zero forty-eight". */}
        {prefix && (
          <span className={styles.prefix} aria-hidden="true">
            {prefix}
          </span>
        )}
        {value}
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </span>

      <span className={styles.label}>{label}</span>
    </div>
  );
}
