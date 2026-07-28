"use client";

// ============================================================
// ShowcaseTile — one piece of published work in the gallery.
// ============================================================

import { useState } from "react";
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
  const defaultImage = "/images/showcase.svg";
  const [imgSrc, setImgSrc] = useState(item.cover_image_url || defaultImage);

  return (
    <Link href={`/showcase/${item.slug}`} className={styles.tile}>
      <div className={`${styles.frame} ${wide ? styles.frameWide : ""}`}>
        <Image
          src={imgSrc}
          alt={item.title || "Showcase case study"}
          fill
          unoptimized
          onError={() => setImgSrc(defaultImage)}
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
