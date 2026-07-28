"use client";

// ============================================================
// StudentOnboarding — the student's first-run profile form.
// ============================================================
// Writes one row to `students`. The `profiles` row already exists,
// created by the handle_new_user trigger at signup.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useField, isFormValid, showAllErrors } from "@/hooks/useField";
import {
  isRequired,
  skillsRule,
  yearOfStudyRule,
  githubRule,
  websiteRule,
  dateRule,
  checkLength,
} from "@/validation/rules";
import { institutions, faculties, localities } from "@/data/taxonomy";
import TextField from "@/components/forms/TextField";
import SelectField from "@/components/forms/SelectField";
import Button from "@/components/ui/Button";
import FormBanner from "@/components/forms/FormBanner";
import styles from "./onboarding.module.css";

export default function StudentOnboarding() {
  const router = useRouter();

  // Required
  const institution = useField("", isRequired);
  const faculty = useField("", isRequired);
  const yearOfStudy = useField("", yearOfStudyRule);
  const skills = useField("", skillsRule);

  // Optional
  const programme = useField("", checkLength(3, 80));
  const headline = useField("", checkLength(10, 120));
  const locality = useField("", () => null); // a dropdown, always valid
  const github = useField("", githubRule);
  const portfolio = useField("", websiteRule);
  const availableFrom = useField("", dateRule);

  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const required = [institution, faculty, yearOfStudy, skills];
  const all = [
    ...required,
    programme,
    headline,
    github,
    portfolio,
    availableFrom,
  ];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    if (!isFormValid(all)) {
      showAllErrors(all);
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

    // upsert = insert, or update if a row for this student already
    // exists. That makes the form safe to submit twice.
    const { error: studentError } = await supabase.from("students").upsert({
      profile_id: user.id,
      institution: institution.value,
      faculty: faculty.value,
      programme: programme.value.trim() || null,
      year_of_study: Number(yearOfStudy.value),
      // "React, SQL" -> ["React", "SQL"] for the text[] column.
      skills: skills.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      github_url: github.value.trim() || null,
      portfolio_url: portfolio.value.trim() || null,
      available_from: availableFrom.value || null,
    });

    if (studentError) {
      setErrorMessage(studentError.message);
      setIsSending(false);
      return;
    }

    // The headline and locality live on `profiles`, so that is a
    // second write. Only bother if they filled something in.
    if (headline.value.trim() || locality.value) {
      await supabase
        .from("profiles")
        .update({
          headline: headline.value.trim() || null,
          locality: locality.value || null,
        })
        .eq("id", user.id);
    }

    router.push("/dashboard/student");
    router.refresh();
  }

  return (
    <div className={styles.card}>
      {errorMessage && (
        <FormBanner tone="error" title="Could not save your profile">
          {errorMessage}
        </FormBanner>
      )}

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <SelectField
          label="Institution"
          field={institution}
          options={institutions}
          placeholder="Where do you study?"
        />

        <div className={styles.pair}>
          <SelectField
            label="Faculty"
            field={faculty}
            options={faculties}
            placeholder="Choose your faculty"
          />

          <TextField
            label="Year of study"
            field={yearOfStudy}
            type="number"
            placeholder="3"
            hint="1 to 6."
          />
        </div>

        <TextField
          label="Programme"
          field={programme}
          optional
          placeholder="BSc Software Engineering"
        />

        <TextField
          label="Skills"
          field={skills}
          placeholder="React, TypeScript, PostgreSQL, Figma"
          hint="Separate them with commas. These are matched against what employers ask for."
        />

        <div className={styles.group}>
          <p className={styles.groupTitle}>Optional, but worth filling in</p>

          <TextField
            label="One-line headline"
            field={headline}
            optional
            placeholder="Third-year software engineering student — React and Postgres"
            hint="The first thing an employer reads."
          />

          <SelectField
            label="Where you are based"
            field={locality}
            options={localities}
            placeholder="Choose a locality"
            optional
          />

          <div className={styles.pair}>
            <TextField
              label="GitHub repository"
              field={github}
              type="url"
              optional
              placeholder="https://github.com/you/project"
            />

            <TextField
              label="Portfolio or website"
              field={portfolio}
              type="url"
              optional
              placeholder="https://yoursite.mu"
            />
          </div>

          <TextField
            label="Available from"
            field={availableFrom}
            type="date"
            optional
            hint="When could you start an internship?"
          />
        </div>

        <Button type="submit" disabled={isSending} fullWidth size="lg">
          {isSending ? "Saving…" : "Save and continue"}
        </Button>

        <p className={styles.smallPrint}>
          You can change any of this later from your dashboard.
        </p>
      </form>
    </div>
  );
}
