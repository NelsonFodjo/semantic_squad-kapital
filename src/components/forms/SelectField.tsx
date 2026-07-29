"use client";

// ============================================================
// SelectField — liquid glass custom dropdown component.
// ============================================================

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { Field } from "@/hooks/useField";
import styles from "./Field.module.css";

type Props = {
  label: string;
  field: Field;
  /** The choices. Strings are used as both value and visible text. */
  options: readonly string[];
  /** The greyed-out first row, e.g. "Choose your faculty". */
  placeholder?: string;
  hint?: string;
  optional?: boolean;
};

export default function SelectField({
  label,
  field,
  options,
  placeholder = "Choose one",
  hint,
  optional = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        field.onBlur();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [field]);

  const selectedText = field.value || placeholder;

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <span className={styles.label}>
        {label}
        {optional && <span className={styles.optional}>optional</span>}
      </span>

      <div className={styles.customSelectContainer}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`${styles.control} ${styles.customSelectTrigger} ${
            field.showError ? styles.invalid : ""
          } ${!field.value ? styles.placeholderText : ""}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={styles.selectedLabel}>{selectedText}</span>
          <ChevronDown
            size={18}
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          />
        </button>

        {isOpen && (
          <div
            className={`liquid-glass ${styles.dropdownMenu}`}
            role="listbox"
            tabIndex={-1}
          >
            <div
              className={`${styles.dropdownOption} ${
                !field.value ? styles.activeOption : ""
              }`}
              role="option"
              aria-selected={!field.value}
              onClick={() => {
                field.onChange("");
                setIsOpen(false);
              }}
            >
              <span className={styles.optionText}>{placeholder}</span>
              {!field.value && <Check size={16} className={styles.checkIcon} />}
            </div>

            {options.map((option) => {
              const isSelected = field.value === option;
              return (
                <div
                  key={option}
                  className={`${styles.dropdownOption} ${
                    isSelected ? styles.activeOption : ""
                  }`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    field.onChange(option);
                    setIsOpen(false);
                  }}
                >
                  <span className={styles.optionText}>{option}</span>
                  {isSelected && (
                    <Check size={16} className={styles.checkIcon} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <span className={styles.message} aria-live="polite">
        {field.showError ? (
          <span className={styles.error}>{field.error}</span>
        ) : (
          hint && <span className={styles.hint}>{hint}</span>
        )}
      </span>
    </div>
  );
}
