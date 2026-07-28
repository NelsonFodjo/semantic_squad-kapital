"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "@/app/showcase/[slug]/page.module.css";

type Props = {
  src?: string | null;
  alt: string;
};

export default function ShowcaseHeroImage({ src, alt }: Props) {
  const defaultImage = "/images/showcase.svg";
  const [imgSrc, setImgSrc] = useState(src || defaultImage);

  return (
    <div className={styles.cover}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        unoptimized
        onError={() => setImgSrc(defaultImage)}
        sizes="(max-width: 800px) 100vw, 760px"
        className={styles.coverImage}
      />
    </div>
  );
}
