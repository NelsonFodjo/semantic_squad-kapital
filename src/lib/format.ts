// ============================================================
// FORMAT — one place for turning data into readable text.
// ============================================================
// Every page uses these, so money and dates look the same everywhere
// and you only fix a format once.

import type { OpportunityKind, WorkMode, ChallengeKind } from "@/types/database";

/** 15000 -> "Rs 15,000" */
export function formatRupees(amount: number): string {
  return new Intl.NumberFormat("en-MU", {
    style: "currency",
    currency: "MUR",
    maximumFractionDigits: 0,
    // "Rs" reads better than the default "MUR" here.
    currencyDisplay: "narrowSymbol",
  }).format(amount);
}

/**
 * The stipend line shown on a card.
 * Handles all three cases: a range, a single figure, or unpaid.
 */
export function formatStipend(
  isPaid: boolean,
  min: number | null,
  max: number | null,
): string {
  if (!isPaid) return "Unpaid";
  if (min && max && min !== max) return `${formatRupees(min)}–${formatRupees(max)} / month`;
  if (min) return `${formatRupees(min)} / month`;
  return "Stipend on request";
}

/** "2026-09-15" -> "15 Sep 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * A deadline in human terms: "Closes in 6 days".
 * Urgency matters more than the exact date on a list of cards.
 */
export function formatDeadline(iso: string | null): string {
  if (!iso) return "No closing date";

  const deadline = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 86,400,000 = the number of milliseconds in a day.
  const days = Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000);

  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  if (days === 1) return "Closes tomorrow";
  if (days <= 14) return `Closes in ${days} days`;
  return `Closes ${formatDate(iso)}`;
}

/** True when a deadline has passed, so the UI can hide the form. */
export function isClosed(iso: string | null): boolean {
  if (!iso) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(iso) < today;
}

/** "12 weeks", or nothing when the length is open-ended. */
export function formatDuration(weeks: number | null): string {
  if (!weeks) return "Ongoing";
  if (weeks < 4) return `${weeks} week${weeks === 1 ? "" : "s"}`;

  const months = Math.round(weeks / 4.33);
  return `${weeks} weeks (~${months} month${months === 1 ? "" : "s"})`;
}

/* ------------------------------------------------------------ *
 * Turning database enums into readable labels
 * ------------------------------------------------------------ */
// The database stores "part_time"; a person should read "Part-time".

const kindLabels: Record<OpportunityKind, string> = {
  internship: "Internship",
  part_time: "Part-time",
  graduate: "Graduate role",
};

const modeLabels: Record<WorkMode, string> = {
  onsite: "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
};

const challengeKindLabels: Record<ChallengeKind, string> = {
  challenge: "Industry challenge",
  open_source: "Open-source project",
};

export function labelKind(kind: OpportunityKind): string {
  return kindLabels[kind] ?? kind;
}

export function labelMode(mode: WorkMode): string {
  return modeLabels[mode] ?? mode;
}

export function labelChallengeKind(kind: ChallengeKind): string {
  return challengeKindLabels[kind] ?? kind;
}

/** "applied" -> "Applied". Used for status badges. */
export function labelStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
}
