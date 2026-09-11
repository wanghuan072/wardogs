import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { DataStatus } from "@/components/common/DataStatus";
import { PageHero } from "@/components/common/PageHero";
import { RelatedLinks } from "@/components/common/RelatedLinks";
import { SectionHeading } from "@/components/common/SectionHeading";
import { toolDefinitions } from "@/config/tools";
import { buildMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
import styles from "@/style/page/tools/tools.module.css";

export const metadata: Metadata = buildMetadata(tdk.tools);

export default function ToolsPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Compare gear and check the cost" title="WARDOGS Tools – Make your next choice easier" description="Compare weapons side by side or check what a kit costs before you spend your cash. The Builder is the place to assemble compatible gear." image="/images/official/wardogs-12.jpg" crumbs={[{ label: "Tools" }]}><DataStatus compact /></PageHero>
      <section className={`container ${styles.section}`}><SectionHeading eyebrow="Two useful tools" title="Compare or plan your budget" description="Use one tool to compare weapons and another to see the cost of a single deployment." /><div className={styles.toolGrid}>{toolDefinitions.map((tool) => <Link href={`/tools/${tool.slug}`} key={tool.slug}><tool.icon aria-hidden="true" /><div><span>{tool.group}</span><h2>{tool.name}</h2><p>{tool.description}</p><small><CheckCircle2 /> Shows the details used for each result</small></div><ArrowRight /></Link>)}</div></section>
      <div className="container"><RelatedLinks links={[{ label: "Database", href: "/wiki", text: "Inspect the records behind the inputs." }, { label: "Builder", href: "/builder", text: "Assemble a compatible kit and track its total cost." }, { label: "Methodology", href: "/about", text: "See how unknown and community data are handled." }]} /></div>
    </main>
  );
}
