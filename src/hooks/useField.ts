"use client";

// ============================================================
// useField — everything ONE input box needs to validate itself.
// ============================================================
// A "hook" is reusable React logic. This one remembers what the user
// typed and whether it broke a rule.
//
// Using it in a form takes two lines:
//
//     const email = useField("", emailRule);
//     <TextField label="Email" field={email} />
//
// That box now validates itself.

import { useState } from "react";
import type { Rule } from "@/validation/rules";

export type Field = {
  value: string; // what is currently typed
  error: string | null; // the message, or null if fine
  touched: boolean; // has the user left the box yet?
  showError: boolean; // true only once touched AND broken
  onChange: (next: string) => void;
  onBlur: () => void;
  reset: () => void;
};

export function useField(initialValue: string, rule: Rule): Field {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);

  // Ask the rule about the current value on every render. Cheap,
  // and it means the error can never go stale.
  const error = rule(value);

  return {
    value,
    error,
    touched,

    // Hide the error until the user has left the box once. Showing
    // "invalid email" after the first keystroke feels like nagging.
    showError: touched && error !== null,

    onChange: setValue,
    onBlur: () => setTouched(true),

    reset: () => {
      setValue(initialValue);
      setTouched(false);
    },
  };
}

/* ------------------------------------------------------------ *
 * Helpers for a whole form
 * ------------------------------------------------------------ */

/** True only if every field passes its rule. Check before submitting. */
export function isFormValid(fields: Field[]): boolean {
  return fields.every((field) => field.error === null);
}

/**
 * Mark every box as touched so all the errors become visible at once.
 * Call this when someone submits a form with mistakes still in it —
 * otherwise nothing appears to happen when they press the button.
 */
export function showAllErrors(fields: Field[]): void {
  fields.forEach((field) => field.onBlur());
}

/** Clear a whole form, e.g. after a successful submit. */
export function resetFields(fields: Field[]): void {
  fields.forEach((field) => field.reset());
}
