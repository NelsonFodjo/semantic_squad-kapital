// ============================================================
// StatsSection — the counting numbers below the hero.
// ============================================================
// A server component. Only the numbers themselves are interactive, and
// each <Counter> is its own small client component — so the page ships
// almost no JavaScript for this section.
//
// The counts come from the database, so they are never stale.

import Reveal from "@/components/motion/Reveal";
import Counter from "@/components/motion/Counter";
import styles from "./StatsSection.module.css";

type Props = {
  openOpportunities: number;
  openChallenges: number;
  publishedWork: number;
};

export default function StatsSection({
  openOpportunities,
  openChallenges,
  publishedWork,
}: Props) {
  const stats = [
    {
      value: openOpportunities,
      label: "Roles open right now",
      hue: "lagoon",
      prefix: "0",
      suffix: "",
    },
    {
      value: openChallenges,
      label: "Industry challenges live",
      hue: "mango",
      prefix: "0",
      suffix: "",
    },
    {
      value: publishedWork,
      label: "Case studies published",
      hue: "orchid",
      prefix: "0",
      suffix: "",
    },
    {
      value: 100,
      label: "Stipend disclosed before you apply",
      hue: "palm",
      prefix: "",
      suffix: "%",
    },
  ];

  return (
    <section className={styles.section}>
      <span className={`aurora ${styles.auroraLeft}`} aria-hidden="true" />
      <span className={`aurora ${styles.auroraRight}`} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          {stats.map((stat, index) => (
            // Each tile arrives slightly after the one before it.
            <Reveal key={stat.label} delay={index * 0.08}>
              <div
                className={`liquid-glass ${styles.tile}`}
                data-hue={stat.hue}
              >
                <span className={styles.value}>
                  {/* The zero is decoration, so it is hidden from screen
                      readers — they should hear "48", not "zero 48". */}
                  {stat.prefix && (
                    <span className={styles.prefix} aria-hidden="true">
                      {stat.prefix}
                    </span>
                  )}

                  <Counter to={stat.value} />

                  {stat.suffix && (
                    <span className={styles.suffix}>{stat.suffix}</span>
                  )}
                </span>

                <span className={styles.label}>{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
