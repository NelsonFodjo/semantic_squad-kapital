// ============================================================
// NOT FOUND — shown for any URL with no matching page.
// ============================================================
// The filename is special: Next.js looks for not-found.tsx whenever a
// route does not exist, or when a page calls notFound(). You never
// link to it yourself.

import Button from "@/components/ui/Button";
import styles from "./not-found.module.css";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className={`container ${styles.page}`}>
      <p className={styles.code}>404</p>

      <h1 className={styles.title}>That page does not exist.</h1>

      <p className={styles.body}>
        The link may be out of date, or a listing may have closed and been taken
        down.
      </p>

      <div className={styles.actions}>
        <Button href="/opportunities">Browse opportunities</Button>
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </div>
    </div>
  );
}
