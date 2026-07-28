"use client";

// ============================================================
// PasswordChecklist — the strength bar and live requirement list.
// ============================================================
// Sits under the password box on signup. Shows what is still missing
// as the user types, rather than rejecting them after the fact.

import {
  checkPassword,
  passwordScore,
  passwordLabel,
} from "@/validation/password";
import styles from "./PasswordChecklist.module.css";

type Props = {
  password: string;
};

export default function PasswordChecklist({ password }: Props) {
  // Nothing to say until they start typing.
  if (password === "") return null;

  const checks = checkPassword(password);
  const score = passwordScore(password); // 0 to 6

  // Pick the colour band for the filled segments.
  const band = score <= 2 ? styles.weak : score <= 4 ? styles.medium : styles.strong;

  return (
    <div className={styles.wrapper}>
      {/* Six segments. Array.from builds the list; a segment is
          coloured when its index is below the score. */}
      <div className={styles.track} aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <span
            key={index}
            className={`${styles.segment} ${index < score ? band : ""}`}
          />
        ))}
      </div>

      {/* role="status" lets screen reader users hear the strength
          change without the list being read out on every keystroke. */}
      <p className={styles.label} role="status">
        Password strength: {passwordLabel(score)}
      </p>

      <ul className={styles.list}>
        {checks.map((check) => (
          <li
            key={check.label}
            className={`${styles.item} ${check.passed ? styles.itemPassed : ""}`}
          >
            <span className={styles.marker} aria-hidden="true">
              {check.passed ? "✓" : "○"}
            </span>
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
