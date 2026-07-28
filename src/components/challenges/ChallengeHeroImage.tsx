"use client";

import { getChallengeCoverImage } from "@/lib/format";
import styles from "@/app/challenges/[slug]/page.module.css";

type Props = {
  src?: string | null;
  alt: string;
  kind?: string;
  slug?: string;
};

export default function ChallengeHeroImage({ src, alt, kind, slug }: Props) {
  const defaultImage = kind === "open_source" ? "/images/opensource.svg" : "/images/challenges.svg";
  const [imgSrc, setImgSrc] = useState(
    getChallengeCoverImage({ slug, kind, cover_image_url: src })
  );

  return (
    <div className={`liquid-glass ${styles.heroImageFrame}`} data-hue={kind === "open_source" ? "palm" : "coral"}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        unoptimized
        onError={() => setImgSrc(defaultImage)}
        style={{ objectFit: "cover" }}
        className={styles.heroImage}
      />
    </div>
  );
}
