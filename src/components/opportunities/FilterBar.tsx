"use client";

// ============================================================
// FilterBar — collapsible glass filter panel.
// ============================================================

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, ChevronDown, Sparkles } from "lucide-react";
import { sectors, localities } from "@/data/taxonomy";
import { hueForSector } from "@/lib/hues";
import styles from "./FilterBar.module.css";

type Props = {
  resultCount: number;
};

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
  const [isExpanded, setIsExpanded] = useState(false);

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const activeKeys = Array.from(searchParams.keys());
  const activeCount = activeKeys.length;
  const isPaidOnly = searchParams.get("paid") === "1";

  // Build active filter tags for quick removal
  const activeTags: { key: string; label: string; value: string }[] = [];
  searchParams.forEach((value, key) => {
    if (key === "q") activeTags.push({ key, label: `Search: "${value}"`, value });
    else if (key === "kind") {
      const match = kindChips.find((c) => c.value === value);
      activeTags.push({ key, label: match?.label || value, value });
    } else if (key === "mode") {
      const match = modeChips.find((c) => c.value === value);
      activeTags.push({ key, label: match?.label || value, value });
    } else if (key === "paid" && value === "1") {
      activeTags.push({ key, label: "Paid only", value });
    } else if (key === "sector" || key === "locality") {
      activeTags.push({ key, label: value, value });
    }
  });

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
      {/* ---------- Primary Controls Row ---------- */}
      <div className={styles.searchRow}>
        <div className={styles.searchField}>
          <Search size={17} className={styles.searchIcon} />

          <input
            type="search"
            className={styles.search}
            placeholder="Search by title or keyword…"
            defaultValue={searchParams.get("q") ?? ""}
            aria-label="Search opportunities"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFilter("q", (e.target as HTMLInputElement).value.trim());
              }
            }}
          />
        </div>

        <div className={styles.topRightControls}>
          <label className={`${styles.toggle} ${isPaidOnly ? styles.toggleActive : ""}`}>
            <input
              type="checkbox"
              className={styles.toggleInput}
              checked={isPaidOnly}
              onChange={(e) => setFilter("paid", e.target.checked ? "1" : "")}
            />
            <span className={styles.switch}>
              <span className={styles.knob} />
            </span>
            <span className={styles.toggleLabel}>Paid only</span>
          </label>

          <button
            type="button"
            className={`${styles.expandBtn} ${isExpanded ? styles.expandBtnActive : ""}`}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label="Toggle filter options"
          >
            <SlidersHorizontal size={15} />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className={styles.activeBadge}>{activeCount}</span>
            )}
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className={styles.chevronWrapper}
            >
              <ChevronDown size={16} />
            </motion.span>
          </button>

          <p className={styles.count}>
            <span className={styles.countValue}>{resultCount}</span>{" "}
            {resultCount === 1 ? "role" : "roles"}
          </p>
        </div>
      </div>

      {/* ---------- Active Filters Strip ---------- */}
      {activeTags.length > 0 && (
        <div className={styles.activeStrip}>
          <span className={styles.activeStripLabel}>Active:</span>
          <div className={styles.activeTags}>
            {activeTags.map((tag) => (
              <button
                key={`${tag.key}-${tag.value}`}
                type="button"
                className={styles.activeTag}
                onClick={() => setFilter(tag.key, tag.value)}
              >
                <span>{tag.label}</span>
                <X size={12} />
              </button>
            ))}
          </div>

          <button
            type="button"
            className={styles.clearAllBtn}
            onClick={() => router.push(pathname, { scroll: false })}
          >
            Clear all
          </button>
        </div>
      )}

      {/* ---------- Collapsible Filter Groups ---------- */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={styles.collapsibleWrapper}
          >
            <div className={styles.groups}>
              <ChipRow group="kind" label="Type" options={kindChips} />
              <ChipRow group="mode" label="How you work" options={modeChips} />

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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
