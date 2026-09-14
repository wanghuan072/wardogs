import Link from "next/link";
import { Filter, Grid3X3, List, Search } from "lucide-react";
import { CatalogCard } from "@/components/content/CatalogCard";
import { CatalogSort } from "@/components/content/CatalogSort";
import { PageHero } from "@/components/common/PageHero";
import { catalogDisplayItems, equipmentCategoryMap, getAmmunitionFacet, listingGroups, vehicleCategoryMap, weaponCategoryMap } from "@/lib/data/catalog";
import { countCatalogType, matchesPriceRange, normalizeCatalogSort, sortCatalogItems } from "@/lib/catalog/listing";
import { formatCaliber, titleFromSlug } from "@/lib/formatting/format-values";
import type { CatalogItem } from "@/types/catalog";
import styles from "@/style/page/wiki/wiki-listing.module.css";
import { tdk } from "@/seo/tdk";

type Query = Record<string, string | string[] | undefined>;
type ListingContext = { section: string; sub?: string; title: string; metaTitle: string; description: string; image: string; items: CatalogItem[]; canonical: string };
type ListingCategory = { slug: string; label: string; test: (item: CatalogItem) => boolean };

const attachmentSlots: Record<string, string> = { optics: "Sight", muzzles: "Muzzle", grips: "Underbarrel", magazines: "Magazine", stocks: "Stock" };
export const listingCategories: Record<string, ListingCategory[]> = {
  weapons: Object.entries(weaponCategoryMap).map(([slug, values]) => ({ slug, label: titleFromSlug(slug), test: (item) => values.includes(item.type || "") })),
  attachments: Object.entries(attachmentSlots).map(([slug, slot]) => ({ slug, label: titleFromSlug(slug), test: (item) => item.slot === slot })),
  equipment: Object.entries(equipmentCategoryMap).map(([slug, kinds]) => ({ slug, label: titleFromSlug(slug), test: (item) => kinds.includes(item.kind) })),
  vehicles: [
    { slug: "ground-vehicles", label: "Ground", test: vehicleCategoryMap["ground-vehicles"] },
    { slug: "tanks", label: "Tanks / Armored", test: vehicleCategoryMap.tanks },
    { slug: "helicopters", label: "Helicopters", test: vehicleCategoryMap.helicopters },
    { slug: "logistics", label: "Logistics", test: vehicleCategoryMap.logistics },
  ],
};

export function isListingCategory(section: string, category: string) {
  return Boolean(listingCategories[section]?.some((entry) => entry.slug === category)) || (section === "ammunition" && getAmmunitionFacet(category).length > 0);
}

const heroImages: Record<string, string> = { weapons: "/images/home/wardogs-command-overlook.png", ammunition: "/images/official/wardogs-12.jpg", attachments: "/images/official/wardogs-13.jpg", equipment: "/images/official/wardogs-04.jpg", vehicles: "/images/official/wardogs-03.jpg" };

export function resolveListing(segments: string[]): ListingContext | null {
  const [section] = segments;
  const group = listingGroups[section];
  if (!group || segments.length !== 1) return null;
  const items = catalogDisplayItems.filter((item) => group.kinds.includes(item.kind));
  const seo = tdk.wikiListings[section as keyof typeof tdk.wikiListings];
  return { section, title: group.title, metaTitle: seo.title, description: seo.description, image: heroImages[section], items, canonical: group.href };
}

function value(query: Query, key: string) {
  const result = query[key];
  return Array.isArray(result) ? result[0] || "" : result || "";
}

function linkWith(canonical: string, query: URLSearchParams, updates: Record<string, string>) {
  const next = new URLSearchParams(query);
  for (const [key, val] of Object.entries(updates)) {
    if (val) next.set(key, val);
    else next.delete(key);
  }
  const output = next.toString();
  return output ? `${canonical}?${output}` : canonical;
}

