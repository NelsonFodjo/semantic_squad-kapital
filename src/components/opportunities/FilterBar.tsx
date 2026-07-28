"use client";

// ============================================================
// FilterBar — the filters above the opportunity board.
// ============================================================
// The chosen filters live in the URL, not in React state:
//
//     /opportunities?sector=Fintech&paid=1
//
// which means a filtered board can be bookmarked and shared, the back
// button works, and the FILTERING HAPPENS IN THE DATABASE rather than
// shipping every row to the browser and hiding some.
//
// The interactive part is the chip highlight. Each active chip renders
// a <motion.span layoutId>, and framer-motion animates that element
// between positions when the selection changes — so the fill appears to
// slide from the old chip to the new one. That is all layoutId does:
// "this is the same element, animate it to its new place".

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { sectors, localities } from "@/data/taxonomy";
import { hueForSector } from "@/lib/hues";
import styles from "./FilterBar.module.css";

type Props = {
  resultCount: number;
};

// The database stores "part_time"; a person should read "Part-time".
const kindChips = [
  { value: "internship", label: "Internship" },
  { value: "part_time", label: "Part-time" },
  { value: "graduate", label: "Graduate" },
];

const modeChips = [
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
];

export default function FilterBar({ resultCount }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Set one filter in the URL, leaving the others alone. Passing the
   * value that is already active clears it, so tapping a chip twice
   * turns it off.
   */
  function setFilter(key: string, value: string) {
    // The live searchParams is read-only, so copy it before editing.
    const params = new URLSearchParams(searchParams.toString());

    if (!value || params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // scroll: false keeps the page where it is, so the list updates
    // beneath the filters instead of jumping to the top.
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const activeCount = Array.from(searchParams.keys()).length;
  const isPaidOnly = searchParams.get("paid") === "1";

  /**
   * Renders one row of chips.
   *
   * `group` is also the layoutId prefix, which matters: each row needs
   * its own sliding highlight. Sharing one id across rows would make
   * the fill fly between groups.
   */
  function ChipRow({
    group,
    label,
    options,
    hueFor,
  }: {
    group: string;
    label: string;
    options: { value: string; label: string }[];
    hueFor?: (value: string) => string;
  }) {
    const active = searchParams.get(group);

    return (
      <div className={styles.group}>
        <span className={styles.groupLabel}>{label}</span>

        <div className={styles.chips}>
          {options.map((option) => {
            const isActive = active === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(group, option.value)}
                className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                data-hue={hueFor ? hueFor(option.value) : "lagoon"}
                aria-pressed={isActive}
              >
                {/* Only the active chip renders the fill. When the
                    selection moves, framer-motion sees the same
                    layoutId in a new position and animates it there. */}
                {isActive && (
                  <motion.span
                    layoutId={`chip-${group}`}
                    className={styles.chipGlow}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}

                <span className={styles.chipLabel}>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`liquid-glass ${styles.bar}`}>
      {/* ---------- Search and count ---------- */}
      <div className={styles.searchRow}>
        <div className={styles.searchField}>
          <Search size={17} className={styles.searchIcon} />

          <input
            type="search"
            className={styles.search}
            placeholder="Search by title or keyword…"
            defaultValue={searchParams.get("q") ?? ""}
            aria-label="Search opportunities"
            // Filter on Enter rather than on every keystroke — otherwise
            // we fire a database query per letter typed.
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFilter("q", (e.target as HTMLInputElement).value.trim());
              }
            }}
          />
        </div>

        <p className={styles.count}>
          <span className={styles.countValue}>{resultCount}</span>{" "}
          {resultCount === 1 ? "role" : "roles"}
        </p>
      </div>

      {/* ---------- Chip groups ---------- */}
      <div className={styles.groups}>
        <ChipRow group="kind" label="Type" options={kindChips} />
        <ChipRow group="mode" label="How you work" options={modeChips} />

        {/* Sector chips colour themselves with the sector's own hue, so
            the filters teach the colour coding used on the cards. */}
        <ChipRow
          group="sector"
          label="Sector"
          options={sectors.map((s) => ({ value: s, label: s }))}
          hueFor={hueForSector}
        />

        <ChipRow
          group="locality"
          label="Where"
          options={localities.map((l) => ({ value: l, label: l }))}
        />
      </div>

      {/* ---------- Toggle and reset ---------- */}
      <div className={styles.actions}>
        <label className={`${styles.toggle} ${isPaidOnly ? styles.toggleActive : ""}`}>
          {/* The real checkbox is visually hidden but still focusable,
              so the keyboard and screen readers behave normally. The
              span next to it is what you actually see. */}
          <input
            type="checkbox"
            className={styles.toggleInput}
            checked={isPaidOnly}
            onChange={(e) => setFilter("paid", e.target.checked ? "1" : "")}
          />
          <span className={styles.switch}>
            <span className={styles.knob} />
          </span>
          Paid roles only
        </label>

        {/* Only offer a reset when there is something to reset. */}
        {activeCount > 0 && (
          <button
            type="button"
            className={styles.reset}
            onClick={() => router.push(pathname, { scroll: false })}
          >
            <X size={14} />
            Clear {activeCount} filter{activeCount === 1 ? "" : "s"}
          </button>
        )}
      </div>
    </div>
  );
}
