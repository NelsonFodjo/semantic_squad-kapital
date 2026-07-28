"use client";

// ============================================================
// Navbar — the floating glass pill at the top of every page.
// ============================================================
// Links come from src/data/navigation.ts, so you never edit this file
// to add a page.
//
// One behaviour worth knowing: the bar is sticky and behaves the same
// on every page, including the landing page — no video-only colour
// switching, no solid backing on the header itself. The only surface
// is the liquid-glass pill inside it, the same subtle tint-and-blur
// every panel in this design uses, so it always reads correctly
// against page content or the hero video without adding a background
// box that pushes the page down.
//
// The right-hand actions depend on session state: signed-out visitors
// see Sign Up / Login, signed-in ones see Dashboard / Log out instead.
// Session state is read on the client and kept in sync with
// onAuthStateChange, so logging in or out anywhere updates the bar
// without a full page reload.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import Logo from "@/components/ui/Logo";
import NavLink from "./NavLink";
import ThemeToggle from "./ThemeToggle";
import { mainNav } from "@/data/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Undefined = "still checking", so the bar renders neither state
  // until we actually know — avoids a flash of the wrong links.
  const [user, setUser] = useState<User | null | undefined>(undefined);

  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Keeps the bar in sync when auth state changes in another tab,
    // or right after this page signs in or out.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function handleLogOut() {
    close();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isSignedIn = Boolean(user);

  return (
    <header className={styles.header}>
      <div className={`liquid-glass ${styles.pill}`}>
        <div className={styles.left}>
          <Link href="/" className={styles.brand}>
            <Logo size={24} />
            Kapital
          </Link>

          {/* Desktop links */}
          <nav className={styles.links} aria-label="Main">
            {mainNav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
        </div>

        {/* Desktop actions */}
        <div className={styles.actions}>
          <ThemeToggle />

          {isSignedIn ? (
            <>
              <Link href="/dashboard" className={styles.textLink}>
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogOut}
                className={`liquid-glass ${styles.pillButton}`}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/signup" className={styles.textLink}>
                Sign Up
              </Link>
              <Link
                href="/login"
                className={`liquid-glass ${styles.pillButton}`}
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Burger, phones only */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={styles.burger}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* The panel is only added to the page while it is open. */}
      {isOpen && (
        <nav
          id="mobile-menu"
          className={`liquid-glass ${styles.mobilePanel}`}
          aria-label="Mobile"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={`${styles.mobileLink} ${
                pathname.startsWith(item.href) ? styles.mobileLinkActive : ""
              }`}
            >
              {item.label}
            </Link>
          ))}

          <hr className={styles.mobileDivider} />

          {isSignedIn ? (
            <>
              <Link href="/dashboard" onClick={close} className={styles.mobileLink}>
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogOut}
                className={styles.mobileLink}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={close} className={styles.mobileLink}>
                Log in
              </Link>
              <Link href="/signup" onClick={close} className={styles.mobileLink}>
                Join free
              </Link>
            </>
          )}

          <div className={styles.mobileThemeRow}>
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
