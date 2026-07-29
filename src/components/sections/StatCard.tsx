"use client";

import { motion, useReducedMotion } from "framer-motion";
import Counter from "@/components/motion/Counter";
import styles from "./StatsSection.module.css";

type StatCardProps = {
  value: number;
  label: string;
  hue: string;
  prefix?: string;
  suffix?: string;
};

export default function StatCard({
  value,
  label,
  hue,
  prefix,
  suffix,
}: StatCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`liquid-glass ${styles.tile}`}
      data-hue={hue}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              y: -6,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }
      }
      whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
      drag={!shouldReduceMotion}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.25}
      dragSnapToOrigin={true}
      style={{ cursor: "grab" }}
    >
      <span className={styles.value}>
        {prefix && (
          <span className={styles.prefix} aria-hidden="true">
            {prefix}
          </span>
        )}

        <Counter to={value} />

        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </span>

      <span className={styles.label}>{label}</span>
    </motion.div>
  );
}
