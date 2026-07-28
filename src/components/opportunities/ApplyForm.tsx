"use client";

// ============================================================
// ApplyForm — the apply box on an opportunity page.
// ============================================================
// Read this to see the whole pattern for a form that writes to the
// database:
//   1. one useField per input, each with a rule
//   2. on submit, check every field before sending anything
//   3. insert with the browser Supabase client
//   4. show the error, or swap the form for a success message

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useField, isFormValid, showAllErrors } from "@/hooks/useField";
import { longTextRule } from "@/validation/rules";
import TextAreaField from "@/components/forms/TextAreaField";
import Button from "@/components/ui/Button";
import FormBanner from "@/components/forms/FormBanner";
import styles from "./ApplyForm.module.css";

type Props = {
  opportunityId: string;
  jobTitle: string;
};

export default function ApplyForm({ opportunityId, jobTitle }: Props) {
  // A cover note between 40 and 2000 characters. The same limits are
  // in the database as a check constraint, so a request that skips
  // this form still gets rejected.
  const coverNote = useField("", longTextRule(40, 2000));

  // Three pieces of state: are we sending, did it fail, did it work.
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    // Without this the browser reloads the page and loses everything.
    event.preventDefault();
    setErrorMessage(null);

    // Nothing is sent until the form is valid.
    if (!isFormValid([coverNote])) {
      showAllErrors([coverNote]);
      return;
    }

    setIsSending(true);

    const supabase = createClient();

    // Who is applying? Ask Supabase rather than trusting anything in
    // the page — this id is what the RLS policy checks against.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage("Your session has expired. Please log in again.");
      setIsSending(false);
      return;
    }

    const { error } = await supabase.from("applications").insert({
      opportunity_id: opportunityId,
      student_id: user.id,
      cover_note: coverNote.value.trim(),
    });

    setIsSending(false);

    if (error) {
      // Code 23505 is Postgres for "unique constraint violated",
      // which here can only mean they already applied.
      setErrorMessage(
        error.code === "23505"
          ? "You have already applied to this role."
          : error.message,
      );
      return;
    }

    setIsDone(true);
  }

  // Replace the form with a confirmation once it has been sent.
  if (isDone) {
    return (
      <div className={styles.panel}>
        <FormBanner tone="success" title="Application sent">
          Your application for {jobTitle} is with the employer. You can track it
          from your dashboard.
        </FormBanner>

        <Button href="/dashboard/student" variant="secondary">
          Go to my dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Apply for this role</h2>
      <p className={styles.intro}>
        One short note is all we ask. Tell them what you have built and when you
        can start.
      </p>

      {errorMessage && (
        <FormBanner tone="error" title="Could not send your application">
          {errorMessage}
        </FormBanner>
      )}

      {/* noValidate turns off the browser's own popups so our
          friendlier messages show instead. */}
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <TextAreaField
          label="Why you, and when can you start?"
          field={coverNote}
          rows={8}
          maxLength={2000}
          placeholder="I have built two React apps with Postgres behind them, including..."
          hint="Between 40 and 2000 characters."
        />

        <Button type="submit" disabled={isSending} fullWidth>
          {isSending ? "Sending…" : "Send application"}
        </Button>

        <p className={styles.smallPrint}>
          The employer will see your name, your profile, and this note.
        </p>
      </form>
    </div>
  );
}
