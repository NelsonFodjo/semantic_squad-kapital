// ============================================================
// OPPORTUNITIES BOARD  ->  the "/opportunities" route
// ============================================================
// A server component. It reads the filters out of the URL, asks the
// database for matching rows, and renders them. The browser gets HTML
// with the results already in it.

import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import FilterBar from "@/components/opportunities/FilterBar";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import { listOpportunities } from "@/lib/db/opportunities";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import styles from "./page.module.css";

export const metadata = {
  title: "Opportunities",
  description:
    "Internships, part-time roles and graduate positions across Mauritius, with the stipend stated up front.",
};

// In Next.js 16 searchParams arrives as a Promise, so it is awaited.
type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function OpportunitiesPage({ searchParams }: Props) {
  const params = await searchParams;

  // Hand the URL's values to the query. Anything absent is undefined,
  // and the query skips undefined filters.
  const opportunities = await listOpportunities({
    sector: params.sector,
    locality: params.locality,
    kind: params.kind,
    mode: params.mode,
    paidOnly: params.paid === "1",
    search: params.q,
  });

  const hasFilters = Object.keys(params).length > 0;

  return (
    <div className="container section">
      <SectionHeading
        as="h1"
        eyebrow="Opportunities"
        title="Roles open right now."
        description="Every listing states its stipend before you apply. Unpaid placements are labelled as such."
      />

      <FilterBar resultCount={opportunities.length} />

      {/* Three possible states, in the order we check them:
          1. Supabase not set up yet
          2. Set up, but nothing matched
          3. Results */}
      {!isSupabaseConfigured() ? (
        <EmptyState
          title="Database not connected yet"
          body="Add your Supabase URL and anon key to .env.local, then run the migration in supabase/migrations. See .env.example for where to find them."
        />
      ) : opportunities.length === 0 ? (
        <EmptyState
          title={hasFilters ? "Nothing matches those filters" : "No open roles yet"}
          body={
            hasFilters
              ? "Try widening your search — clearing the sector or locality usually helps."
              : "Check back soon, or follow a challenge instead while you wait."
          }
          actionLabel={hasFilters ? "Clear filters" : "Browse challenges"}
          actionHref={hasFilters ? "/opportunities" : "/challenges"}
        />
      ) : (
        <div className={styles.grid}>
          {opportunities.map((opportunity, index) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
