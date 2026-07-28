// ============================================================
// Footer — the bottom of every page.
// ============================================================
// No "use client" here: there is no state or click handling, so
// Next.js renders this on the server. That ships less JavaScript to
// the visitor, which matters on mobile data.

import Link from "next/link";
// Note: lucide-react v1 removed all brand icons (Instagram, Twitter,
// GitHub…) for trademark reasons, so these are the generic stand-ins.
// If you want the real marks, drop the official SVGs into
// src/components/icons/ and swap them in here.
import { Camera, AtSign } from "lucide-react";
import { mainNav, authNav, legalNav } from "@/data/navigation";
import Logo from "@/components/ui/Logo";
import styles from "./Footer.module.css";

// Built from the shared nav lists, so the footer can never drift out
// of sync with the navbar.
const columns = [
  { title: "Explore", items: mainNav },
  { title: "Account", items: authNav },
  { title: "Legal", items: legalNav },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div>
            <p className={styles.wordmark}>
              <Logo size={26} />
              Kapital
            </p>
            <p className={styles.tagline}>
              Internships, industry challenges, and open-source projects for
              Mauritian students.
            </p>
          </div>

          <div className={styles.columns}>
            {columns.map((column) => (
              <div key={column.title}>
                <p className={styles.columnTitle}>{column.title}</p>

                <ul className={styles.list}>
                  {column.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={styles.link}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          {/* new Date() runs on the server at request time, so the year
              never goes stale. */}
          <span>© {new Date().getFullYear()} Kapital · Built in Mauritius</span>
        </div>
      </div>
    </footer>
  );
}
