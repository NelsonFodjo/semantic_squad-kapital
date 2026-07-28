"use client";

// ============================================================
// SIGN UP  ->  the "/signup" route
// ============================================================
// The fullest example of the validation system in the project. Read
// this one to understand how forms work here.
//
// Note the role chooser: students must use a university email, while
// employers can use any work address. The rule applied to the email
// field changes depending on which is selected.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useField, isFormValid, showAllErrors } from "@/hooks/useField";
import {
  fullNameRule,
  emailRule,
  matchesPasswordRule,
} from "@/validation/rules";
import { passwordRule } from "@/validation/password";
import TextField from "@/components/forms/TextField";
import PasswordChecklist from "@/components/forms/PasswordChecklist";
import Button from "@/components/ui/Button";
import FormBanner from "@/components/forms/FormBanner";
import styles from "../auth.module.css";

// The two account types offered at signup. Coordinators and admins
// are set by hand in the database, not chosen here.
const roles = [
  {
    value: "student" as const,
    name: "I am a student",
    hint: "Apply to roles and answer challenges",
  },
  {
    value: "professional" as const,
    name: "I am hiring",
    hint: "Post roles and challenges",
  },
];

export default function SignUpPage() {
  const router = useRouter();

  const [role, setRole] = useState<"student" | "professional">("student");

  const fullName = useField("", fullNameRule);

  // Students and employers both use the standard email validation rule.
  const email = useField("", emailRule);

  const password = useField("", passwordRule);
  const confirm = useField("", matchesPasswordRule(password.value));

  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const fields = [fullName, email, password, confirm];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    if (!isFormValid(fields)) {
      showAllErrors(fields); // reveal every error at once
      return;
    }

    setIsSending(true);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: email.value.trim(),
      password: password.value,
      options: {
        // This metadata is read by the handle_new_user() trigger in
        // the migration, which creates the matching profiles row and
        // generates a URL slug from the name.
        data: {
          full_name: fullName.value.trim(),
          role,
        },
      },
    });

    setIsSending(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    // If the project requires email confirmation, there is no session
    // yet — the user has to click a link first. Tell them that rather
    // than dumping them on a dashboard they cannot use.
    if (!data.session) {
      setNeedsConfirmation(true);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (needsConfirmation) {
    return (
      <div className={`container ${styles.page}`}>
        <div className={styles.panel}>
          <FormBanner tone="success" title="Check your inbox">
            We sent a confirmation link to {email.value}. Click it to finish
            setting up your account.
          </FormBanner>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.panel}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Join Stage.mu</h1>
          <p className={styles.subtitle}>
            Free for students and for employers while we grow.
          </p>
        </div>

        <div className={`liquid-glass ${styles.card}`}>
          {errorMessage && (
            <FormBanner tone="error" title="Could not create your account">
              {errorMessage}
            </FormBanner>
          )}

          {/* ---------- Role chooser ---------- */}
          <div className={styles.roles}>
            {roles.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value)}
                className={`${styles.role} ${
                  role === option.value ? styles.roleActive : ""
                }`}
                // Communicates the selected state to screen readers,
                // which cannot see the highlighted border.
                aria-pressed={role === option.value}
              >
                <span className={styles.roleName}>{option.name}</span>
                <span className={styles.roleHint}>{option.hint}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <TextField
              label="Full name"
              field={fullName}
              placeholder="Anjali Peerthum"
              autoComplete="name"
            />

            <TextField
              label="Email"
              field={email}
              type="email"
              autoComplete="email"
              placeholder={
                role === "student" ? "you@umail.uom.ac.mu" : "you@company.mu"
              }
              hint={
                role === "student"
                  ? "Your university address — this is how we verify you are a student."
                  : "Use your work address so students can see who you are."
              }
            />

            <div>
              <TextField
                label="Password"
                field={password}
                type="password"
                autoComplete="new-password"
              />
              {/* The live tick list, directly under the box. */}
              <PasswordChecklist password={password.value} />
            </div>

            <TextField
              label="Confirm password"
              field={confirm}
              type="password"
              autoComplete="new-password"
            />

            <Button type="submit" disabled={isSending} fullWidth size="lg">
              {isSending ? "Creating your account…" : "Create account"}
            </Button>
          </form>

          <p className={styles.legal}>
            By joining you agree to our <Link href="/terms">terms</Link> and{" "}
            <Link href="/privacy">privacy policy</Link>.
          </p>
        </div>

        <p className={styles.switch}>
          Already have an account?{" "}
          <Link href="/login" className={styles.switchLink}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
