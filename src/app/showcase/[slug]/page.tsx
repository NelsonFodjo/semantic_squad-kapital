// ============================================================
// ONE CASE STUDY  ->  the "/showcase/<slug>" route
// ============================================================

import Link from "next/link";
import { notFound } from "next/navigation";
import ShowcaseHeroImage from "@/components/showcase/ShowcaseHeroImage";
import Tag, { TagRow } from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { getShowcaseBySlug } from "@/lib/db/showcase";
import { formatDate } from "@/lib/format";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = await getShowcaseBySlug(slug);

  if (!item) return { title: "Case study not found" };

  return { title: item.title, description: item.summary };
}

export default async function ShowcaseItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getShowcaseBySlug(slug);

  if (!item) notFound();

  return (
    <div className="container-narrow section">
      <Link href="/showcase" className={styles.back}>
        ← All work
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{item.title}</h1>
        <p className={styles.summary}>{item.summary}</p>

        <div className={styles.meta}>
          {/* The author's name links to their public profile, which is
              the point of the whole showcase. */}
          {item.profiles && (
            <Link href={`/students/${item.profiles.slug}`} className={styles.author}>
              {item.profiles.full_name}
            </Link>
          )}

          {item.organizations && <span>{item.organizations.name}</span>}

          {item.published_at && <span>{formatDate(item.published_at)}</span>}
        </div>
      </header>

      <ShowcaseHeroImage
        src={item.cover_image_url}
        alt={item.title || "Showcase case study"}
      />

      {/* body is optional — some entries are just a summary. */}
      {item.body && <div className={styles.body}>{item.body}</div>}

      {item.tags.length > 0 && (
        <div className={styles.tags}>
          <p className={styles.tagsLabel}>Built with</p>
          <TagRow>
            {item.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagRow>
        </div>
      )}

      <div className={`liquid-glass ${styles.cta}`}>
        <h2 className={styles.ctaTitle}>Want one of these with your name on it?</h2>
        <p className={styles.ctaBody}>
          Answer an open challenge. Selected proposals get written up and
          published here.
        </p>
        <Button href="/challenges">See open challenges</Button>
      </div>
    </div>
  );
}
