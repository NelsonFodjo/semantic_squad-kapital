// ============================================================
// LOGIN  ->  the "/login" route
// ============================================================
// Note the folder above this one: (auth). Brackets around a folder
// name make it a "route group" — it groups files without becoming
// part of the URL. So this is /login, not /auth/login. The point is
// that login and signup can share auth.module.css.
//
// This page is a server component. It renders the page furniture and
// wraps the interactive form in <Suspense>, which is required because
// the form reads the URL's query string. See LoginForm.tsx.

import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import styles from "../auth.module.css";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to track your applications and challenge proposals.",
};

export default function LoginPage() {
  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.panel}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>
            Log in to track your applications and proposals.
          </p>
        </div>

        {/* The fallback is what shows for the split second before the
            form is ready. Keeping it the same height as the form stops
            the page jumping when it appears. */}
        <Suspense fallback={<div className={`liquid-glass ${styles.card}`} aria-busy="true" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
