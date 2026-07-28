"use client";

// ============================================================
// TextField — a labelled input box that shows its own error.
// ============================================================
// Give it a `field` from the useField hook and it wires up typing,
// blurring, and the red error text for you.

import type { Field } from "@/hooks/useField";
import styles from "./Field.module.css";

type Props = {
  label: string;
  field: Field;
  type?: "text" | "email" | "password" | "date" | "url" | "tel" | "number";
  placeholder?: string;
  hint?: string; // grey helper text under the box
  optional?: boolean;
  autoComplete?: string;
};

export default function TextField({
  label,
  field,
  type = "text",
  placeholder,
  hint,
  optional = false,
  autoComplete,
}: Props) {
  return (
    // Wrapping the input in a <label> means clicking the text focuses
    // the box, and screen readers announce them together.
    <label className={styles.wrapper}>
      <span className={styles.label}>
        {label}
        {optional && <span className={styles.optional}>optional</span>}
      </span>

      <input
        type={type}
        value={field.value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        // e.target.value is whatever is in the box right now.
        onChange={(e) => field.onChange(e.target.value)}
        // onBlur fires when the user clicks or tabs away.
        onBlur={field.onBlur}
        className={`${styles.control} ${field.showError ? styles.invalid : ""}`}
        // Tells assistive technology the value is rejected.
        aria-invalid={field.showError}
      />

      {/* Show the error if there is one, otherwise the hint.
          aria-live means screen readers announce the error when it
          appears, without the user having to go looking for it. */}
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
