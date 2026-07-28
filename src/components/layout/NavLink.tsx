"use client";

// ============================================================
// NavLink — one navbar link that knows whether it is the current page.
// ============================================================
// "use client" means this component runs in the browser. We need it
// because usePathname() reads the URL the visitor is looking at,
// which only exists in the browser.

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavLink.module.css";

type Props = {
  href: string;
  label: string;
  onNavigate?: () => void; // lets the mobile menu close itself
};

export default function NavLink({ href, label, onNavigate }: Props) {
  const pathname = usePathname(); // e.g. "/challenges/water-sensors"

  // "/" must match exactly, or it would light up on every page.
  // Other links also count as active on their sub-pages, so
  // /challenges stays highlighted while reading one challenge.
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      // Two classes joined with a space. The second is only added
      // when this is the active page.
      className={`${styles.link} ${isActive ? styles.active : ""}`}
      // Tells screen readers "this is the page you are on".
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
