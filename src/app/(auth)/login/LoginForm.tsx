"use client";

// ============================================================
// LoginForm — the actual login form.
// ============================================================
// This is a separate file from page.tsx for one specific reason:
// useSearchParams() below cannot run while Next.js is prerendering
// the page at build time, because the URL is not known yet. Keeping
// the form in its own component lets page.tsx wrap it in <Suspense>,
// which is how you tell Next.js "render a fallback for now, and fill
// this in once the browser takes over".
//
// Without that split the build fails with "useSearchParams() should
// be wrapped in a suspense boundary".

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useField, isFormValid, showAllErrors } from "@/hooks/useField";
import { emailRule, isRequired } from "@/validation/rules";
import TextField from "@/components/forms/TextField";
import Button from "@/components/ui/Button";
import FormBanner from "@/components/forms/FormBanner";
import styles from "../auth.module.css";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Where to go after logging in. Set by the "log in to apply"
  // buttons, so people land back where they were.
  const next = searchParams.get("next") ?? "/dashboard";

  const email = useField("", emailRule);

  // On login we only check the password is present. Checking strength
  // here would be wrong — the account already exists, and telling
  // someone their existing password is weak at the login screen is
  // both useless and confusing.
  const password = useField("", isRequired);

  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fields = [email, password];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    if (!isFormValid(fields)) {
      showAllErrors(fields);
      return;
    }

    setIsSending(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value.trim(),
      password: password.value,
    });

    if (error) {
      setIsSending(false);
      // Deliberately vague. Saying "no account with that email" tells
      // a stranger which addresses are registered here.
      setErrorMessage(
        error.message === "Invalid login credentials"
          ? "That email and password do not match an account."
          : error.message,
      );
      return;
    }

    // refresh() makes the server re-render with the new session, so
    // the navbar and dashboard see that we are logged in.
    router.push(next);
    router.refresh();
  }

  return (
    <>
      <div className={`liquid-glass ${styles.card}`}>
          {errorMessage && (
            <FormBanner tone="error" title="Could not log you in">
              {errorMessage}
            </FormBanner>
          )}

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <TextField
              label="Email"
              field={email}
              type="email"
              placeholder="you@umail.uom.ac.mu"
              // Tells the browser's password manager what this field is.
              autoComplete="email"
            />

            <TextField
              label="Password"
              field={password}
              type="password"
              autoComplete="current-password"
            />

            <Button type="submit" disabled={isSending} fullWidth size="lg">
              {isSending ? "Logging in…" : "Log in"}
            </Button>
          </form>
        </div>

      <p className={styles.switch}>
        No account yet?{" "}
        <Link href="/signup" className={styles.switchLink}>
          Create one free
        </Link>
      </p>
    </>
  );
}
