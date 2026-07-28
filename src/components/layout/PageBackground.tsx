"use client";

import { usePathname } from "next/navigation";
import styles from "./PageBackground.module.css";

export default function PageBackground() {
  const pathname = usePathname();

  // Determine what theme/colors to use based on the path
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
    </div>
  );
}
