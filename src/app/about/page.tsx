// ============================================================
// ABOUT  ->  the "/about" route
// ============================================================

import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import styles from "./page.module.css";

export const metadata = {
  title: "About",
  description:
    "Why Stage.mu exists: connecting Mauritian students with professionals through work, not contacts.",
};

const problems = [
  {
    title: "Getting a placement depends on who you know",
    body: "Students with a parent in the industry find internships. Students without one send emails into the void. The talent is evenly distributed; the contacts are not.",
  },
  {
    title: "Nobody says what the stipend is",
    body: "Students apply, interview, and only then find out a placement is unpaid — or pays less than the bus fare to get there. Every listing here states the figure before you click.",
  },
  {
    title: "A CV cannot show what you can do",
    body: "A second-year student has no work history to put on one. Challenges fix that: you are judged on how you would approach a real problem, not on where you have already worked.",
  },
];

const principles = [
  {
    title: "Pay is stated up front",
    body: "The database will not accept a paid listing without a stipend figure. Unpaid placements are allowed, but they are labelled, and students can filter them out.",
  },
  {
    title: "Employers are verified",
    body: "A verified tick means someone checked the Business Registration Number. Unverified employers can still post, and students can see the difference.",
  },
  {
    title: "Your work stays yours",
    body: "Proposals are visible to you and to the organisation you sent them to. No other student can see your submission, and that rule is enforced by the database itself.",
  },
];

export default function AboutPage() {
  return (
    <div className="container section">
      <Reveal>
        <SectionHeading
          as="h1"
          eyebrow="About"
          title="Experience should not depend on contacts."
          description="Stage.mu is a place where Mauritian students find real work, and professionals find people who can do it."
        />
      </Reveal>

      <section className={styles.section}>
        <div className={styles.grid}>
          <div className={styles.textColumn}>
            <Reveal>
              <h2 className={styles.sectionTitle}>What we are trying to fix</h2>
            </Reveal>
            <div className={styles.list}>
              {problems.map((item, idx) => (
                <Reveal key={item.title} delay={idx * 0.1}>
                  <article className={`liquid-glass hover-lift ${styles.item}`} data-hue="coral">
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemBody}>{item.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
          
          <div className={styles.imageColumn}>
            <Reveal delay={0.2}>
              <div className={`liquid-glass ${styles.imageFrame}`} data-hue="coral">
                <Image
                  src="/images/challenges.svg"
                  alt="Solving routing challenges"
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                  className={styles.image}
                />
                <div className={styles.imageGlow} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.grid} ${styles.gridReverse}`}>
          <div className={styles.textColumn}>
            <Reveal>
              <h2 className={styles.sectionTitle}>How we work</h2>
            </Reveal>
            <div className={styles.list}>
              {principles.map((item, idx) => (
                <Reveal key={item.title} delay={idx * 0.1}>
                  <article className={`liquid-glass hover-lift ${styles.item}`} data-hue="lagoon">
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemBody}>{item.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
          
          <div className={styles.imageColumn}>
            <Reveal delay={0.2}>
              <div className={`liquid-glass ${styles.imageFrame}`} data-hue="lagoon">
                <Image
                  src="/images/placements.svg"
                  alt="Mauritius internships and jobs"
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                  className={styles.image}
                />
                <div className={styles.imageGlow} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Reveal>
        <section className={`liquid-glass ${styles.cta}`} data-hue="orchid">
          <span className={`aurora ${styles.ctaAurora}`} aria-hidden="true" />
          <h2 className={styles.ctaTitle}>Built for students, in Mauritius.</h2>
          <p className={styles.ctaBody}>
            Free for students, and free for employers while we grow. If something is
            missing or broken, tell us — we would rather hear it.
          </p>
          <div className={styles.ctaActions}>
            <Button href="/signup">Create an account</Button>
            <Button href="/contact" variant="secondary">
              Get in touch
            </Button>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
