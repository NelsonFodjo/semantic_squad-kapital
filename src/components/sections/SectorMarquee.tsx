// ============================================================
// SectorMarquee — the slowly scrolling strip of sectors.
// ============================================================
// Shows the breadth of the platform at a glance, and introduces the
// colour coding used on the rest of the site: the dot beside each
// sector is the same colour that sector's cards will be.
//
// Pure CSS animation, no JavaScript, no "use client".

import { sectors } from "@/data/taxonomy";
import { hueForSector } from "@/lib/hues";
import styles from "./SectorMarquee.module.css";

export default function SectorMarquee() {
  return (
    // aria-hidden because it is decorative and, being duplicated, a
    // screen reader would read every sector twice.
    <section className={styles.section} aria-hidden="true">
      <div className={styles.viewport}>
        <div className={styles.track}>
          {/* Rendered twice. That is what makes the loop seamless — see
              the keyframes comment in the stylesheet. */}
          {[...sectors, ...sectors].map((sector, index) => (
            <span
              // The sector name alone would not be unique across two
              // copies, so the index goes in the key too.
              key={`${sector}-${index}`}
              className={`liquid-glass ${styles.item}`}
              data-hue={hueForSector(sector)}
            >
              <span className={styles.dot} />
              {sector}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
