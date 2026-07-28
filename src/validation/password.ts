// ============================================================
// PASSWORD — strength checking, kept in its own file because it is
// the only rule with more than one step.
// ============================================================

import { patterns } from "./patterns";
import type { Rule } from "./rules";

/** One requirement and whether the password met it. */
export type Check = {
  label: string;
  passed: boolean;
};

/**
 * Look at a password and report on each requirement.
 * The signup form shows this list live as the user types, so they
 * can see what is missing instead of guessing.
 */
export function checkPassword(password: string): Check[] {
  return [
    { label: "At least 10 characters", passed: password.length >= 10 },
    { label: "An uppercase letter", passed: patterns.hasUppercase.test(password) },
    { label: "A lowercase letter", passed: patterns.hasLowercase.test(password) },
    { label: "A number", passed: patterns.hasNumber.test(password) },
    { label: "A symbol, like ! or #", passed: patterns.hasSymbol.test(password) },
    {
      label: "No runs like 123 or aaa",
      passed:
        password.length > 0 &&
        !patterns.hasRepeat.test(password) &&
        !patterns.hasSequence.test(password),
    },
  ];
}

/** How many requirements passed, 0 to 6. Drives the strength bar. */
export function passwordScore(password: string): number {
  return checkPassword(password).filter((check) => check.passed).length;
}

/** A word for the score, so the bar has a readable label. */
export function passwordLabel(score: number): string {
  const words = ["Very weak", "Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"];
  return words[score];
}

/** The rule the signup form uses: every requirement must pass. */
export const passwordRule: Rule = (password) => {
  if (password === "") return "Password is required.";
  if (patterns.hasSpace.test(password)) return "Password cannot contain spaces.";
  if (password.length > 128) return "That password is too long.";

  // Name the first missing requirement, rather than a vague
  // "password not strong enough".
  const failed = checkPassword(password).find((check) => !check.passed);
  return failed ? `Password needs: ${failed.label.toLowerCase()}.` : null;
};
