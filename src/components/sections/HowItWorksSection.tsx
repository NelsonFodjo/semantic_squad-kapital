// ============================================================
// HowItWorksSection — the three steps, as spotlight cards.
// ============================================================
// Each card gets its own colour and a glow that follows the cursor
// (see SpotlightCard). The colours run cool to warm across the row,
// which gives the three steps a sense of direction.

import { UserCircle, Send, Sparkles } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import SpotlightCard from "@/components/motion/SpotlightCard";
import styles from "./HowItWorksSection.module.css";

// `as const` on the hue keeps TypeScript happy: it narrows the type
// from `string` to the exact hue names SpotlightCard accepts.
const steps = [
  {
    hue: "lagoon" as const,
    Icon: UserCircle,
    title: "Build your profile",
    body: "Verify with your university email, list your skills, attach your CV once. After that, applying to anything takes two clicks.",
  },
  {
    hue: "orchid" as const,
    Icon: Send,
    title: "Apply or propose",
    body: "Go for a posted internship, or answer an open industry challenge with your own proposal — solo or as a team.",
  },
  {
    hue: "mango" as const,
    Icon: Sparkles,
    title: "Ship something real",
    body: "Selected work gets published in the showcase with your name on it. That becomes the portfolio employers actually read.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className={styles.section}>
      <span className={`aurora ${styles.aurora1}`} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <Reveal>
          <p className="eyebrow">How it works</p>
          <h2 className={styles.heading}>
            Three steps, <em>no gatekeeping</em>.
          </h2>
        </Reveal>

        <div className={styles.grid}>
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.1}>
              <SpotlightCard hue={step.hue} className={styles.card}>
                {/* CSS adds no numbering here because each card needs
                    its own colour, which a counter cannot carry. */}
                <span className={styles.step}>0{index + 1}</span>

                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.body}>{step.body}</p>

                <step.Icon className={styles.icon} size={20} />
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
