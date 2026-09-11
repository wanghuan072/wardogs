import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "@/components/common/Breadcrumb";
import styles from "@/style/common/common.module.css";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  crumbs,
  meta = "WARDOGS / EARLY ACCESS",
  containerClassName,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  crumbs?: Crumb[];
  meta?: string;
  containerClassName?: string;
  children?: ReactNode;
}) {
  return (
    <>
    <section className={styles.pageHero}>
      <Image className={styles.pageHeroImage} src={image} alt="" fill sizes="100vw" preload />
      <div className={styles.pageHeroShade} />
      <div className={`${containerClassName || "container"} ${styles.pageHeroInner}`}>
        {crumbs && <Breadcrumb items={crumbs} />}
        <div className={styles.pageHeroContent}>
          <div className={styles.pageHeroCopy}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className={styles.pageHeroRail} aria-label="Page status">
            <span>Player guide</span>
            <strong>{meta}</strong>
            <i />
            <small>For your next match</small>
          </div>
        </div>
      </div>
    </section>
    {children ? <div className={`${containerClassName || "container"} ${styles.pageHeroAfter}`}>{children}</div> : null}
    </>
  );
}
