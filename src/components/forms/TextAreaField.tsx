"use client";

// ============================================================
// TextAreaField — the same idea as TextField, but multi-line.
// ============================================================
// Used for cover notes, proposals, and challenge briefs. Shows a
// live character count, which is friendlier than only complaining
// once the user is already over the limit.

import type { Field } from "@/hooks/useField";
import styles from "./Field.module.css";

type Props = {
  label: string;
  field: Field;
  placeholder?: string;
  hint?: string;
  rows?: number;
  /** Used for the counter only. The real limit lives in the rule. */
  maxLength?: number;
  optional?: boolean;
};

export default function TextAreaField({
  label,
  field,
  placeholder,
  hint,
  rows = 6,
  maxLength,
  optional = false,
}: Props) {
  // Warn once past 90% of the limit, so the colour change is a
  // heads-up rather than a surprise.
  const isNearLimit = maxLength ? field.value.length > maxLength * 0.9 : false;

  return (
    <label className={styles.wrapper}>
      <span className={styles.label}>
        {label}
        {optional && <span className={styles.optional}>optional</span>}
      </span>

      <textarea
        value={field.value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => field.onChange(e.target.value)}
        onBlur={field.onBlur}
        className={`${styles.control} ${styles.textarea} ${
          field.showError ? styles.invalid : ""
        }`}
        aria-invalid={field.showError}
      />

      <span className={styles.message} aria-live="polite">
        {/* Left side: the error, or the hint when there is no error. */}
        {field.showError ? (
          <span className={styles.error}>{field.error}</span>
        ) : (
          <span className={styles.hint}>{hint}</span>
        )}

        {/* Right side: the count, only when a limit was given. */}
        {maxLength && (
          <span
            className={`${styles.counter} ${isNearLimit ? styles.counterWarn : ""}`}
          >
            {field.value.length} / {maxLength}
          </span>
        )}
      </span>
    </label>
  );
}
