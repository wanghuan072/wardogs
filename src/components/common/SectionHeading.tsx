import Link from "next/link";
import styles from "@/style/common/common.module.css";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <div>
        {eyebrow && <span>{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && <Link href={href}>{linkLabel} <span aria-hidden="true">→</span></Link>}
    </div>
  );
}
