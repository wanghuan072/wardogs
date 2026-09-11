import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, Layers3, Scale } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ammunition, attachments, equipment, facetSlug, itemListingHref, vehicles, weapons } from "@/lib/data/catalog";
import { formatMoney, formatNumber, titleFromSlug } from "@/lib/formatting/format-values";
import { buildMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
import type { CatalogItem } from "@/types/catalog";
import styles from "@/style/page/tier-list/tier-list.module.css";

export const tierSections = ["weapons", "ammunition", "attachments", "equipment", "vehicles"];
export const metadata: Metadata = buildMetadata(tdk.tierList);

type Query = Record<string, string | string[] | undefined>;
type TierKey = "S" | "A" | "B" | "C" | "U";
type TierSection = { label: string; singular: string; description: string; items: CatalogItem[] };

const sectionData: Record<string, TierSection> = {
  weapons: { label: "Weapons", singular: "weapon", description: "Every weapon is kept on one board and grouped by weapon type.", items: weapons },
  ammunition: { label: "Ammunition", singular: "ammunition", description: "Compare ammunition by caliber or ammunition family.", items: ammunition },
  attachments: { label: "Attachments", singular: "attachment", description: "Compare attachments by mounting slot and what they are made for.", items: attachments },
  equipment: { label: "Equipment", singular: "item", description: "Armor, medical gear, storage, supplies and deployables grouped by role.", items: equipment },
  vehicles: { label: "Vehicles", singular: "vehicle", description: "Compare air and ground vehicles by vehicle type.", items: vehicles },
};

const tierRows: { key: TierKey; label: string }[] = [
  { key: "S", label: "Top picks" },
  { key: "A", label: "Strong" },
  { key: "B", label: "Balanced" },
  { key: "C", label: "Specialist" },
  { key: "U", label: "Needs data" },
];

const editorialTier = new Map<string, TierKey>([
  ["t-21", "S"], ["fal", "S"],
  ["svd", "A"], ["pkm", "A"], ["super-45", "A"], ["m4", "A"],
  ["ak74", "B"],
  ["mp5", "C"], ["m249-saw", "C"], ["rpg-7", "C"], ["sv98", "C"], ["compound-bow", "C"],
]);

function queryValue(query: Query, key: string) {
  const result = query[key];
  return Array.isArray(result) ? result[0] || "" : result || "";
}

function categoryName(section: string, item: CatalogItem) {
  if (section === "weapons") return item.type || "Unclassified";
  if (section === "ammunition") return item.caliber || item.type || "Unclassified";
  if (section === "attachments") return item.slot || item.category || "Unclassified";
  if (section === "vehicles") return item.type || item.category || "Unclassified";
  return titleFromSlug(item.kind);
}

function metricFor(section: string, item: CatalogItem) {
  if (section === "weapons") return formatNumber(item.stats.rpm, " RPM");
  if (section === "vehicles") return formatNumber(item.stats.maxSpeed, " km/h");
  if (section === "ammunition") return item.ammoType || item.type || "Unknown type";
  if (section === "attachments") return item.slot || "Unknown slot";
  return formatNumber(item.weight, " kg");
}

function rankFor(section: string, item: CatalogItem): TierKey {
  return section === "weapons" ? editorialTier.get(item.slug) || "U" : "U";
}

function FamilyRail({ active }: { active?: string }) {
  return (
    <nav className={`container ${styles.familyRail}`} aria-label="Tier list databases">
      {tierSections.map((slug) => {
        const data = sectionData[slug];
        return <Link className={active === slug ? styles.activeFamily : ""} href={`/tier-list/${slug}`} key={slug}><span>{data.items.length}</span><strong>{data.label}</strong><small>Open board</small></Link>;
      })}
    </nav>
  );
}

function TierBoard({ items, section, showEmpty = false }: { items: CatalogItem[]; section: string; showEmpty?: boolean }) {
  return (
    <div className={styles.tierBoard}>
      {tierRows.map((row) => {
        const rowItems = items.filter((item) => rankFor(section, item) === row.key);
        if (!showEmpty && rowItems.length === 0) return null;
        return (
          <section className={`${styles.tierLane} ${styles[`lane${row.key}`]}`} aria-label={`${row.key} tier`} key={row.key}>
            <header><strong>{row.key}</strong><span>{row.label}</span></header>
            <div className={styles.tierItems}>
              {rowItems.map((item) => (
                <Link className={styles.tierItem} href={itemListingHref(item)} key={item.slug}>
                  <div className={styles.itemThumb}>
                    <Image src={item.image || "/images/official/wardogs-09.jpg"} alt={`${item.name} WARDOGS record`} fill sizes="132px" />
                    <span>{item.dataStatus}</span>
                  </div>
                  <strong>{item.name}</strong>
                  <span>{item.type || item.category || titleFromSlug(item.kind)}</span>
                  <small>{formatMoney(item.price)} <i /> {metricFor(section, item)}</small>
                </Link>
              ))}
              {!rowItems.length && <p className={styles.emptyLane}>No current placement</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function TierListPage({ section, searchParams = {} }: { section?: string; searchParams?: Query }) {
  if (!section) return <TierHub />;
  const data = sectionData[section];
  if (!data) return null;
  const activeCategory = queryValue(searchParams, "category");
  const categories = [...new Set(data.items.map((item) => categoryName(section, item)))].sort((a, b) => a.localeCompare(b));
  const visibleCategories = activeCategory ? categories.filter((category) => facetSlug(category) === activeCategory) : categories;
  const visibleItems = data.items.filter((item) => visibleCategories.includes(categoryName(section, item)));
  const placedCount = visibleItems.filter((item) => rankFor(section, item) !== "U").length;

  return (
    <main id="main-content">
      <PageHero eyebrow="Community picks by item type" title={`WARDOGS Tier List – ${data.label}`} description={`${data.description} Use it as a starting point for your own choice, not a replacement for trying a kit in the current game build.`} image="/images/official/wardogs-09.jpg" crumbs={[{ label: "Tier List", href: "/tier-list" }, { label: data.label }]} />
      <FamilyRail active={section} />

      <nav className={`container ${styles.categoryBar}`} aria-label={`${data.label} categories`}>
        <span>Filter class</span>
        <Link className={!activeCategory ? styles.active : ""} href={`/tier-list/${section}`}>All <b>{data.items.length}</b></Link>
        {categories.map((category) => {
          const slug = facetSlug(category);
          const count = data.items.filter((item) => categoryName(section, item) === category).length;
          return <Link className={activeCategory === slug ? styles.active : ""} href={`/tier-list/${section}?category=${slug}`} key={category}>{category} <b>{count}</b></Link>;
        })}
      </nav>

      <section className={`container ${styles.overview}`} aria-label="Tier list summary">
        <div><Layers3 /><span>Records on board</span><strong>{visibleItems.length}</strong></div>
        <div><BarChart3 /><span>Classes shown</span><strong>{visibleCategories.length}</strong></div>
        <div><CheckCircle2 /><span>Placed records</span><strong>{placedCount}</strong></div>
        <p><b>Board key</b>{tierRows.map((row) => <span key={row.key}><i className={styles[`key${row.key}`]}>{row.key}</i>{row.label}</span>)}</p>
      </section>

      <section className={`container ${styles.rankingSections}`}>
        {visibleCategories.map((category) => {
          const items = data.items.filter((item) => categoryName(section, item) === category).sort((a, b) => a.name.localeCompare(b.name));
          return (
            <section className={styles.categorySection} id={facetSlug(category)} key={category}>
              <header><div><span>{data.label} / class board</span><h2>{category}</h2></div><b>{items.length} records</b></header>
              <TierBoard items={items} section={section} />
            </section>
          );
        })}
      </section>

      <section className={`container ${styles.methodology}`}><SectionHeading eyebrow="Ranking discipline" title="How to read the board" /><div><article><Scale /><h3>Compare by class</h3><p>Items are placed within their own role instead of mixing unlike equipment.</p></article><article><BarChart3 /><h3>Check the record</h3><p>Price and one useful performance field stay visible on every compact card.</p></article><article><CheckCircle2 /><h3>Unknown stays visible</h3><p>The U lane holds records that still need enough evidence for an editorial tier.</p></article></div></section>
    </main>
  );
}

function TierHub() {
  const preview = weapons.filter((item) => editorialTier.has(item.slug));
  return (
    <main id="main-content">
      <PageHero eyebrow="Community picks by category" title="WARDOGS Tier Lists – Compare your options" description="Pick a category, then see the community board for its items. Use the rankings as a quick starting point and adjust for your role, budget and squad." image="/images/official/wardogs-09.jpg" crumbs={[{ label: "Tier List" }]} />
      <FamilyRail />
      <section className={`container ${styles.hubBoard}`}>
        <header><div><span>Featured board / weapons</span><h2>Current field ranking</h2><p>A compact preview of records with an editorial placement.</p></div><Link href="/tier-list/weapons">Open all 38 weapons <ArrowRight /></Link></header>
        <TierBoard items={preview} section="weapons" showEmpty />
      </section>
      <section className={`container ${styles.hubGuide}`}><SectionHeading eyebrow="Choose a category" title="Five boards to explore" description="Every category stays on one page, with item types used as filters instead of extra pages." /><div>{tierSections.map((slug) => { const data = sectionData[slug]; return <Link href={`/tier-list/${slug}`} key={slug}><span>{data.items.length} items</span><strong>{data.label}</strong><p>{data.description}</p><ArrowRight /></Link>; })}</div></section>
    </main>
  );
}

export default TierListPage;
