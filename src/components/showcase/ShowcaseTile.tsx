"use client";

// ============================================================
// ShowcaseTile — one piece of published work in the gallery.
// ============================================================

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { formatDate } from "@/lib/format";
import type { ShowcaseWithAuthor } from "@/types/database";
import styles from "./ShowcaseTile.module.css";

type Props = {
  item: ShowcaseWithAuthor;
  sizes?: string;
  wide?: boolean;
  index?: number;
};

export default function ShowcaseTile({
  item,
  sizes = "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw",
  wide = false,
  index = 0,
}: Props) {
  const defaultImage = "/images/showcase.svg";
  const [imgSrc, setImgSrc] = useState(item.cover_image_url || defaultImage);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -40 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              y: -6,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }
      }
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
      transition={
        shouldReduceMotion
          ? { duration: 0.3, delay: index * 0.06 }
          : {
              type: "spring",
              stiffness: 120,
              damping: 14,
              mass: 0.9,
              delay: index * 0.06,
            }
      }
    >
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
            {item.organizations && <span>· {item.organizations.name}</span>}
            {item.published_at && <span>· {formatDate(item.published_at)}</span>}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
