// ============================================================
// ROOT LAYOUT — wraps every page in the app.
// ============================================================
// Anything that must appear on all pages goes here: the navbar, the
// footer, and the browser tab title. `children` is whichever page the
// visitor asked for.
//
// A note on fonts: Instrument Serif is loaded by an @import at the top
// of globals.css, and wired to --font-display in tokens.css. Body text
// deliberately uses the fonts already on the device — Instrument Serif
// is a light display face that looks thin below about 20px.

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBackground from "@/components/layout/PageBackground";

export const metadata: Metadata = {
  title: {
    default: "Kapital — Internships & industry challenges in Mauritius",
    template: "%s · Kapital",
  },
  description:
    "Where Mauritian university students meet professionals: internships, real industry challenges, and open-source projects worth building.",
};

// Sets data-color-scheme on <html> before the browser paints, so a
// returning visitor's saved theme (or their OS preference, the first
// time) applies immediately rather than flashing the other theme for
// a frame. Must run inline and synchronously — a useEffect in
// ThemeToggle would run after first paint, too late to prevent that.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("kapital-color-scheme");
    var scheme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-color-scheme", scheme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: themeInitScript below sets
    // data-color-scheme on this element before React hydrates, so the
    // attribute React sees on the client legitimately differs from
    // what the server rendered. That mismatch is expected and safe —
    // without this prop React logs a hydration warning for it anyway.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {/* Ambient route-aware background layers */}
        <PageBackground />

        {/* Lets keyboard users jump straight past the navigation.
            Invisible until focused — see .sr-only in base.css. */}
        <a href="#main" className="sr-only">
          Skip to content
        </a>

        <Navbar />

        <main id="main">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
