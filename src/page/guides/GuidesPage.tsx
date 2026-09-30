import type { Metadata } from "next";
import Image from "next/image";
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
      <PageHero eyebrow="Start smarter, play longer" title="WARDOGS Guides – Get ready for your next match" description="Start with the basics, manage your cash, fly, understand the Control Zone, tune performance and solve a launch problem. These guides cover the decisions players make most often." image="/images/official/wardogs-02.jpg" crumbs={[{ label: "Guides" }]} />
      <section className={`container ${styles.section}`}>
        <SectionHeading eyebrow="Player guides" title="Pick what you need right now" description="Start your first match, manage cash, fly, fight for the Control Zone, tune your PC or solve a launch problem." />
        <div className={styles.guideGrid}>{guides.map((guide, index) => <article key={guide.slug} className={styles.guideCard}>
          <a href={`/guides/${guide.slug}`} className={styles.cardImage} aria-label={`Read ${guide.title}`}><Image src={guide.image} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" /><span>{String(index + 1).padStart(2, "0")}</span></a>
          <div className={styles.cardBody}><small>{guide.category} · {guide.patchVersion}</small><h2><a href={`/guides/${guide.slug}`}>{guide.title}</a></h2><p>{guide.description}</p><div className={styles.cardMeta}><span>Updated {dateLabel(guide.updatedAt)}</span><span><BookOpen aria-hidden="true" /> {readMinutes(guide)} min read</span></div><a className={styles.readLink} href={`/guides/${guide.slug}`}>Read guide <ArrowRight aria-hidden="true" /></a></div>
        </article>)}</div>
      </section>
      <div className="container"><RelatedLinks links={[{ label: "Browse game items", href: "/wiki", text: "Check the gear mentioned in a guide." }, { label: "Build a kit", href: "/builder", text: "Try your plan with compatible equipment." }, { label: "Use the tools", href: "/tools", text: "Compare weapons or check a kit cost." }]} /></div>
    </main>
  );
}

export default GuidesPage;
