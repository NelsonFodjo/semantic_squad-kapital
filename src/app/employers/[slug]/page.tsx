// ============================================================
// PUBLIC EMPLOYER PAGE  ->  "/employers/<slug>"
// ============================================================
// Who a student would be working for, and everything that employer
// currently has open.

import { notFound } from "next/navigation";
import Tag, { TagRow } from "@/components/ui/Tag";
import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import { getOrganizationBySlug } from "@/lib/db/profiles";
import { listOpportunitiesByOrg } from "@/lib/db/opportunities";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);

  if (!org) return { title: "Employer not found" };

  return { title: org.name, description: org.about ?? undefined };
}

export default async function EmployerPage({ params }: Props) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);

  if (!org) notFound();

  const all = await listOpportunitiesByOrg(org.id);

  // Only show what a student could actually apply to. Drafts and
  // closed postings are filtered out here rather than in the query,
  // because the same query serves the employer's own dashboard.
  const open = all.filter((o) => o.status === "open");

  return (
    <div className="container section">
      <header className={styles.header}>
        <h1 className={styles.name}>{org.name}</h1>

        <TagRow>
          <Tag tone="neutral">{org.sector}</Tag>
          {org.locality && <Tag tone="outline">{org.locality}</Tag>}
          {org.is_verified ? (
            <Tag tone="success">✓ Verified</Tag>
          ) : (
            <Tag tone="warning">Pending verification</Tag>
          )}
        </TagRow>

        {org.about && <p className={styles.about}>{org.about}</p>}

        {org.website && (
          <a
            href={org.website}
            className={styles.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* Strip the protocol so the link reads as a domain. */}
            {org.website.replace(/^https?:\/\//, "")} ↗
          </a>
        )}
      </header>

      <SectionHeading
        title="Open positions"
        description={`${open.length} ${open.length === 1 ? "role" : "roles"} currently accepting applications.`}
      />

      {open.length === 0 ? (
        <EmptyState
          title="Nothing open right now"
          body="This employer has no live postings. The main board has others."
          actionLabel="Browse all opportunities"
          actionHref="/opportunities"
        />
      ) : (
        <div className={styles.grid}>
          {open.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      )}
    </div>
  );
}
