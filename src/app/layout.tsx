// ROOT LAYOUT — wraps every page in the app.

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBackground from "@/components/layout/PageBackground";

export const metadata: Metadata = {
  metadataBase: new URL("https://semantic-squad-kapital.vercel.app"),
  title: {
    default: "Kapital — Internships & industry challenges in Mauritius",
    template: "%s · Kapital",
  },
  description:
    "Where Mauritian university students meet professionals: internships, real industry challenges, and open-source projects worth building.",
  openGraph: {
    title: "Kapital — Build and Connect in Mauritius",
    description:
      "Kapital connects Mauritian university students with employers offering internships, industry challenges, and open-source work.",
    url: "https://semantic-squad-kapital.vercel.app",
    siteName: "Kapital",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://semantic-squad-kapital.vercel.app",
  },
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
