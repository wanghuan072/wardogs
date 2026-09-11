import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Backpack, Boxes, Crosshair, Database, Plane, Shield, Wrench } from "lucide-react";
import { CatalogCard } from "@/components/content/CatalogCard";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { PageHero } from "@/components/common/PageHero";
import { SectionHeading } from "@/components/common/SectionHeading";
import { catalogCounts, catalogItems, equipment, getItemsBySlugs, itemListingHref } from "@/lib/data/catalog";
import { guides } from "@/lib/data/editorial";
import { buildMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
import styles from "@/style/page/wiki/wiki-hub.module.css";

export const metadata: Metadata = buildMetadata(tdk.wiki);

const groups = [
  { title: "Armory", label: "Combat gear", description: "Weapons, ammunition and attachments, with the compatible options kept together.", icon: Crosshair, links: [["All Weapons", "/wiki/weapons", String(catalogCounts.weapon)], ["Assault Rifles", "/wiki/weapons?category=assault-rifles", "7"], ["SMGs", "/wiki/weapons?category=smgs", "6"], ["Ammunition", "/wiki/ammunition", String(catalogCounts.ammo)], ["Attachments", "/wiki/attachments", String(catalogCounts.attachment)]] },
  { title: "Gear", label: "Field equipment", description: "Protection, storage and deployable equipment for every kit slot.", icon: Backpack, links: [["All Equipment", "/wiki/equipment", "137"], ["Armor", "/wiki/equipment?category=armor", "13"], ["Medical", "/wiki/equipment?category=medical", "10"], ["Storage", "/wiki/equipment?category=storage", "20"], ["Throwables", "/wiki/equipment?category=throwables", "16"], ["Deployables", "/wiki/equipment?category=deployables", "9"]] },
  { title: "Vehicles", label: "Battlefield assets", description: "Ground transports, armored platforms and rotary-wing assets in one list.", icon: Plane, links: [["All Vehicles", "/wiki/vehicles", "28"], ["Ground", "/wiki/vehicles?category=ground-vehicles", ""], ["Tanks / Armored", "/wiki/vehicles?category=tanks", ""], ["Helicopters", "/wiki/vehicles?category=helicopters", ""], ["Logistics", "/wiki/vehicles?category=logistics", ""]] },
];

const popular = getItemsBySlugs(["m4", "ak74", "svd", "super-45", "ah-6m-miniguns", "forward-operating-base"]);
const databaseSummary = [
  { icon: Database, count: catalogItems.length, label: "Total records" },
  { icon: Crosshair, count: catalogCounts.weapon, label: "Weapons" },
  { icon: Boxes, count: catalogCounts.ammo, label: "Ammunition" },
  { icon: Wrench, count: catalogCounts.attachment, label: "Attachments" },
  { icon: Shield, count: equipment.length, label: "Equipment" },
  { icon: Plane, count: catalogCounts.vehicle, label: "Vehicles" },
];

const actions = [
  { label: "Compare weapons", text: "Put weapon details side by side.", href: "/tools/weapon-compare" },
  { label: "Build a kit", text: "Assemble equipment with live compatibility rules.", href: "/builder" },
  { label: "Plan your cash", text: "Check the cost of a kit before you buy it.", href: "/tools/budget-planner" },
];

export default function WikiPage() {
  const recentlyUpdated = [...catalogItems].sort((a, b) => b.lastChecked.localeCompare(a.lastChecked)).slice(0, 6);
  return (
    <main id="main-content">
      <PageHero eyebrow="Weapons, ammo, gear and vehicles" title="WARDOGS Wiki – Find the item you need" description="Browse weapons, ammunition, attachments, equipment and vehicles. Each list keeps the useful details in one place, so you can compare options without opening a stack of pages." image="/images/official/wardogs-10.jpg" crumbs={[{ label: "Wiki" }]} />
      <section className={`container ${styles.commandDeck}`} aria-label="Wiki controls and database totals">
        <div className={styles.searchDock}>
          <div className={styles.searchTitle}><span>Search game items</span><strong>Start with what you need</strong><p>Weapons, calibers, gear and vehicles are all in one place.</p></div>
          <GlobalSearch />
          <nav className={styles.quickLinks} aria-label="Quick wiki links"><Link href="/wiki/weapons">Weapons</Link><Link href="/wiki/ammunition">Ammunition</Link><Link href="/wiki/vehicles">Vehicles</Link></nav>
        </div>
        <div className={styles.summary} aria-label="Database summary">
          {databaseSummary.map(({ icon: Icon, count, label }) => <div key={label}><Icon aria-hidden="true" /><strong>{count}</strong><span>{label}</span></div>)}
        </div>
      </section>
      <section className={`container ${styles.section}`}><SectionHeading eyebrow="Browse by category" title="Choose what you want to check" description="Open a category, then filter the list by the details that matter to your kit." /><div className={styles.groupGrid}>{groups.map((group) => <article key={group.title} className={styles.groupCard}><header><span>{group.label}</span><group.icon aria-hidden="true" /></header><h2>{group.title}</h2><p>{group.description}</p><div>{group.links.map(([label, href, count]) => <Link href={href} key={href}><span>{label}</span><small>{count}</small><ArrowRight size={14} /></Link>)}</div></article>)}</div></section>
      <section className={`container ${styles.intelGrid}`}>
        <div className={styles.popularPanel}><SectionHeading eyebrow="Popular picks" title="Items players check often" description="A quick look at common weapons, vehicles and equipment choices." href="/wiki/weapons" /><div className={styles.popularGrid}>{popular.map((item) => <CatalogCard item={item} key={item.slug} compact />)}</div></div>
        <aside className={styles.updatePanel}><SectionHeading eyebrow="Recently updated" title="Latest item checks" description="Items reviewed most recently for the current game build." /><div className={styles.updatedList}>{recentlyUpdated.map((item, index) => <Link href={itemListingHref(item)} key={item.slug}><span>{String(index + 1).padStart(2, "0")}</span>{item.image && <Image src={item.image} alt="" width={70} height={45} />}<div><strong>{item.name}</strong><small>{item.kind} · checked {item.lastChecked}</small></div><ArrowRight size={14} aria-hidden="true" /></Link>)}</div></aside>
      </section>
      <section className={`container ${styles.guideStrip}`}><SectionHeading eyebrow="Learn the game" title="Guides for your next match" description="Practical guides for the game systems that matter when you are playing." href="/guides" /><div>{guides.slice(0, 4).map((guide) => <Link key={guide.slug} href={`/guides/${guide.slug}`}><Image src={guide.image} alt="" fill sizes="330px" /><span /><div><small>{guide.category}</small><h3>{guide.title}</h3><p>{guide.description}</p><b>Read guide <ArrowRight size={13} aria-hidden="true" /></b></div></Link>)}</div></section>
      <section className={`container ${styles.actionBand}`}><div><span>What next?</span><h2>Use the information in your next match</h2></div><div>{actions.map((action) => <Link href={action.href} key={action.href}><span>{action.label}</span><p>{action.text}</p><ArrowRight aria-hidden="true" /></Link>)}</div></section>
    </main>
  );
}
