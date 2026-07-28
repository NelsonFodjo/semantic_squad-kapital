"use client";

// ============================================================
// SelectField — a dropdown that validates like the text inputs.
// ============================================================
// Used for institution, faculty, sector, locality, and work mode.

import type { Field } from "@/hooks/useField";
import styles from "./Field.module.css";

type Props = {
  label: string;
  field: Field;
  /** The choices. Strings are used as both value and visible text. */
  options: readonly string[];
  /** The greyed-out first row, e.g. "Choose your faculty". */
  placeholder?: string;
  hint?: string;
  optional?: boolean;
};

export default function SelectField({
  label,
  field,
  options,
  placeholder = "Choose one",
  hint,
  optional = false,
}: Props) {
  return (
    <label className={styles.wrapper}>
      <span className={styles.label}>
        {label}
        {optional && <span className={styles.optional}>optional</span>}
      </span>

      <select
        value={field.value}
        onChange={(e) => field.onChange(e.target.value)}
        onBlur={field.onBlur}
        className={`${styles.control} ${styles.select} ${
          field.showError ? styles.invalid : ""
        }`}
        aria-invalid={field.showError}
      >
        {/* An empty value means "nothing chosen", so the required
            rule catches it like an empty text box. */}
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <span className={styles.message} aria-live="polite">
        {field.showError ? (
          <span className={styles.error}>{field.error}</span>
        ) : (
          hint && <span className={styles.hint}>{hint}</span>
        )}
      </span>
    </label>
  );
}
