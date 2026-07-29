"use client";

import { usePathname } from "next/navigation";
import styles from "./PageBackground.module.css";

export default function PageBackground() {
  const pathname = usePathname();

  let theme = "default";
  
  if (pathname === "/about") {
    theme = "about";
  } else if (pathname.startsWith("/challenges")) {
    theme = "challenges";
  } else if (pathname.startsWith("/opportunities") || pathname.startsWith("/employers")) {
    theme = "opportunities";
  } else if (pathname.startsWith("/showcase") || pathname.startsWith("/students")) {
    theme = "showcase";
  } else if (pathname.startsWith("/dashboard")) {
    theme = "dashboard";
  } else if (pathname === "/login" || pathname === "/signup" || pathname === "/contact") {
    theme = "auth";
  }

  return (
    <div className={styles.wrapper} data-theme={theme}>
      <div className={styles.gridOverlay} />
      <div className={`${styles.glow} ${styles.glow1}`} />
      <div className={`${styles.glow} ${styles.glow2}`} />
      <div className={`${styles.glow} ${styles.glow3}`} />

      {/* Shooting Stars Container (Down & Up cosmic trails) */}
      <div className={styles.starsContainer} aria-hidden="true">
        <span className={`${styles.star} ${styles.starDown1}`} />
        <span className={`${styles.star} ${styles.starDown2}`} />
        <span className={`${styles.star} ${styles.starDown3}`} />
        <span className={`${styles.star} ${styles.starUp1}`} />
        <span className={`${styles.star} ${styles.starUp2}`} />
        <span className={`${styles.star} ${styles.starDown4}`} />
        <span className={`${styles.star} ${styles.starUp3}`} />
        <span className={`${styles.star} ${styles.starDown5}`} />
      </div>
    </div>
  );
}
