// ============================================================
// EMPLOYER DASHBOARD  ->  the "/dashboard/employer" route
// ============================================================
// What a professional sees: their organisation's postings, and how
// many people have applied to each.

import Link from "next/link";
import { redirect } from "next/navigation";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { getMyProfile, getMyOrganization } from "@/lib/db/profiles";
import { listOpportunitiesByOrg } from "@/lib/db/opportunities";
import { formatDeadline, formatStipend, labelKind, labelStatus } from "@/lib/format";
import styles from "../dashboard.module.css";

export const metadata = { title: "Employer dashboard" };

export default async function EmployerDashboard() {
  const profile = await getMyProfile();

  if (!profile) redirect("/login");
  if (profile.role === "student") redirect("/dashboard/student");

  const org = await getMyOrganization();

  // No organisation yet. Everything else on this page depends on one,
  // and the RLS policies will not let them post without a membership,
  // so ask for that first and stop here.
  if (!org) {
    return (
      <div className="container section">
        <header className={styles.header}>
          <div>
            <h1 className={styles.greeting}>
              Hello, {profile.full_name?.split(" ")[0] ?? "Professional"}
            </h1>
            <p className={styles.subtitle}>One step before you can post.</p>
          </div>
        </header>

        <div className={`liquid-glass ${styles.prompt}`}>
          <h2 className={styles.promptTitle}>Set up your organisation</h2>
          <p className={styles.promptBody}>
            Postings belong to an organisation rather than a person, so students
            can see who they would be working for. You will need your Business
            Registration Number — that is what earns the verified tick students
            look for.
          </p>
          <Button href="/onboarding">Set up my organisation</Button>
        </div>
      </div>
    );
  }

  const opportunities = await listOpportunitiesByOrg(org.id);
  const openCount = opportunities.filter((o) => o.status === "open").length;

  return (
    <div className="container section">
      <header className={styles.header}>
        <div>
          <h1 className={styles.greeting}>{org.name}</h1>
          <p className={styles.subtitle}>
            {org.is_verified
              ? "Verified organisation"
              : "Pending verification — students see unverified employers without a tick."}
          </p>
        </div>

        <Button href="/dashboard/employer/new" size="sm">
          Post an opportunity
        </Button>
      </header>

      <div className={styles.tiles}>
        <div className={`liquid-glass ${styles.tile}`}>
          <span className={styles.tileValue}>{openCount}</span>
          <span className={styles.tileLabel}>Open postings</span>
        </div>

        <div className={`liquid-glass ${styles.tile}`}>
          <span className={styles.tileValue}>{opportunities.length}</span>
          <span className={styles.tileLabel}>Postings all time</span>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Your postings</h2>
        </div>

        {opportunities.length === 0 ? (
          <EmptyState
            title="No postings yet"
            body="Post a role, or a challenge if you have a problem you would rather see solved than staffed."
            actionLabel="Post an opportunity"
            actionHref="/dashboard/employer/new"
          />
        ) : (
          <div className={styles.rows}>
            {opportunities.map((opportunity) => (
              <article key={opportunity.id} className={`liquid-glass ${styles.row}`}>
                <div className={styles.rowTop}>
                  <Link
                    href={`/opportunities/${opportunity.slug}`}
                    className={styles.rowTitle}
                  >
                    {opportunity.title}
                  </Link>

                  {/* Draft, open or closed. Drafts are invisible to
                      students until published. */}
                  <Tag tone={opportunity.status === "open" ? "success" : "neutral"}>
                    {labelStatus(opportunity.status)}
                  </Tag>
                </div>

                <div className={styles.rowMeta}>
                  <span>{labelKind(opportunity.kind)}</span>
                  <span>
                    {formatStipend(
                      opportunity.is_paid,
                      opportunity.stipend_min,
                      opportunity.stipend_max,
                    )}
                  </span>
                  <span>{opportunity.locality}</span>
                  <span>{formatDeadline(opportunity.closes_at)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
