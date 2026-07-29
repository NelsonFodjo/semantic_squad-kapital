
// PUBLIC STUDENT PROFILE 
 
import { notFound } from "next/navigation";
import Tag, { TagRow } from "@/components/ui/Tag";
import ShowcaseTile from "@/components/showcase/ShowcaseTile";
import EmptyState from "@/components/ui/EmptyState";
import { getStudentBySlug } from "@/lib/db/profiles";
import { listShowcaseByStudent } from "@/lib/db/showcase";
import { formatDate } from "@/lib/format";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const result = await getStudentBySlug(slug);

  if (!result) return { title: "Profile not found" };

  return {
    title: result.profile.full_name,
    description: result.profile.headline ?? undefined,
  };
}

export default async function StudentProfilePage({ params }: Props) {
  const { slug } = await params;
  const result = await getStudentBySlug(slug);

  if (!result) notFound();

  const { profile, student } = result;
  const work = await listShowcaseByStudent(profile.id);

  return (
    <div className="container section">
      <header className={styles.header}>
        {student?.is_verified && (
          <p className={styles.verified}>✓ Verified student</p>
        )}

        <h1 className={styles.name}>{profile.full_name}</h1>

        {profile.headline && <p className={styles.headline}>{profile.headline}</p>}

        {/* Skills are the thing employers scan for, so they go up top. */}
        {student && student.skills.length > 0 && (
          <TagRow>
            {student.skills.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </TagRow>
        )}
      </header>

      {/* The facts block only makes sense for a student row. An
          employer's profile visited by URL would have none of this. */}
      {student && (
        <div className={`liquid-glass ${styles.facts}`}>
          <div className={styles.fact}>
            <span className={styles.factLabel}>Institution</span>
            <span className={styles.factValue}>{student.institution}</span>
          </div>

          <div className={styles.fact}>
            <span className={styles.factLabel}>Faculty</span>
            <span className={styles.factValue}>{student.faculty}</span>
          </div>

          <div className={styles.fact}>
            <span className={styles.factLabel}>Year</span>
            <span className={styles.factValue}>Year {student.year_of_study}</span>
          </div>

          {student.programme && (
            <div className={styles.fact}>
              <span className={styles.factLabel}>Programme</span>
              <span className={styles.factValue}>{student.programme}</span>
            </div>
          )}

          {student.available_from && (
            <div className={styles.fact}>
              <span className={styles.factLabel}>Available from</span>
              <span className={styles.factValue}>
                {formatDate(student.available_from)}
              </span>
            </div>
          )}

          {profile.locality && (
            <div className={styles.fact}>
              <span className={styles.factLabel}>Based in</span>
              <span className={styles.factValue}>{profile.locality}</span>
            </div>
          )}
        </div>
      )}

      {profile.bio && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About</h2>
          <p className={styles.bio}>{profile.bio}</p>
        </section>
      )}

      {/* Outbound links. Only rendered when the student added one. */}
      {student && (student.github_url || student.portfolio_url) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Links</h2>
          <div className={styles.links}>
            {student.github_url && (
              <a
                href={student.github_url}
                className={`liquid-glass ${styles.link}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>
            )}
            {student.portfolio_url && (
              <a
                href={student.portfolio_url}
                className={`liquid-glass ${styles.link}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Portfolio ↗
              </a>
            )}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Published work</h2>

        {work.length === 0 ? (
          <EmptyState
            title="Nothing published yet"
            body="Case studies appear here once a challenge proposal or internship is written up."
          />
        ) : (
          <div className={styles.workGrid}>
            {work.map((item) => (
              <ShowcaseTile
                key={item.id}
                item={item}
                sizes="(max-width: 700px) 100vw, 33vw"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
