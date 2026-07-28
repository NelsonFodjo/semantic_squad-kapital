// ============================================================
// Button — every button and button-styled link in the app.
// ============================================================
// One component with variants, so buttons stay consistent. If you
// need a new look, add a variant here rather than styling a button
// inside a page.
//
//   <Button variant="primary">Apply now</Button>
//   <Button href="/signup" variant="secondary">Join</Button>

import Link from "next/link";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  /** Pass an href and you get a link that looks like a button. */
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  type = "button",
  disabled = false,
  fullWidth = false,
  onClick,
}: Props) {
  // Build the class list once, then use it for either element.
  // .filter(Boolean) drops the empty strings when a flag is off.
  const className = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
  ]
    .filter(Boolean)
    .join(" ");

  // If there is an href, this is navigation — render a real link so
  // it can be opened in a new tab and read by search engines.
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={className} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
