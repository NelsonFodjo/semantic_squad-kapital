// ============================================================
// CONTACT  ->  the "/contact" route
// ============================================================
// The page is a server component, and the form inside it is a client
// component. That split is worth noticing: only the interactive part
// ships JavaScript to the browser.

import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "./ContactForm";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import styles from "./page.module.css";

export const metadata = {
  title: "Contact",
  description: "Questions about Stage.mu, or want to post a role? Get in touch.",
};

export default function ContactPage() {
  return (
    <div className="container section">
      <div className={styles.wrapper}>
        <div className={styles.infoColumn}>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Contact"
              title="Tell us what you need."
              description="Whether you are a student who cannot find anything relevant, or a company with a problem worth solving — write to us and a person will read it."
            />
          </Reveal>

          <Reveal delay={0.15}>
            <div className={`liquid-glass ${styles.imageFrame}`} data-hue="palm">
              <Image
                src="/images/opensource.svg"
                alt="Collaborative networks"
                fill
                unoptimized
                style={{ objectFit: "cover" }}
                className={styles.image}
              />
              <div className={styles.imageGlow} />
            </div>
          </Reveal>
        </div>

        <div className={styles.formColumn}>
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
