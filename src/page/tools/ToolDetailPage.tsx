import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { RelatedLinks } from "@/components/common/RelatedLinks";
import type { toolDefinitions } from "@/config/tools";
import type { ToolItem } from "@/lib/tools/calculations";
import { ToolWorkbench } from "@/page/tools/components/ToolWorkbench";
import styles from "@/style/page/tools/tools.module.css";

type Tool = (typeof toolDefinitions)[number];
export function ToolDetailPage({ tool, items }: { tool: Tool; items: ToolItem[] }) {
  return (
    <main id="main-content">
      <PageHero eyebrow={`${tool.group} tool`} title={`WARDOGS ${tool.name}`} description={tool.description} image="/images/official/wardogs-12.jpg" crumbs={[{ label: "Tools", href: "/tools" }, { label: tool.name }]} />
      <section className={`container ${styles.workbenchSection}`}><ToolWorkbench tool={tool.slug} items={items} /></section>
      <section className={`container ${styles.method}`}><div><CheckCircle2 /><h2>What you are looking at</h2><p>The result uses the prices, compatible items and weapon details shown in this tool. Totals only include the items you selected.</p></div><div><AlertTriangle /><h2>Keep in mind</h2><p>Early Access values can change. This tool does not predict damage, survival, match earnings or a single “best” choice for every player.</p></div></section>
      <div className="container"><RelatedLinks links={[{ label: "Browse items", href: "/wiki", text: "Open the weapon and gear lists used by this tool." }, { label: "Field guides", href: "/guides", text: "Understand how the system works in play." }, { label: "Economy", href: "/guides/cash-economy", text: "See why one loadout affects future lives." }]} /></div>
    </main>
  );
}
