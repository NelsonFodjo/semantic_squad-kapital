// ============================================================
// STUDENT DASHBOARD  ->  the "/dashboard/student" route
// ============================================================
// Everything a student has sent: applications and proposals, with
// where each one has got to.
//
// Every query here relies on Row Level Security. We pass the user's
// own id, and the database independently checks that the rows belong
// to whoever is asking — so even a bug in this file cannot leak
// another student's data.

import Link from "next/link";
import { redirect } from "next/navigation";
import Tag, { statusTone } from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { getMyProfile } from "@/lib/db/profiles";
import { listMyApplications, listMyProposals } from "@/lib/db/submissions";
import { formatDate, labelStatus } from "@/lib/format";
import styles from "../dashboard.module.css";

export const metadata = { title: "My dashboard" };

export default async function StudentDashboard() {
  const profile = await getMyProfile();

  // Middleware keeps anonymous visitors out, but an employer could
  // still type this URL, so check the role too.
  if (!profile) redirect("/login");
  if (profile.role === "professional") redirect("/dashboard/employer");

  // Both queries at once with Promise.all, rather than waiting for the
  // first to finish before starting the second.
  const [applications, proposals] = await Promise.all([
    listMyApplications(profile.id),
    listMyProposals(profile.id),
  ]);

  // Count the ones that have moved past "applied", which is the number
  // a student actually cares about.
  const progressing = applications.filter((a) =>
    ["shortlisted", "interview", "offer"].includes(a.status),
  ).length;

  return (
    <div className="container section">
      <header className={styles.header}>
        <div>
          {/* Just the first name — friendlier, and it fits. */}
          <h1 className={styles.greeting}>
            Hello, {profile.full_name.split(" ")[0]}
          </h1>
          <p className={styles.subtitle}>
            Everything you have sent, and where it stands.
          </p>
        </div>

        <Button href={`/students/${profile.slug}`} variant="secondary" size="sm">
          View my public profile
        </Button>
      </header>

      {/* ---------------- Summary tiles ---------------- */}
      <div className={styles.tiles}>
        <div className={`liquid-glass ${styles.tile}`}>
          <span className={styles.tileValue}>{applications.length}</span>
          <span className={styles.tileLabel}>Applications sent</span>
        </div>

        <div className={`liquid-glass ${styles.tile}`}>
          <span className={styles.tileValue}>{progressing}</span>
          <span className={styles.tileLabel}>Moving forward</span>
        </div>

        <div className={`liquid-glass ${styles.tile}`}>
          <span className={styles.tileValue}>{proposals.length}</span>
          <span className={styles.tileLabel}>Proposals submitted</span>
        </div>
      </div>

      {/* ---------------- Applications ---------------- */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Applications</h2>
          <Button href="/opportunities" variant="ghost" size="sm">
            Find more roles →
          </Button>
        </div>

        {applications.length === 0 ? (
          <EmptyState
            title="You have not applied to anything yet"
            body="The board lists every open internship, with the stipend stated before you apply."
            actionLabel="Browse opportunities"
            actionHref="/opportunities"
          />
        ) : (
          <div className={styles.rows}>
            {applications.map((application) => {
              const opportunity = application.opportunities;

              return (
                <article key={application.id} className={`liquid-glass ${styles.row}`}>
                  <div className={styles.rowTop}>
                    {/* The posting may have been deleted since applying,
                        so fall back rather than crash on a null. */}
                    {opportunity ? (
                      <Link
                        href={`/opportunities/${opportunity.slug}`}
                        className={styles.rowTitle}
                      >
                        {opportunity.title}
                      </Link>
                    ) : (
                      <span className={styles.rowTitle}>Role no longer listed</span>
                    )}

                    <Tag tone={statusTone(application.status)}>
                      {labelStatus(application.status)}
                    </Tag>
                  </div>

                  <div className={styles.rowMeta}>
                    <span>{opportunity?.organizations?.name ?? "Employer"}</span>
                    <span>Applied {formatDate(application.created_at)}</span>
                  </div>

                  <p className={styles.rowExcerpt}>{application.cover_note}</p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------------- Proposals ---------------- */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Challenge proposals</h2>
          <Button href="/challenges" variant="ghost" size="sm">
            See open challenges →
          </Button>
        </div>

        {proposals.length === 0 ? (
          <EmptyState
            title="No proposals yet"
            body="Challenges are the fastest way to get noticed without prior experience — you are judged on your reasoning, not your CV."
            actionLabel="See open challenges"
            actionHref="/challenges"
          />
        ) : (
          <div className={styles.rows}>
            {proposals.map((proposal) => {
              const challenge = proposal.challenges;

              return (
                <article key={proposal.id} className={`liquid-glass ${styles.row}`}>
                  <div className={styles.rowTop}>
                    {challenge ? (
                      <Link
                        href={`/challenges/${challenge.slug}`}
                        className={styles.rowTitle}
                      >
                        {challenge.title}
                      </Link>
                    ) : (
                      <span className={styles.rowTitle}>
                        Challenge no longer listed
                      </span>
                    )}

                    <Tag tone={statusTone(proposal.status)}>
                      {labelStatus(proposal.status)}
                    </Tag>
                  </div>

                  <div className={styles.rowMeta}>
                    <span>{challenge?.organizations?.name ?? "Organisation"}</span>
                    <span>Submitted {formatDate(proposal.created_at)}</span>
                    {proposal.team_name && <span>Team: {proposal.team_name}</span>}
                  </div>

                  <p className={styles.rowExcerpt}>{proposal.approach}</p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
