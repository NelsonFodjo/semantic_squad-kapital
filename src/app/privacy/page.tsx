// ============================================================
// PRIVACY  ->  the "/privacy" route
// ============================================================

import SectionHeading from "@/components/ui/SectionHeading";
import styles from "../legal.module.css";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="container-narrow section">
      <SectionHeading as="h1" eyebrow="Privacy" title="What we collect, and why." />

      <div className={styles.prose}>
        <p className={styles.updated}>Last updated 27 July 2026.</p>

        <h2>What we store</h2>
        <p>
          Your name, email address, and whatever you put in your profile. For
          students that means your institution, faculty, year, skills, and any
          links you add. For employers it means your organisation details and
          Business Registration Number.
        </p>

        <h2>Who can see it</h2>
        <p>
          Your profile is public by default, because the point of it is to be
          found by employers. You can make it private from your dashboard.
        </p>
        <p>
          Your applications and challenge proposals are not public. Each one is
          visible to you and to the organisation you sent it to — nobody else,
          including other students. This is enforced by database policies, not
          just by the website.
        </p>

        <h2>Your CV and uploads</h2>
        <p>
          Files you upload are stored privately. Links to them are short-lived and
          generated on demand, so a CV cannot be found by guessing a web address.
        </p>

        <h2>What we do not do</h2>
        <p>
          We do not sell your data, share it with advertisers, or pass it to
          employers you have not applied to. We do not track you across other
          websites.
        </p>

        <h2>Deleting your account</h2>
        <p>
          You can delete your account at any time. Everything attached to it —
          profile, applications, proposals, uploads — is deleted with it.
        </p>

        <h2>Getting in touch</h2>
        <p>
          If you want to know what we hold about you, or want it removed, use the
          contact page and ask. A person will answer.
        </p>
      </div>
    </div>
  );
}
