import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Database, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { SectionHeading } from "@/components/common/SectionHeading";
import { guides } from "@/lib/data/editorial";
import { dateLabel } from "@/lib/formatting/format-values";
import JsonLd from "@/seo/JsonLd";
import { siteConfig } from "@/config/site";
import type { Guide } from "@/types/catalog";
import styles from "@/style/page/guides/guide-detail.module.css";

function anchor(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export function GuideDetailPage({ guide }: { guide: Guide }) {
  const guideIndex = guides.findIndex((entry) => entry.slug === guide.slug);
  const previousGuide = guides[(guideIndex - 1 + guides.length) % guides.length];
  const nextGuide = guides[(guideIndex + 1) % guides.length];
  const relatedGuides = guides.filter((entry) => entry.slug !== guide.slug && (entry.category === guide.category || guide.relatedWiki.some((link) => entry.relatedWiki.includes(link)))).slice(0, 3);
  return (
    <main id="main-content">
      <header className={styles.header}>
        <Image src={guide.image} alt="" fill sizes="100vw" preload /><span className={styles.headerShade} />
        <div className={`container ${styles.headerInner}`}>
          <Breadcrumb items={[{ label: "Guides", href: "/guides" }, { label: guide.category }, { label: guide.title }]} />
          <span className={styles.kicker}>{guide.category} guide</span><h1>{guide.title}</h1><p>{guide.description}</p>
          <div className={styles.meta}><span><Clock3 /> Updated {dateLabel(guide.updatedAt)}</span><span><Database /> {guide.patchVersion}</span><span className={styles.author}>Edited by <strong>WARDOGS Field Intel</strong></span></div>
        </div>
      </header>
      <div className={`container ${styles.pageGrid}`}>
        <article className={styles.article}>
          <section className={styles.quickAnswer}><CheckCircle2 aria-hidden="true" /><div><span>Quick answer</span><p>{guide.quickAnswer}</p></div></section>
          {guide.sections.map((section, index) => <section key={section.heading} id={anchor(section.heading)} className={styles.guideSection}><span>{String(index + 1).padStart(2, "0")} / guide section</span><h2>{section.heading}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.image && <figure><div><Image src={section.image} alt="" fill sizes="(max-width: 900px) 100vw, 860px" /></div>{section.caption && <figcaption><small>IN GAME / {String(index + 1).padStart(2, "0")}</small>{section.caption}</figcaption>}</figure>}</section>)}
          <section className={styles.evidence}><ShieldCheck aria-hidden="true" /><div><h2>What can change</h2><p>WARDOGS is in Early Access, so prices, item details and balance can move between updates. This guide focuses on practical choices; when an exact value is not confirmed in the current build, it is not treated as final.</p></div></section>
          {guide.faq && <section className={styles.faq}><SectionHeading eyebrow="Direct answers" title="Frequently asked questions" />{guide.faq.map((entry) => <details key={entry.question}><summary>{entry.question}</summary><p>{entry.answer}</p></details>)}</section>}
        </article>
        <aside className={styles.sidebar}>
          <nav className={styles.toc} aria-label="Table of contents"><span>In this guide</span>{guide.sections.map((section, index) => <a key={section.heading} href={`#${anchor(section.heading)}`}><small>{String(index + 1).padStart(2, "0")}</small>{section.heading}</a>)}</nav>
          <div className={styles.linkPanel}><span>Related guides</span>{relatedGuides.map((entry) => <Link href={`/guides/${entry.slug}`} key={entry.slug}>{entry.title}<ArrowRight /></Link>)}</div>
        </aside>
      </div>
      <nav className={`container ${styles.guidePager}`} aria-label="Guide sequence">
        <Link href={`/guides/${previousGuide.slug}`} className={styles.previousGuide}><small>Previous guide</small><strong><ArrowLeft aria-hidden="true" /> {previousGuide.title}</strong></Link>
        <Link href={`/guides/${nextGuide.slug}`} className={styles.nextGuide}><small>Next guide</small><strong>{nextGuide.title} <ArrowRight aria-hidden="true" /></strong></Link>
      </nav>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, image: `${siteConfig.url}${guide.image}`, datePublished: guide.publishedAt, dateModified: guide.updatedAt, author: { "@type": "Organization", name: siteConfig.name }, mainEntityOfPage: `${siteConfig.url}/guides/${guide.slug}` }} />
      {guide.faq && <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: guide.faq.map((entry) => ({ "@type": "Question", name: entry.question, acceptedAnswer: { "@type": "Answer", text: entry.answer } })) }} />}
    </main>
  );
}
