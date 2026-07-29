
// TERMS  

import SectionHeading from "@/components/ui/SectionHeading";
import styles from "../legal.module.css";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="container-narrow section">
      <SectionHeading as="h1" eyebrow="Terms" title="The rules, in plain words." />

      <div className={styles.prose}>
        <p className={styles.updated}>Last updated 27 July 2026.</p>

        <h2>Who can join</h2>
        <p>
          Student accounts require an email address from a Mauritian
          higher-education institution. Employer accounts require a real
          organisation — one you are authorised to post on behalf of.
        </p>

        <h2>What you post</h2>
        <p>
          Everything you write must be your own work and accurate. Listing a
          stipend you do not intend to pay, or submitting a proposal someone else
          wrote, will get the account removed.
        </p>

        <h2>Your proposals stay yours</h2>
        <p>
          Submitting a proposal to a challenge does not transfer ownership of your
          idea. An organisation may read it to assess you. If they want to build
          on it, that is a separate conversation and a separate agreement.
        </p>

        <h2>What we do not promise</h2>
        <p>
          We do not guarantee you a placement, and we are not party to any
          agreement you reach with an employer. We check Business Registration
          Numbers before granting a verified tick, but a tick is not a reference —
          use your judgement, and tell us if something feels wrong.
        </p>

        <h2>Unpaid placements</h2>
        <p>
          We allow them, and we require them to be labelled. We do not allow a
          placement to be advertised as paid without a stated figure.
        </p>

        <h2>Changes</h2>
        <p>
          If we change these terms in a way that materially affects you, we will
          email you before it takes effect.
        </p>

        <h2>Leaving</h2>
        <p>You can close your account whenever you like, no reason needed.</p>
      </div>
    </div>
  );
}
