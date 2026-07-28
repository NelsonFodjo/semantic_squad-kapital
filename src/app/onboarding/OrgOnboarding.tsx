"use client";

// ============================================================
// OrgOnboarding — the employer's first-run organisation form.
// ============================================================
// Two writes that must both succeed: create the organisation, then
// add this person as a member of it. Without the membership row the
// RLS policies will not let them post anything.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useField, isFormValid, showAllErrors } from "@/hooks/useField";
import {
  isRequired,
  brnRule,
  websiteRule,
  longTextRule,
  checkLength,
} from "@/validation/rules";
import { sectors, localities } from "@/data/taxonomy";
import TextField from "@/components/forms/TextField";
import TextAreaField from "@/components/forms/TextAreaField";
import SelectField from "@/components/forms/SelectField";
import Button from "@/components/ui/Button";
import FormBanner from "@/components/forms/FormBanner";
import styles from "./onboarding.module.css";

/** "CloudFactory Mauritius" -> "cloudfactory-mauritius" */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    // Replace every run of non-letters/numbers with a single hyphen.
    .replace(/[^a-z0-9]+/g, "-")
    // Then trim hyphens off both ends.
    .replace(/^-+|-+$/g, "");
}

export default function OrgOnboarding() {
  const router = useRouter();

  const name = useField("", checkLength(2, 80));
  const sector = useField("", isRequired);
  const brn = useField("", brnRule);
  const locality = useField("", () => null);
  const website = useField("", websiteRule);
  const about = useField("", longTextRule(40, 600));

  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fields = [name, sector, brn, website, about];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    // The name is optional-looking to checkLength, which passes empty
    // values through, so check it is filled in explicitly.
    if (name.value.trim() === "") {
      showAllErrors(fields);
      setErrorMessage("Your organisation needs a name.");
      return;
    }

    if (!isFormValid(fields)) {
      showAllErrors(fields);
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

    // .select().single() asks for the new row back, because we need its
    // id for the membership insert below.
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: name.value.trim(),
        slug: toSlug(name.value),
        sector: sector.value,
        brn: brn.value.trim().toUpperCase() || null,
        locality: locality.value || null,
        website: website.value.trim() || null,
        about: about.value.trim() || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (orgError) {
      setIsSending(false);
      setErrorMessage(
        // 23505 is a unique-constraint violation, which here means the
        // slug is taken — another company with the same name.
        orgError.code === "23505"
          ? "An organisation with that name already exists. Try adding your location to the name."
          : orgError.message,
      );
      return;
    }

    const { error: memberError } = await supabase.from("org_members").insert({
      org_id: org.id,
      profile_id: user.id,
      member_role: "owner",
    });

    setIsSending(false);

    if (memberError) {
      // The organisation exists but we could not attach this person to
      // it, which would leave them unable to post. Say so plainly
      // rather than sending them to a dashboard that will not work.
      setErrorMessage(
        `Your organisation was created but we could not add you to it: ${memberError.message}`,
      );
      return;
    }

    router.push("/dashboard/employer");
    router.refresh();
  }

  return (
    <div className={styles.card}>
      {errorMessage && (
        <FormBanner tone="error" title="Could not create your organisation">
          {errorMessage}
        </FormBanner>
      )}

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <TextField
          label="Organisation name"
          field={name}
          placeholder="CloudFactory Mauritius"
        />

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
            optional
          />
        </div>

        <TextField
          label="Business Registration Number"
          field={brn}
          placeholder="C12345678"
          hint="The letter C followed by 8 digits. This is what earns the verified tick."
        />

        <TextField
          label="Website"
          field={website}
          type="url"
          optional
          placeholder="https://yourcompany.mu"
        />

        <TextAreaField
          label="About your organisation"
          field={about}
          rows={4}
          maxLength={600}
          placeholder="We build back-office platforms for insurers across the region. Team of 40, half of whom joined as interns."
          hint="Students read this before applying. Be specific about what you actually do."
        />

        <Button type="submit" disabled={isSending} fullWidth size="lg">
          {isSending ? "Creating…" : "Create organisation"}
        </Button>

        <p className={styles.smallPrint}>
          Verification is manual and usually takes a day or two. You can post
          before it completes.
        </p>
      </form>
    </div>
  );
}
