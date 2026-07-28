// ============================================================
// NAVIGATION — the one list of links the whole site is built from.
// ============================================================
// Add a link here and it appears in the navbar and the footer.
//
// `href` must match a folder in src/app/, because that is how
// routing works in Next.js — the folder name IS the URL:
//
//     src/app/challenges/page.tsx   ->   /challenges
//
// There is no routes config file to keep in sync.

export type NavItem = {
  href: string;
  label: string;
  /** Short line used on the home page link cards. */
  blurb?: string;
};

/** The main links, shown in the middle of the navbar. */
export const mainNav: NavItem[] = [
  {
    href: "/opportunities",
    label: "Opportunities",
    blurb: "Internships and graduate roles from Mauritian employers.",
  },
  {
    href: "/challenges",
    label: "Challenges",
    blurb: "Real industry problems and open-source projects to solve.",
  },
  {
    href: "/showcase",
    label: "Showcase",
    blurb: "Work students have shipped, published as case studies.",
  },
  {
    href: "/about",
    label: "About",
    blurb: "Why this platform exists and who it is for.",
  },
];

/** Account links, shown on the right of the navbar. */
export const authNav: NavItem[] = [
  { href: "/login", label: "Log in" },
  { href: "/signup", label: "Join free" },
];

/** Footer-only small print. */
export const legalNav: NavItem[] = [
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];
