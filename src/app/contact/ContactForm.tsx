"use client";

// ============================================================
// ContactForm — the enquiry form.
// ============================================================
// This one exercises the most regex rules in a single place: name,
// email, Mauritian phone, website, and a length-checked message.
//
// It does not write to the database. There is no `enquiries` table
// yet, so on submit it validates and confirms. Wiring it up later
// means adding a table and one insert call — everything else here
// already works.

import { useState } from "react";
import { useField, isFormValid, showAllErrors, resetFields } from "@/hooks/useField";
import {
  fullNameRule,
  emailRule,
  phoneRule,
  websiteRule,
  longTextRule,
} from "@/validation/rules";
import TextField from "@/components/forms/TextField";
import TextAreaField from "@/components/forms/TextAreaField";
import Button from "@/components/ui/Button";
import FormBanner from "@/components/forms/FormBanner";
import styles from "./page.module.css";

export default function ContactForm() {
  const name = useField("", fullNameRule);
  const email = useField("", emailRule);
  const phone = useField("", phoneRule);
  const website = useField("", websiteRule); // optional
  const message = useField("", longTextRule(30, 1500));

  const [isDone, setIsDone] = useState(false);

  const fields = [name, email, phone, website, message];

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!isFormValid(fields)) {
      showAllErrors(fields);
      return;
    }

    // Where a real send would go. Until there is somewhere to send it,
    // confirm and clear rather than pretend.
    setIsDone(true);
    resetFields(fields);
  }

  if (isDone) {
    return (
      <FormBanner tone="success" title="Message received">
        Thanks — we will reply within two working days. Nothing was actually sent
        yet: this form is validated but not wired to a mailbox.
      </FormBanner>
    );
  }

  return (
    <div className={`liquid-glass ${styles.card}`}>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <div className={styles.pair}>
          <TextField
            label="Your name"
            field={name}
            placeholder="Anjali Peerthum"
            autoComplete="name"
          />

          <TextField
            label="Email"
            field={email}
            type="email"
            placeholder="you@company.mu"
            autoComplete="email"
          />
        </div>

        <div className={styles.pair}>
          <TextField
            label="Phone"
            field={phone}
            type="tel"
            placeholder="+230 5712 3456"
            hint="Mauritian numbers, with the +230."
            autoComplete="tel"
          />

          <TextField
            label="Website"
            field={website}
            type="url"
            optional
            placeholder="https://yourcompany.mu"
          />
        </div>

        <TextAreaField
          label="Your message"
          field={message}
          rows={7}
          maxLength={1500}
          placeholder="We are a small fintech in Ebène and would like to post two internships for the July intake..."
          hint="At least 30 characters."
        />

        <Button type="submit" fullWidth size="lg">
          Send message
        </Button>
      </form>
    </div>
  );
}