export function WikiListingPage({ segments, searchParams }: { segments: string[]; searchParams: Query }) {
  const context = resolveListing(segments);
  if (!context) return null;
  const q = value(searchParams, "q").toLowerCase();
  const category = value(searchParams, "category");
  const type = value(searchParams, "type");
  const caliber = value(searchParams, "caliber");
  const requestedPrice = value(searchParams, "price");
  const price = requestedPrice === "under-1000" ? "up-to-1000" : requestedPrice;
  const sort = normalizeCatalogSort(value(searchParams, "sort") || "name", context.section === "weapons");
  const view = value(searchParams, "view") || "grid";

  const categoryConfig = listingCategories[context.section]?.find((entry) => entry.slug === category);
  const ammunitionCategory = context.section === "ammunition" && category ? getAmmunitionFacet(category) : [];
  const categoryItems = categoryConfig ? context.items.filter(categoryConfig.test) : ammunitionCategory.length ? ammunitionCategory : context.items;
  let filtered = categoryItems.filter((item) => {
    const matchesQuery = !q || `${item.name} ${item.type} ${item.caliber} ${item.summary}`.toLowerCase().includes(q);
    const matchesType = !type || item.type === type || item.kind === type || item.slot === type;
    const matchesCaliber = !caliber || item.caliber === caliber;
    const matchesPrice = matchesPriceRange(item.price, price);
    return matchesQuery && matchesType && matchesCaliber && matchesPrice;
  });

  filtered = sortCatalogItems(filtered, sort);
  const types = [...new Set(categoryItems.map((item) => item.type || item.kind).filter(Boolean))].sort();
  const calibers = [...new Set(categoryItems.map((item) => item.caliber).filter((entry): entry is string => Boolean(entry)))].sort();
  const preserved = new URLSearchParams();
  for (const key of ["q", "category", "type", "caliber", "price", "sort", "view"]) if (value(searchParams, key)) preserved.set(key, value(searchParams, key));
  const countBy = (key: "type" | "caliber", entry: string) => key === "type" ? countCatalogType(categoryItems, entry) : categoryItems.filter((item) => item[key] === entry).length;
  const priceOptions = [
    { value: "up-to-1000", label: "$0 – $1,000", count: categoryItems.filter((item) => matchesPriceRange(item.price, "up-to-1000")).length },
    { value: "1000-2500", label: "$1,001 – $2,500", count: categoryItems.filter((item) => matchesPriceRange(item.price, "1000-2500")).length },
    { value: "2501-5000", label: "$2,501 – $5,000", count: categoryItems.filter((item) => item.price !== null && item.price > 2500 && item.price <= 5000).length },
    { value: "5001", label: "$5,001+", count: categoryItems.filter((item) => item.price !== null && item.price > 5000).length },
  ];

  return (
    <main id="main-content">
      <PageHero eyebrow="WARDOGS item lists" title={context.title} description={context.description} image={context.image} crumbs={[{ label: "Wiki", href: "/wiki" }, { label: context.title.replace("WARDOGS ", "") }]} />
      <section className={`container ${styles.listingShell}`}>
        <aside className={styles.filters}>
          <div className={styles.filterTitle}><Filter aria-hidden="true" /><h2>Filter {context.section}</h2><Link href={context.canonical}>Reset</Link></div>
          {listingCategories[context.section]?.length ? <div className={styles.filterBlock}><h3>Category <span>⌃</span></h3><Link className={!category ? styles.activeFilter : ""} href={linkWith(context.canonical, preserved, { category: "", type: "" })}><i /><span>All {context.section}</span><b>{context.items.length}</b></Link>{listingCategories[context.section].map((entry) => <Link className={category === entry.slug ? styles.activeFilter : ""} href={linkWith(context.canonical, preserved, { category: entry.slug, type: "" })} key={entry.slug}><i /><span>{entry.label}</span><b>{context.items.filter(entry.test).length}</b></Link>)}</div> : <div className={styles.filterBlock}><h3>Type / category <span>⌃</span></h3><Link className={!type ? styles.activeFilter : ""} href={linkWith(context.canonical, preserved, { type: "" })}><i /><span>All {context.section}</span><b>{context.items.length}</b></Link>{types.slice(0, 9).map((entry) => <Link className={type === entry ? styles.activeFilter : ""} href={linkWith(context.canonical, preserved, { type: entry })} key={entry}><i /><span>{titleFromSlug(entry)}</span><b>{countBy("type", entry)}</b></Link>)}</div>}
          {calibers.length > 0 && <div className={styles.filterBlock}><h3>Caliber <span>⌃</span></h3><Link className={!caliber ? styles.activeFilter : ""} href={linkWith(context.canonical, preserved, { caliber: "" })}><i /><span>All calibers</span><b>{categoryItems.length}</b></Link>{calibers.slice(0, 7).map((entry) => <Link className={caliber === entry ? styles.activeFilter : ""} href={linkWith(context.canonical, preserved, { caliber: entry })} key={entry}><i /><span>{formatCaliber(entry)}</span><b>{countBy("caliber", entry)}</b></Link>)}</div>}
          <div className={styles.filterBlock}><h3>Price range <span>⌃</span></h3><Link className={!price ? styles.activeFilter : ""} href={linkWith(context.canonical, preserved, { price: "" })}><i /><span>Any price</span><b>{categoryItems.length}</b></Link>{priceOptions.map((entry) => <Link className={price === entry.value ? styles.activeFilter : ""} href={linkWith(context.canonical, preserved, { price: entry.value })} key={entry.value}><i /><span>{entry.label}</span><b>{entry.count}</b></Link>)}</div>
          <div className={styles.sourceNote}><strong>{context.section === "vehicles" ? "Vehicle filters can overlap" : "Plan around the available stats"}</strong><p>{context.section === "vehicles" ? "Ground includes armored and logistics vehicles, so category totals are not meant to be added together." : "Some items are listed before their price or full stat line has been added. Use populated fields to compare, then confirm the final buy in-game."}</p></div>
        </aside>

        <div className={styles.results}>
          <div className={styles.resultIntro}><div><h2>All {context.title} ({filtered.length})</h2><span>{filtered.length ? `${filtered.length} matching records` : "No matching records"}</span></div><p>{context.section === "weapons" ? "Use this WARDOGS weapons list to compare a kit before you buy." : "Compare the details that matter to your kit."}</p></div>
          <div className={styles.databaseToolbar}><form className={styles.primarySearch} action={context.canonical} role="search"><Search aria-hidden="true" /><label className="sr-only" htmlFor={`catalog-search-${context.section}`}>Search {context.section}</label><input id={`catalog-search-${context.section}`} type="search" name="q" defaultValue={value(searchParams, "q")} placeholder={`Search ${context.section} by name, caliber, or keyword…`} autoComplete="off" spellCheck={false} /><input type="hidden" name="category" value={category} /><input type="hidden" name="type" value={type} /><input type="hidden" name="caliber" value={caliber} /><input type="hidden" name="price" value={price} /><input type="hidden" name="sort" value={sort} /><button type="submit" aria-label="Search database">Search</button></form><CatalogSort value={sort} showRateOfFire={context.section === "weapons"} /><div className={styles.viewToggle}><Link className={view === "grid" ? styles.activeView : ""} href={linkWith(context.canonical, preserved, { view: "grid" })} aria-label="Grid view"><Grid3X3 size={17} /><span>Grid</span></Link><Link className={view === "list" ? styles.activeView : ""} href={linkWith(context.canonical, preserved, { view: "list" })} aria-label="List view"><List size={17} /><span>List</span></Link></div></div>
          <div className={styles.quickFilters}><Link href={linkWith(context.canonical, preserved, { sort: "price-asc" })}>★ Best budget</Link><Link href={linkWith(context.canonical, preserved, { price: "up-to-1000" })}>● Beginner picks</Link>{context.section === "weapons" && <Link href={linkWith(context.canonical, preserved, { sort: "rpm" })}>◆ High fire rate</Link>}</div>
          {filtered.length ? <div className={view === "list" ? styles.listView : styles.cardGrid}>{filtered.map((item) => <CatalogCard key={item.slug} item={item} view={view === "list" ? "list" : "grid"} href={context.section === "weapons" ? `/wiki/weapons/${item.slug}` : undefined} />)}</div> : <div className={styles.empty}><Search aria-hidden="true" /><h2>No records on this frequency</h2><p>Clear one or more filters to return to the full database.</p><Link href={context.canonical}>Reset filters</Link></div>}
          {context.section === "weapons" && <section className={styles.seoSection} aria-labelledby="choosing-wardogs-weapons"><h2 id="choosing-wardogs-weapons">Choose WARDOGS weapons for the job</h2><div><p>Start with the job, not a tier label. A cheap rifle that uses ammunition your squad already carries can be a stronger pick than an expensive gun that drains your reserve after one death. Use the filters to narrow the field by type, caliber and price, then compare the key stats beside each item.</p><p>Range, recoil and magazine size all matter, but so does whether you can keep the weapon fed. Check compatible ammunition before buying a primary, and leave enough cash for armor, medical supplies or the role your team needs.</p></div></section>}
        </div>
      </section>
    </main>
  );
}
