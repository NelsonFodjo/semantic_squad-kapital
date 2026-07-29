
// RULES — turn a pattern into a friendly error message.

import { patterns } from "./patterns";

/** The shape every rule below follows. */
export type Rule = (value: string) => string | null;


/** Value must not be empty. */
export const isRequired: Rule = (value) =>
  value.trim() === "" ? "This field is required." : null;


export function checkPattern(pattern: RegExp, message: string): Rule {
  return (value) => (value.trim() === "" || pattern.test(value.trim()) ? null : message);
}

/** Build a rule that checks how long the text is. */
export function checkLength(min: number, max: number): Rule {
  return (value) => {
    const length = value.trim().length;
    if (length === 0) return null;
    if (length < min) return `Please write at least ${min} characters.`;
    if (length > max) return `Please keep this under ${max} characters.`;
    return null;
  };
}

/** Build a rule that checks a number falls inside a range. */
export function checkRange(min: number, max: number): Rule {
  return (value) => {
    if (value.trim() === "") return null;
    const n = Number(value);
    if (Number.isNaN(n)) return "Enter a number.";
    if (n < min || n > max) return `Enter a number between ${min} and ${max}.`;
    return null;
  };
}

/** Run several rules and return the FIRST error found. */
export function checkAll(...rules: Rule[]): Rule {
  return (value) => {
    for (const rule of rules) {
      const error = rule(value);
      if (error) return error; // stop at the first problem
    }
    return null; // nothing complained
  };
}


/**
 * A regex can confirm "2026-02-31" has the right SHAPE, but it has no
 * idea February is short. This catches that.
 */
export function isRealDate(iso: string): boolean {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  // If the day overflowed, JavaScript rolls into the next month and
  // the numbers no longer match what we put in.
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/** True when the date is today or later. Used for deadlines. */
export function isFutureDate(iso: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(iso) >= today;
}


export const emailRule = checkAll(
  isRequired,
  checkPattern(patterns.email, "Enter a valid email, like you@example.com."),
);

export const fullNameRule = checkAll(
  isRequired,
  checkLength(3, 70),
  checkPattern(patterns.fullName, "Enter your first and last name."),
);

export const usernameRule = checkAll(
  isRequired,
  checkPattern(patterns.username, "3-20 characters, starting with a letter."),
);

export const phoneRule = checkAll(
  isRequired,
  checkPattern(patterns.mauritiusPhone, "Use a Mauritian number, like +230 5712 3456."),
);

export const websiteRule = checkPattern(
  patterns.website,
  "Include https:// at the start.",
);

export const githubRule = checkPattern(
  patterns.githubRepo,
  "Link a repository, like https://github.com/owner/repo.",
);

export const linkedinRule = checkPattern(
  patterns.linkedin,
  "Link a profile, like https://linkedin.com/in/yourname.",
);

export const brnRule = checkAll(
  isRequired,
  checkPattern(patterns.brn, "A BRN is the letter C followed by 8 digits."),
);

export const stipendRule = checkPattern(
  patterns.stipend,
  "Whole rupees only — no commas or Rs.",
);

export const weeksRule = checkAll(
  isRequired,
  checkPattern(patterns.weeks, "Enter a number of weeks between 1 and 52."),
);

export const yearOfStudyRule = checkAll(
  isRequired,
  checkPattern(patterns.yearOfStudy, "Enter your year of study, 1 to 6."),
);

export const skillsRule = checkAll(
  isRequired,
  checkPattern(patterns.skillList, "Separate skills with commas, like React, SQL, Figma."),
);

/** A deadline: right shape, a real calendar day, and not in the past. */
export const deadlineRule = checkAll(
  isRequired,
  checkPattern(patterns.date, "Use the format YYYY-MM-DD."),
  (value) => (isRealDate(value.trim()) ? null : "That date is not on the calendar."),
  (value) => (isFutureDate(value.trim()) ? null : "The deadline must be in the future."),
);

/** A past-or-present date, for things like "available from". */
export const dateRule = checkAll(
  isRequired,
  checkPattern(patterns.date, "Use the format YYYY-MM-DD."),
  (value) => (isRealDate(value.trim()) ? null : "That date is not on the calendar."),
);

/** Long-form text: cover notes, proposals, challenge briefs. */
export function longTextRule(min: number, max: number): Rule {
  return checkAll(
    isRequired,
    checkLength(min, max),
    checkPattern(patterns.hasRealWords, "Please write this in words."),
    (value) =>
      patterns.looksLikeHtml.test(value) ? "Please remove any HTML tags." : null,
  );
}

/** Short single-line text: job titles, challenge titles. */
export const titleRule = checkAll(isRequired, checkLength(6, 90));

/** Checks the "confirm password" box matches the real password. */
export function matchesPasswordRule(password: string): Rule {
  return (value) => {
    if (value === "") return "Please confirm your password.";
    return value === password ? null : "Passwords do not match.";
  };
}
