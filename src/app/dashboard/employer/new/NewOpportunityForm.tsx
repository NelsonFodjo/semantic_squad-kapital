"use client";

// ============================================================
// NewOpportunityForm — the employer's posting form.
// ============================================================
// The one interesting rule here: the stipend fields are only required
// when "this role is paid" is ticked. The database enforces the same
// thing with the paid_needs_stipend check constraint, so an unpaid
// posting can never quietly hide what it pays.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useField, isFormValid, showAllErrors } from "@/hooks/useField";
import {
  isRequired,
  titleRule,
  longTextRule,
  stipendRule,
  weeksRule,
  skillsRule,
  deadlineRule,
  checkLength,
} from "@/validation/rules";
import { sectors, localities } from "@/data/taxonomy";
import TextField from "@/components/forms/TextField";
import TextAreaField from "@/components/forms/TextAreaField";
import SelectField from "@/components/forms/SelectField";
import Button from "@/components/ui/Button";
import FormBanner from "@/components/forms/FormBanner";
import styles from "./form.module.css";

/** Turns a job title into a URL-safe slug. */
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// The database enum values, paired with what a person should read.
const kinds = [
  { value: "internship", label: "Internship" },
  { value: "part_time", label: "Part-time" },
  { value: "graduate", label: "Graduate role" },
];

const modes = [
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
];

type Props = {
  orgId: string;
};

export default function NewOpportunityForm({ orgId }: Props) {
  const router = useRouter();

  const [kind, setKind] = useState("internship");
  const [mode, setMode] = useState("onsite");
  const [isPaid, setIsPaid] = useState(true);

  const title = useField("", titleRule);
  const summary = useField("", checkLength(20, 160));
  const description = useField("", longTextRule(120, 6000));
  const sector = useField("", isRequired);
  const locality = useField("", isRequired);
  const weeks = useField("", weeksRule);
  const skills = useField("", skillsRule);
  const closesAt = useField("", deadlineRule);

  // Only required when the role is paid, so the rule is chosen from
  // the checkbox. useField re-runs its rule every render, so ticking
  // the box immediately re-validates whatever is already typed.
  const stipendMin = useField("", isPaid ? (v) => isRequired(v) ?? stipendRule(v) : stipendRule);
  const stipendMax = useField("", stipendRule);

  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fields = [
    title,
    summary,
    description,
    sector,
    locality,
    weeks,
    skills,
    closesAt,
    stipendMin,
    stipendMax,
  ];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    if (!isFormValid(fields)) {
      showAllErrors(fields);
      return;
    }

    // A range that runs backwards is always a mistake, and it is
    // easier to catch here than to explain a database error.
    const min = Number(stipendMin.value);
    const max = Number(stipendMax.value);
    if (isPaid && stipendMax.value && max < min) {
      setErrorMessage("The maximum stipend cannot be lower than the minimum.");
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

    const { error } = await supabase.from("opportunities").insert({
      org_id: orgId,
      title: title.value.trim(),
      // Adding the time makes a collision between two postings with
      // the same title very unlikely.
      slug: `${toSlug(title.value)}-${Date.now().toString(36)}`,
      summary: summary.value.trim(),
      description: description.value.trim(),
      kind,
      sector: sector.value,
      locality: locality.value,
      mode,
      is_paid: isPaid,
      stipend_min: isPaid && stipendMin.value ? min : null,
      stipend_max: isPaid && stipendMax.value ? max : null,
      duration_weeks: weeks.value ? Number(weeks.value) : null,
      skills_required: skills.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      closes_at: closesAt.value || null,
      // Published straight away. Change to "draft" if you would rather
      // review postings before students see them.
      status: "open",
      created_by: user.id,
    });

    setIsSending(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/dashboard/employer");
    router.refresh();
  }

  return (
    <div className={styles.card}>
      {errorMessage && (
        <FormBanner tone="error" title="Could not post this opportunity">
          {errorMessage}
        </FormBanner>
      )}

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <TextField
          label="Job title"
          field={title}
          placeholder="Frontend Engineering Intern"
        />

        <TextField
          label="One-line summary"
          field={summary}
          placeholder="Build real customer-facing screens in React with a mentor reviewing every pull request."
          hint="This is the line students read on the card. 20-160 characters."
        />

        {/* ---------- Type and mode ----------
            Radio-style button rows rather than dropdowns, because
            there are only three options and both matter a lot. */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Type of position</legend>
          <div className={styles.choices}>
            {kinds.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setKind(option.value)}
                className={`${styles.choice} ${
                  kind === option.value ? styles.choiceActive : ""
                }`}
                aria-pressed={kind === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>How the work happens</legend>
          <div className={styles.choices}>
            {modes.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                className={`${styles.choice} ${
                  mode === option.value ? styles.choiceActive : ""
                }`}
                aria-pressed={mode === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className={styles.pair}>
          <SelectField
            label="Sector"
            field={sector}
            options={sectors}
            placeholder="Choose a sector"
          />

          <SelectField
            label="Location"
            field={locality}
            options={localities}
            placeholder="Choose a locality"
          />
        </div>

        {/* ---------- Pay ---------- */}
        <div className={styles.group}>
          <p className={styles.groupTitle}>Pay</p>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
            />
            This role is paid
          </label>

          {isPaid ? (
            <div className={styles.pair}>
              <TextField
                label="Stipend from"
                field={stipendMin}
                type="number"
                placeholder="15000"
                hint="Rupees per month."
              />
              <TextField
                label="Stipend up to"
                field={stipendMax}
                type="number"
                optional
                placeholder="20000"
                hint="Leave blank for a fixed figure."
              />
            </div>
          ) : (
            <FormBanner tone="info" title="This will be labelled Unpaid">
              Unpaid placements are shown with a clear label. Students can filter
              them out, so say in the description what they get instead.
            </FormBanner>
          )}
        </div>

        {/* ---------- Detail ---------- */}
        <div className={styles.group}>
          <p className={styles.groupTitle}>Detail</p>

          <TextAreaField
            label="Full description"
            field={description}
            rows={10}
            maxLength={6000}
            placeholder={
              "What you will actually do:\n- Build and test React components\n- Pair with a senior engineer twice a week\n\nWhat we expect, and what we do not expect you to know already."
            }
            hint="Be concrete about the work and the expectations. 120 characters minimum."
          />

          <div className={styles.pair}>
            <TextField
              label="Duration in weeks"
              field={weeks}
              type="number"
              placeholder="12"
              hint="1 to 52."
            />

            <TextField
              label="Closing date"
              field={closesAt}
              type="date"
              hint="Must be in the future."
            />
          </div>

          <TextField
            label="Skills you are looking for"
            field={skills}
            placeholder="React, JavaScript, CSS, Git"
            hint="Separate with commas. These are matched against student profiles."
          />
        </div>

        <Button type="submit" disabled={isSending} fullWidth size="lg">
          {isSending ? "Publishing…" : "Publish opportunity"}
        </Button>

        <p className={styles.smallPrint}>
          This goes live immediately and appears on the public board.
        </p>
      </form>
    </div>
  );
}
