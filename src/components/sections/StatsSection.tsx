// ============================================================
// StatsSection — the counting numbers below the hero.
// ============================================================

import GravityContainer from "@/components/motion/GravityContainer";
import StatCard from "./StatCard";
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
        <GravityContainer className={styles.grid} stagger={0.08}>
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              hue={stat.hue}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
          ))}
        </GravityContainer>
      </div>
    </section>
  );
}
