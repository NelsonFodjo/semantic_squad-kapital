"use client";

// ============================================================
// ProposalForm — how a student answers a challenge.
// ============================================================
// The longest form in the app, and a good example of grouping fields
// into sections so it does not feel like a wall of boxes.

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useField, isFormValid, showAllErrors } from "@/hooks/useField";
import { longTextRule, skillsRule, websiteRule } from "@/validation/rules";
import { checkLength } from "@/validation/rules";
import TextField from "@/components/forms/TextField";
import TextAreaField from "@/components/forms/TextAreaField";
import Button from "@/components/ui/Button";
import FormBanner from "@/components/forms/FormBanner";
import styles from "./ProposalForm.module.css";

type Props = {
  challengeId: string;
  challengeTitle: string;
  /** More than 1 means teams are allowed on this challenge. */
  teamSizeMax: number;
};

export default function ProposalForm({
  challengeId,
  challengeTitle,
  teamSizeMax,
}: Props) {
  // The approach must be at least 80 characters — the same minimum is
  // a check constraint in the database, so a one-word submission is
  // impossible even if someone skips this form.
  const approach = useField("", longTextRule(80, 4000));
  const timeline = useField("", longTextRule(40, 1500));
  const techStack = useField("", skillsRule);
  const attachment = useField("", websiteRule); // optional
  const teamName = useField("", checkLength(2, 40)); // optional

  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  // Only the first three are compulsory.
  const requiredFields = [approach, timeline, techStack];
  const allFields = [...requiredFields, attachment, teamName];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    if (!isFormValid(allFields)) {
      showAllErrors(allFields);
      return;
    }

    setIsSending(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage("Your session has expired. Please log in again.");
      setIsSending(false);
      return;
    }

    const { error } = await supabase.from("proposals").insert({
      challenge_id: challengeId,
      lead_student_id: user.id,
      // Turn "React, SQL, Figma" into a real array for the text[]
      // column. filter(Boolean) drops empties from a trailing comma.
      tech_stack: techStack.value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      approach: approach.value.trim(),
      timeline: timeline.value.trim(),
      // Empty optional fields go in as null, not "".
      attachment_url: attachment.value.trim() || null,
      team_name: teamName.value.trim() || null,
    });

    setIsSending(false);

    if (error) {
      setErrorMessage(
        error.code === "23505"
          ? "You have already submitted a proposal for this challenge."
          : error.message,
      );
      return;
    }

    setIsDone(true);
  }

  if (isDone) {
    return (
      <div className={styles.panel}>
        <FormBanner tone="success" title="Proposal submitted">
          Your proposal for “{challengeTitle}” is in. The organisation reviews
          submissions after the deadline — you will see the status change on your
          dashboard.
        </FormBanner>

        <Button href="/dashboard/student" variant="secondary">
          Go to my dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Submit a proposal</h2>
      <p className={styles.intro}>
        You are not expected to have built it. Explain how you would approach it
        and what you are unsure about — being honest about the unknowns counts in
        your favour.
      </p>

      {errorMessage && (
        <FormBanner tone="error" title="Could not submit your proposal">
          {errorMessage}
        </FormBanner>
      )}

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <TextAreaField
          label="Your approach"
          field={approach}
          rows={10}
          maxLength={4000}
          placeholder="I would treat the form as a local-first document rather than a form that posts..."
          hint="How would you solve it, and where are you unsure? 80 characters minimum."
        />

        <div className={styles.group}>
          <p className={styles.groupTitle}>Plan</p>

          <TextAreaField
            label="Timeline"
            field={timeline}
            rows={5}
            maxLength={1500}
            placeholder={"Week 1-2: audit the current form...\nWeek 3-4: ..."}
            hint="Rough stages and how long each would take."
          />

          <TextField
            label="Tools and technologies"
            field={techStack}
            placeholder="JavaScript, IndexedDB, Playwright"
            hint="Separate them with commas."
          />
        </div>

        <div className={styles.group}>
          <p className={styles.groupTitle}>Optional extras</p>

          <TextField
            label="Link to mockups, slides or a repo"
            field={attachment}
            type="url"
            optional
            placeholder="https://github.com/you/prototype"
          />

          {/* Only ask for a team name when teams are actually allowed. */}
          {teamSizeMax > 1 && (
            <TextField
              label="Team name"
              field={teamName}
              optional
              placeholder="The Lagoon Four"
              hint={`Teams of up to ${teamSizeMax} are allowed on this challenge. You can add team mates after submitting.`}
            />
          )}
        </div>

        <Button type="submit" disabled={isSending} fullWidth size="lg">
          {isSending ? "Submitting…" : "Submit proposal"}
        </Button>

        <p className={styles.smallPrint}>
          You can submit one proposal per challenge. The organisation sees your
          name and profile alongside it.
        </p>
      </form>
    </div>
  );
}
