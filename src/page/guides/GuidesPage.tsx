import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { RelatedLinks } from "@/components/common/RelatedLinks";
import { SectionHeading } from "@/components/common/SectionHeading";
import { guides } from "@/lib/data/editorial";
import { dateLabel } from "@/lib/formatting/format-values";
import { buildMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
import styles from "@/style/page/guides/guides.module.css";

export const metadata: Metadata = buildMetadata(tdk.guides);

function readMinutes(guide: (typeof guides)[number]) { return Math.max(7, Math.ceil(guide.sections.flatMap((section) => section.body).join(" ").split(/\s+/).length / 180)); }

export function GuidesPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Start smarter, play longer" title="WARDOGS Guides – Get ready for your next match" description="Start with the basics, manage your cash, learn to fly and understand how Control Zones shape a match. These four guides cover the decisions you will make most often." image="/images/official/wardogs-02.jpg" crumbs={[{ label: "Guides" }]} />
      <section className={`container ${styles.section}`}>
        <SectionHeading eyebrow="Four player guides" title="Pick what you want to learn" description="Start with your first match, the cash system, helicopter controls or Control Zone play." />
        <div className={styles.guideGrid}>{guides.map((guide, index) => <article key={guide.slug} className={styles.guideCard}>
          <Link href={`/guides/${guide.slug}`} className={styles.cardImage} aria-label={`Read ${guide.title}`}><Image src={guide.image} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" /><span>{String(index + 1).padStart(2, "0")}</span></Link>
          <div className={styles.cardBody}><small>{guide.category} · {guide.patchVersion}</small><h2><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h2><p>{guide.description}</p><div className={styles.cardMeta}><span>Updated {dateLabel(guide.updatedAt)}</span><span><BookOpen aria-hidden="true" /> {readMinutes(guide)} min read</span></div><Link className={styles.readLink} href={`/guides/${guide.slug}`}>Read guide <ArrowRight aria-hidden="true" /></Link></div>
        </article>)}</div>
      </section>
      <div className="container"><RelatedLinks links={[{ label: "Browse game items", href: "/wiki", text: "Check the gear mentioned in a guide." }, { label: "Build a kit", href: "/builder", text: "Try your plan with compatible equipment." }, { label: "Use the tools", href: "/tools", text: "Compare weapons or check a kit cost." }]} /></div>
    </main>
  );
}

export default GuidesPage;
