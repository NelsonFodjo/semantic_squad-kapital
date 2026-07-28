// ============================================================
// ShowcaseTile — one piece of published work in the gallery.
// ============================================================
// Everything interesting is in the CSS: the image zooms, a dark veil
// fades in, and the prompt slides up. The markup stays plain.

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/format";
import type { ShowcaseWithAuthor } from "@/types/database";
import styles from "./ShowcaseTile.module.css";

type Props = {
  item: ShowcaseWithAuthor;
  /** Tells the browser how wide the image will be, for picking a size. */
  sizes?: string;
  /** Uses a 16:9 frame instead of 4:3. For the lead tile in a gallery. */
  wide?: boolean;
};

export default function ShowcaseTile({
  item,
  sizes = "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw",
  wide = false,
}: Props) {
  return (
    <Link href={`/showcase/${item.slug}`} className={styles.tile}>
      <div className={`${styles.frame} ${wide ? styles.frameWide : ""}`}>
        {/* next/image serves a resized, modern-format version of the
            picture, which matters a lot on mobile data. It needs
            either width/height or `fill` — fill makes the image cover
            its container, which is what we want here. */}
        <Image
          src={item.cover_image_url || "/images/showcase.svg"}
          alt={item.title || "Showcase case study"}
          fill
          unoptimized
          sizes={sizes}
          className={styles.image}
        />

        {item.is_featured && <span className={styles.featured}>Featured</span>}

        {/* Both of these are invisible until hover — see the CSS. */}
        <span className={styles.veil} aria-hidden="true" />
        <span className={styles.overlay}>Read the case study →</span>
      </div>

      <div className={styles.caption}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.summary}>{item.summary}</p>

        <p className={styles.meta}>
          <span className={styles.author}>
            {item.profiles?.full_name ?? "Student"}
          </span>
          {/* Not every project was done with a company. */}
          {item.organizations && <span>· {item.organizations.name}</span>}
          {item.published_at && <span>· {formatDate(item.published_at)}</span>}
        </p>
      </div>
    </Link>
  );
}
