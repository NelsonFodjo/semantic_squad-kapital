// ============================================================
// CHALLENGES  ->  the "/challenges" route
// ============================================================
// Industry problems and open-source projects. Students answer with a
// proposal rather than a CV, which is the point of this section.

import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import { listChallenges } from "@/lib/db/challenges";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import styles from "./page.module.css";

export const metadata = {
  title: "Challenges",
  description:
    "Real industry problems and open-source projects posted by Mauritian companies. Submit a proposal, not a CV.",
};

// The two kinds, used for the tab strip. An empty value means "all".
const tabs = [
  { value: "", label: "Everything" },
  { value: "challenge", label: "Industry challenges" },
  { value: "open_source", label: "Open source" },
];

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function ChallengesPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeKind = params.kind ?? "";

  const challenges = await listChallenges({
    kind: params.kind,
    sector: params.sector,
    search: params.q,
  });

  return (
    <div className="container section">
      <SectionHeading
        as="h1"
        eyebrow="Challenges"
        title="Problems worth your weekend."
        description="Companies post something they genuinely have not solved. You answer with how you would approach it — no prior experience required, just reasoning you can defend."
      />

      {/* Tabs are plain links, not buttons. That keeps them working
          without JavaScript and makes each tab shareable. */}
      <nav className={styles.tabs} aria-label="Filter by kind">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/challenges?kind=${tab.value}` : "/challenges"}
            className={`${styles.tab} ${
              activeKind === tab.value ? styles.tabActive : ""
            }`}
            aria-current={activeKind === tab.value ? "page" : undefined}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {!isSupabaseConfigured() ? (
        <EmptyState
          title="Database not connected yet"
          body="Add your Supabase URL and anon key to .env.local, then run the migrations in supabase/migrations."
        />
      ) : challenges.length === 0 ? (
        <EmptyState
          title="No open challenges right now"
          body="New ones are posted through the year. In the meantime, the opportunity board has roles open."
          actionLabel="Browse opportunities"
          actionHref="/opportunities"
        />
      ) : (
        <div className={styles.grid}>
          {challenges.map((challenge, index) => (
            <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
