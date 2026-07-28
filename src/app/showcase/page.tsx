// ============================================================
// SHOWCASE  ->  the "/showcase" route
// ============================================================
// The public gallery of work students have actually shipped. This is
// the page a student can send an employer instead of a CV.

import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import ShowcaseTile from "@/components/showcase/ShowcaseTile";
import { listShowcase } from "@/lib/db/showcase";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import styles from "./page.module.css";

export const metadata = {
  title: "Showcase",
  description:
    "Case studies from Mauritian students: what they built, how they approached it, and what did not work.",
};

export default async function ShowcasePage() {
  const items = await listShowcase();

  return (
    <div className="container section">
      <SectionHeading
        as="h1"
        eyebrow="Showcase"
        title="Work, written up properly."
        description="Not a list of technologies — an account of the problem, the decisions, and what the student would do differently. Employers read these."
      />

      {!isSupabaseConfigured() ? (
        <EmptyState
          title="Database not connected yet"
          body="Add your Supabase credentials to .env.local and run the migrations in supabase/migrations."
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="Nothing published yet"
          body="Case studies appear here once students complete a challenge or an internship."
          actionLabel="See open challenges"
          actionHref="/challenges"
        />
      ) : (
        <div className={styles.grid}>
          {items.map((item, index) => (
            // The first tile is given the wide treatment. index is the
            // position in the list, counting from 0.
            <div key={item.id} className={index === 0 ? styles.featured : ""}>
              <ShowcaseTile
                item={item}
                wide={index === 0}
                // The wide first tile needs a bigger image than the rest,
                // so we tell the browser that up front.
                sizes={
                  index === 0
                    ? "(max-width: 1100px) 100vw, 66vw"
                    : "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
