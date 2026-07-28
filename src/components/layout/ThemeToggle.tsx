"use client";

// ============================================================
// ThemeToggle — the light/dark switch shown in the navbar.
// ============================================================
// The actual switching is one line: set data-color-scheme on <html>,
// and every token in tokens.css flips because they are all declared
// against that attribute selector.
//
// The tricky part is avoiding a flash of the wrong theme on first
// paint. React does not run until after the browser has already
// painted the initial HTML, so if we only set the attribute here,
// dark-theme users would see a flash of light (or vice versa) for a
// frame. The fix is the inline script in layout.tsx, which runs
// before paint and sets the attribute from localStorage (or the OS
// preference) immediately. This component just keeps that choice in
// sync afterwards and lets the visitor change it.

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import styles from "./ThemeToggle.module.css";

export const THEME_STORAGE_KEY = "kapital-color-scheme";

type Scheme = "light" | "dark";

function applyScheme(scheme: Scheme) {
  const root = document.documentElement;

  // Briefly disable per-component transitions (see [data-theme-switching]
  // in base.css) so every glass panel and link doesn't visibly replay
  // its own colour transition at once when the tokens change.
  root.setAttribute("data-theme-switching", "");
  root.setAttribute("data-color-scheme", scheme);

  window.setTimeout(() => {
    root.removeAttribute("data-theme-switching");
  }, 0);
}

export default function ThemeToggle() {
  // Starts null so the button renders nothing until it knows the real
  // value — the inline script has already set the attribute on <html>
  // by then, so we just read it back rather than guessing.
  const [scheme, setScheme] = useState<Scheme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute(
      "data-color-scheme",
    );
    setScheme(current === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next: Scheme = scheme === "light" ? "dark" : "light";
    setScheme(next);
    applyScheme(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={styles.toggle}
      aria-label={
        scheme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      // Keeps layout stable while scheme is still unknown, rather than
      // rendering an icon that might immediately swap.
      style={{ visibility: scheme === null ? "hidden" : "visible" }}
    >
      {scheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
