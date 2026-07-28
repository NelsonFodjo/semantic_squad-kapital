// ============================================================
// ONE OPPORTUNITY  ->  the "/opportunities/<slug>" route
// ============================================================
// The square brackets in the folder name make it a dynamic route:
// [slug] matches any value and hands it to us as params.slug.
//
//     /opportunities/frontend-engineering-intern-cloudfactory
//     -> params.slug = "frontend-engineering-intern-cloudfactory"

import Link from "next/link";
import { notFound } from "next/navigation";
import Tag, { TagRow } from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import ApplyForm from "@/components/opportunities/ApplyForm";
import { getOpportunityBySlug } from "@/lib/db/opportunities";
import { hasApplied } from "@/lib/db/submissions";
import { getCurrentUserId } from "@/lib/supabase/server";
import {
  formatStipend,
  formatDeadline,
  formatDuration,
  formatDate,
  labelKind,
  labelMode,
} from "@/lib/format";
import { isClosed } from "@/lib/format";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

// Sets the browser tab title from the posting itself. Next.js calls
// this before rendering the page.
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const opportunity = await getOpportunityBySlug(slug);

  if (!opportunity) return { title: "Opportunity not found" };

  return {
    title: opportunity.title,
    description: opportunity.summary,
  };
}

export default async function OpportunityPage({ params }: Props) {
  const { slug } = await params;
  const opportunity = await getOpportunityBySlug(slug);

  // A URL that matches nothing renders the 404 page. notFound() stops
  // execution here, so nothing below runs.
  if (!opportunity) notFound();

  const org = opportunity.organizations;
  const closed = isClosed(opportunity.closes_at) || opportunity.status !== "open";

  // Who is looking? Decides between the form, a login prompt, and
  // "you have already applied".
  const userId = await getCurrentUserId();
  const alreadyApplied = userId ? await hasApplied(opportunity.id, userId) : false;

  return (
    <div className="container section">
      <Link href="/opportunities" className={styles.back}>
        ← All opportunities
      </Link>

      <div className={styles.layout}>
        {/* ---------------- Left: the posting ---------------- */}
        <article>
          <header className={styles.header}>
            <p className={styles.org}>
              {org ? (
                <Link href={`/employers/${org.slug}`} className={styles.orgLink}>
                  {org.name}
                </Link>
              ) : (
                "Employer"
              )}
              {org?.is_verified && (
                <span className={styles.verified} title="Verified employer">
                  ✓
                </span>
              )}
            </p>

            <h1 className={styles.title}>{opportunity.title}</h1>
            <p className={styles.summary}>{opportunity.summary}</p>

            <TagRow>
              <Tag tone="solid">{labelKind(opportunity.kind)}</Tag>
              <Tag>{opportunity.sector}</Tag>
              <Tag>{labelMode(opportunity.mode)}</Tag>
              {closed && <Tag tone="danger">Closed</Tag>}
            </TagRow>
          </header>

          <h2 className={styles.bodyHeading}>About the role</h2>
          <div className={styles.body}>{opportunity.description}</div>
        </article>

        {/* ---------------- Right: facts and apply ---------------- */}
        <aside className={styles.sidebar}>
          <div className={`liquid-glass ${styles.factsCard}`}>
            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt className={styles.factLabel}>Stipend</dt>
                <dd
                  className={
                    opportunity.is_paid ? styles.stipendValue : styles.unpaidValue
                  }
                >
                  {formatStipend(
                    opportunity.is_paid,
                    opportunity.stipend_min,
                    opportunity.stipend_max,
                  )}
                </dd>
              </div>

              <div className={styles.fact}>
                <dt className={styles.factLabel}>Location</dt>
                <dd className={styles.factValue}>{opportunity.locality}</dd>
              </div>

              <div className={styles.fact}>
                <dt className={styles.factLabel}>Duration</dt>
                <dd className={styles.factValue}>
                  {formatDuration(opportunity.duration_weeks)}
                </dd>
              </div>

              <div className={styles.fact}>
                <dt className={styles.factLabel}>Positions</dt>
                <dd className={styles.factValue}>{opportunity.positions}</dd>
              </div>

              <div className={styles.fact}>
                <dt className={styles.factLabel}>Closing date</dt>
                <dd className={styles.factValue}>
                  {opportunity.closes_at
                    ? `${formatDate(opportunity.closes_at)} · ${formatDeadline(
                        opportunity.closes_at,
                      )}`
                    : "Open until filled"}
                </dd>
              </div>
            </dl>

            {opportunity.skills_required.length > 0 && (
              <div className={styles.skillsBlock}>
                <p className={styles.skillsLabel}>Skills they mentioned</p>
                <TagRow>
                  {opportunity.skills_required.map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </TagRow>
              </div>
            )}
          </div>

          {/* Four states, checked in order of what matters most:
              closed, already applied, not logged in, ready to apply. */}
          {closed ? (
            <div className={`liquid-glass ${styles.notice}`}>
              <p className={styles.noticeTitle}>Applications have closed</p>
              <p className={styles.noticeBody}>
                This one has passed its closing date, but there are others open.
              </p>
              <Button href="/opportunities" variant="secondary" size="sm">
                See open roles
              </Button>
            </div>
          ) : alreadyApplied ? (
            <div className={`liquid-glass ${styles.notice}`}>
              <p className={styles.noticeTitle}>You have applied</p>
              <p className={styles.noticeBody}>
                Track the status of this application from your dashboard.
              </p>
              <Button href="/dashboard/student" variant="secondary" size="sm">
                My applications
              </Button>
            </div>
          ) : !userId ? (
            <div className={`liquid-glass ${styles.notice}`}>
              <p className={styles.noticeTitle}>Log in to apply</p>
              <p className={styles.noticeBody}>
                Free for students with a university email address.
              </p>
              {/* Sending the current path along means login can bring
                  them straight back here afterwards. */}
              <Button href={`/login?next=/opportunities/${opportunity.slug}`}>
                Log in or sign up
              </Button>
            </div>
          ) : (
            <ApplyForm
              opportunityId={opportunity.id}
              jobTitle={opportunity.title}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
