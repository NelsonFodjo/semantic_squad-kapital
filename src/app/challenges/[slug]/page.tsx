// ============================================================
// ONE CHALLENGE  ->  the "/challenges/<slug>" route
// ============================================================

import Link from "next/link";
import { notFound } from "next/navigation";
import ChallengeHeroImage from "@/components/challenges/ChallengeHeroImage";
import Tag, { TagRow } from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import ProposalForm from "@/components/challenges/ProposalForm";
import { getChallengeBySlug, hasSubmittedProposal } from "@/lib/db/challenges";
import { getCurrentUserId } from "@/lib/supabase/server";
import {
  formatDate,
  formatDeadline,
  isClosed,
  labelChallengeKind,
} from "@/lib/format";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);

  if (!challenge) return { title: "Challenge not found" };

  return { title: challenge.title, description: challenge.summary };
}

export default async function ChallengePage({ params }: Props) {
  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);

  if (!challenge) notFound();

  const org = challenge.organizations;
  const closed = isClosed(challenge.deadline) || challenge.status !== "open";
  const deadlineText = formatDeadline(challenge.deadline);
  const isUrgent = /today|tomorrow|in [1-7] days/.test(deadlineText);

  const userId = await getCurrentUserId();
  const alreadySubmitted = userId
    ? await hasSubmittedProposal(challenge.id, userId)
    : false;

  return (
    <div className="container section">
      <Link href="/challenges" className={styles.back}>
        ← All challenges
      </Link>

      <header className={styles.header}>
        <ChallengeHeroImage
          src={challenge.cover_image_url}
          alt={challenge.title}
          kind={challenge.kind}
          slug={challenge.slug}
        />

        <p className={styles.org}>
          {org?.name ?? "Organisation"}
          {org?.is_verified && (
            <span className={styles.verified} title="Verified organisation">
              ✓
            </span>
          )}
        </p>

        <h1 className={styles.title}>{challenge.title}</h1>
        <p className={styles.summary}>{challenge.summary}</p>

        <TagRow>
          <Tag tone={challenge.kind === "open_source" ? "warning" : "accent"}>
            {labelChallengeKind(challenge.kind)}
          </Tag>
          <Tag>{challenge.sector}</Tag>
          {closed && <Tag tone="danger">Closed</Tag>}
        </TagRow>
      </header>

      {/* ---------- The three facts that decide whether to read on ---------- */}
      <div className={`liquid-glass ${styles.keyFacts}`}>
        <div className={styles.fact}>
          <span className={styles.factLabel}>Deadline</span>
          <span
            className={`${styles.factValue} ${isUrgent ? styles.factUrgent : ""}`}
          >
            {formatDate(challenge.deadline)}
          </span>
        </div>

        <div className={styles.fact}>
          <span className={styles.factLabel}>Time left</span>
          <span
            className={`${styles.factValue} ${isUrgent ? styles.factUrgent : ""}`}
          >
            {deadlineText}
          </span>
        </div>

        <div className={styles.fact}>
          <span className={styles.factLabel}>Reward</span>
          <span className={styles.factValue}>
            {challenge.reward ?? "Experience and a reference"}
          </span>
        </div>

        <div className={styles.fact}>
          <span className={styles.factLabel}>Team size</span>
          <span className={styles.factValue}>
            {challenge.team_size_max > 1
              ? `Up to ${challenge.team_size_max}`
              : "Solo only"}
          </span>
        </div>
      </div>

      <div className={styles.layout}>
        {/* ---------------- Left: the brief ---------------- */}
        <article>
          <h2 className={styles.briefHeading}>The brief</h2>
          <div className={styles.brief}>{challenge.brief}</div>

          {/* Open-source challenges link straight to the repository. */}
          {challenge.repo_url && (
            <a
              href={challenge.repo_url}
              className={styles.repoLink}
              // Opening someone else's site in a new tab needs both:
              // noopener stops the new page reaching back into ours.
              target="_blank"
              rel="noopener noreferrer"
            >
              View the repository on GitHub ↗
            </a>
          )}

          {challenge.skills.length > 0 && (
            <div className={styles.skillsBlock}>
              <p className={styles.skillsLabel}>Skills involved</p>
              <TagRow>
                {challenge.skills.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </TagRow>
            </div>
          )}
        </article>

        {/* ---------------- Right: submit ---------------- */}
        <aside className={styles.sidebar}>
          {closed ? (
            <div className={`liquid-glass ${styles.notice}`}>
              <p className={styles.noticeTitle}>This challenge has closed</p>
              <p className={styles.noticeBody}>
                Submissions are being reviewed. Winning proposals get published
                in the showcase.
              </p>
              <Button href="/showcase" variant="secondary" size="sm">
                See past work
              </Button>
            </div>
          ) : alreadySubmitted ? (
            <div className={`liquid-glass ${styles.notice}`}>
              <p className={styles.noticeTitle}>Proposal submitted</p>
              <p className={styles.noticeBody}>
                One proposal per challenge. Track its status on your dashboard.
              </p>
              <Button href="/dashboard/student" variant="secondary" size="sm">
                My proposals
              </Button>
            </div>
          ) : !userId ? (
            <div className={`liquid-glass ${styles.notice}`}>
              <p className={styles.noticeTitle}>Log in to submit</p>
              <p className={styles.noticeBody}>
                Free for students with a university email address.
              </p>
              <Button href={`/login?next=/challenges/${challenge.slug}`}>
                Log in or sign up
              </Button>
            </div>
          ) : (
            <ProposalForm
              challengeId={challenge.id}
              challengeTitle={challenge.title}
              teamSizeMax={challenge.team_size_max}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
