"use client";

// ============================================================
// VideoHero — the full-viewport video hero.
// ============================================================
// The interesting part is the looping crossfade. A plain `loop`
// attribute snaps hard from the last frame back to the first, which
// looks like a glitch. Instead we drive the opacity ourselves:
//
//   canplay     -> fade the video up from 0 to 1 over 500ms
//   timeupdate  -> when 0.55s of playback remain, fade down to 0
//   ended       -> rewind, restart, fade back up
//
// The result is a seamless loop that dips through black.
//
// Why requestAnimationFrame rather than a CSS transition: the fade has
// to be timed against the video's own clock, and we need to be able to
// interrupt a fade mid-way (if the tab is backgrounded, say) without
// fighting a transition that is already running.
//
// Everything here reads the --on-video-* tokens rather than --ink /
// --paper: the video and its dark scrim never change with the site
// theme, so hero text has to stay fixed-light in both themes too — see
// the comment above --on-video-ink in tokens.css.

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Sparkles, FolderGit2 } from "lucide-react";
import styles from "./VideoHero.module.css";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4";

/** How long each fade takes, in milliseconds. */
const FADE_MS = 500;

/** How far before the end to start fading out, in seconds. */
const FADE_OUT_LEAD = 0.55;

// Each one is a real filter, not decoration: clicking it jumps
// straight to the matching results rather than just describing them.
const quickFilters = [
  {
    Icon: Briefcase,
    label: "Internships",
    href: "/opportunities?kind=internship",
  },
  {
    Icon: Sparkles,
    label: "Industry challenges",
    href: "/challenges",
  },
  {
    Icon: FolderGit2,
    label: "Paid roles only",
    href: "/opportunities?paid=1",
  },
];

export default function VideoHero() {
  // A ref is how you reach a real DOM element from React. We need the
  // actual <video> node to read currentTime and set opacity directly.
  const videoRef = useRef<HTMLVideoElement>(null);

  // Holds the id of the in-flight animation frame loop, so a new fade
  // can cancel the previous one instead of the two fighting.
  const fadeRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect a reduced-motion preference: show the first frame and
    // never animate. matchMedia lets us read the same setting CSS uses.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      video.style.opacity = "1";
      return;
    }

    /**
     * Animate opacity from its current value to `to`, over FADE_MS.
     * Cancels any fade already running.
     */
    function fadeTo(to: number, onDone?: () => void) {
      if (!video) return;

      if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);

      const from = Number(video.style.opacity || "0");
      const start = performance.now();

      function step(now: number) {
        if (!video) return;

        // How far through the fade we are, clamped to 0-1.
        const progress = Math.min((now - start) / FADE_MS, 1);

        video.style.opacity = String(from + (to - from) * progress);

        if (progress < 1) {
          fadeRef.current = requestAnimationFrame(step);
        } else {
          fadeRef.current = null;
          onDone?.();
        }
      }

      fadeRef.current = requestAnimationFrame(step);
    }

    // Tracks whether the fade-out for this pass has already been
    // triggered, so timeupdate does not restart it on every tick.
    let isFadingOut = false;

    function handleCanPlay() {
      // play() returns a promise that rejects if the browser blocks
      // autoplay. Muted autoplay is allowed everywhere, but catching
      // it keeps an unhandled rejection out of the console.
      video?.play().catch(() => {});
      fadeTo(1);
    }

    function handleTimeUpdate() {
      if (!video || isFadingOut) return;

      const remaining = video.duration - video.currentTime;

      // duration is NaN until metadata loads, and NaN comparisons are
      // always false, so this is safe without an extra guard.
      if (remaining <= FADE_OUT_LEAD) {
        isFadingOut = true;
        fadeTo(0);
      }
    }

    function handleEnded() {
      if (!video) return;

      video.style.opacity = "0";

      // A beat of pure black before restarting. Without it the fade
      // back up begins while the last frame is still on screen.
      window.setTimeout(() => {
        if (!video) return;
        video.currentTime = 0;
        video.play().catch(() => {});
        isFadingOut = false;
        fadeTo(1);
      }, 100);
    }

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    // Cleanup runs when the component unmounts. Without it the
    // listeners and the animation loop would keep running against a
    // node that is no longer on the page.
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);
    };
  }, []); // empty array = set this up once, on mount

  return (
    <section className={styles.hero}>
      {/* aria-hidden because it is decoration — a screen reader has
          nothing useful to say about it. */}
      <video
        ref={videoRef}
        className={styles.video}
        muted
        autoPlay
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.content}>
        <h1 className={styles.title}>
          Build and <em className={styles.titleEm}>Connect</em>.
        </h1>

        <p className={styles.subtitle}>
          Kapital connects Mauritian university students with employers
          offering internships, industry challenges and open-source work so
          what you build here becomes a portfolio, not just a line on a CV.
        </p>

        <p className={styles.filterPrompt}>What are you looking for?</p>

        <ul className={styles.highlights}>
          {quickFilters.map(({ Icon, label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className={`liquid-glass liquid-glass-hover ${styles.highlight}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.ctas}>
          <Link href="/opportunities" className={styles.primaryCta}>
            Browse all opportunities
            <ArrowRight size={18} />
          </Link>

          <Link href="/about" className={`liquid-glass liquid-glass-hover ${styles.secondaryCta}`}>
            How it works
          </Link>
        </div>
      </div>
    </section>
  );
}
