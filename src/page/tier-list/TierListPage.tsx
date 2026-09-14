import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, Layers3, Scale } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { SectionHeading } from "@/components/common/SectionHeading";
import { facetSlug, itemHref, weapons } from "@/lib/data/catalog";
import { formatCatalogLabel, formatMoney, formatNumber } from "@/lib/formatting/format-values";
import { buildMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
import type { CatalogItem } from "@/types/catalog";
import styles from "@/style/page/tier-list/tier-list.module.css";

// Weapons are the only category with an editorially reviewed board. Other
// records remain available in the Wiki until there is enough evidence to rank them.
export const tierSections = ["weapons"];
export const metadata: Metadata = buildMetadata(tdk.tierList);

type Query = Record<string, string | string[] | undefined>;
type TierKey = "S" | "A" | "B" | "C" | "U";
type TierSection = { label: string; singular: string; description: string; items: CatalogItem[] };

const sectionData: Record<string, TierSection> = {
  weapons: { label: "Weapons", singular: "weapon", description: "Every weapon is kept on one board and grouped by weapon type.", items: weapons },
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
  return section === "weapons" ? item.type || "Unclassified" : "Unclassified";
}

function metricFor(section: string, item: CatalogItem) {
  return section === "weapons" ? formatNumber(item.stats.rpm, " RPM") : "Unknown";
}

function rankFor(section: string, item: CatalogItem): TierKey {
  return section === "weapons" ? editorialTier.get(item.slug) || "U" : "U";
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
                <Link className={styles.tierItem} href={itemHref(item)} key={item.slug}>
                  <div className={styles.itemThumb}>
                    <Image src={item.image || "/images/official/wardogs-09.jpg"} alt={`${item.name} WARDOGS record`} fill sizes="132px" />
                  </div>
                  <strong>{item.name}</strong>
                  <span>{formatCatalogLabel(item.type || item.category, item.kind)}</span>
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
      <PageHero eyebrow="Reviewed weapon placements" title={`WARDOGS Tier List – ${data.label}`} description={`${data.description} Use it as a starting point for your own choice, not a replacement for trying a kit in the current game build.`} image="/images/official/wardogs-09.jpg" crumbs={[{ label: "Tier List", href: "/tier-list" }, { label: data.label }]} />

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
      <PageHero eyebrow="Reviewed weapon placements" title="WARDOGS Weapons Tier List" description="A compact field ranking for weapons with an editorial placement. Use it as a starting point, then check your budget, role and the current game build." image="/images/official/wardogs-09.jpg" crumbs={[{ label: "Tier List" }]} />
      <section className={`container ${styles.hubBoard}`}>
        <header><div><span>Featured board / weapons</span><h2>Current field ranking</h2><p>A compact preview of records with an editorial placement.</p></div><Link href="/tier-list/weapons">Open all 38 weapons <ArrowRight /></Link></header>
        <TierBoard items={preview} section="weapons" showEmpty />
      </section>
      <section className={`container ${styles.methodology}`}><SectionHeading eyebrow="Ranking discipline" title="How to read the board" /><div><article><Scale /><h3>Compare by role</h3><p>Each weapon is placed for how it performs in its intended job, not against unrelated classes.</p></article><article><BarChart3 /><h3>Compare the stats</h3><p>Price and rate of fire stay visible beside every placement for a quick comparison.</p></article><article><CheckCircle2 /><h3>Use your own kit</h3><p>Try a weapon with your budget, role and preferred range before making it a regular pick.</p></article></div></section>
    </main>
  );
}

export default TierListPage;
