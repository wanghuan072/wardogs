import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import styles from "@/style/common/common.module.css";

export function RelatedLinks({ links, title = "Keep exploring" }: { links: { label: string; href: string; text: string }[]; title?: string }) {
  return (
    <section className={styles.relatedSection}>
      <SectionHeading eyebrow="Next action" title={title} />
      <div className={styles.relatedGrid}>
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            <span>{link.label}</span>
            <p>{link.text}</p>
            <ArrowRight aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}
