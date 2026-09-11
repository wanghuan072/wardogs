import rawItems from "@/data/catalog/items.json";
import type { CatalogItem, CatalogKind } from "@/types/catalog";

export const catalogRecords = rawItems as unknown as CatalogItem[];
export const catalogItems = catalogRecords;
export const catalogBySlug = new Map(catalogRecords.map((item) => [item.slug, item]));
const provisionalRecordSlugs = new Set(["a-91", "bushmaster-m17s", "kh-2002"]);
const suppressedDisplaySlugs = new Set(["amphetamine"]);

function displayRecordKey(item: CatalogItem) {
  const { id: _id, slug: _slug, ...displayFields } = item;
  return JSON.stringify(displayFields);
}

const seenDisplayRecords = new Set<string>();
export const catalogDisplayItems = catalogRecords.filter((item) => {
  if (item.id.startsWith("musictape-") || suppressedDisplaySlugs.has(item.slug)) return false;
  const key = displayRecordKey(item);
  if (seenDisplayRecords.has(key)) return false;
  seenDisplayRecords.add(key);
  return true;
});

export function isProvisionalRecord(item: Pick<CatalogItem, "slug">) {
  return provisionalRecordSlugs.has(item.slug);
}

export const weapons = catalogDisplayItems.filter((item) => item.kind === "weapon");
export const ammunition = catalogDisplayItems.filter((item) => item.kind === "ammo");
export const attachments = catalogDisplayItems.filter((item) => item.kind === "attachment");
export const vehicles = catalogDisplayItems.filter((item) => item.kind === "vehicle");
export const equipment = catalogDisplayItems.filter((item) =>
  ["armor", "medical", "storage", "throwable", "explosive", "utility", "supplies", "deployable", "melee", "other"].includes(item.kind),
);

export function facetSlug(value: string) {
  return value.toLowerCase().replace(/\./g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type AmmunitionFacet = { field: "caliber" | "ammoType" | "type"; value: string };

const ammunitionFacets = (() => {
  const facets = new Map<string, AmmunitionFacet>();
  for (const item of ammunition) {
    if (item.caliber) facets.set(`caliber-${facetSlug(item.caliber)}`, { field: "caliber", value: item.caliber });
    if (item.ammoType) facets.set(`format-${facetSlug(item.ammoType)}`, { field: "ammoType", value: item.ammoType });
    if (item.type) facets.set(`type-${facetSlug(item.type)}`, { field: "type", value: item.type });
  }
  return [...facets.entries()].map(([slug, facet]) => ({ slug, ...facet })).sort((a, b) => a.slug.localeCompare(b.slug));
})();

export const ammunitionFacetSlugs = ammunitionFacets.map((facet) => facet.slug);

export function getAmmunitionFacet(slug: string) {
  const facet = ammunitionFacets.find((entry) => entry.slug === slug);
  return facet ? ammunition.filter((item) => item[facet.field] === facet.value) : [];
}

export const catalogCounts = catalogDisplayItems.reduce<Record<string, number>>(
  (counts, item) => {
    counts[item.kind] = (counts[item.kind] || 0) + 1;
    return counts;
  },
  { total: catalogDisplayItems.length },
);

export const listingGroups: Record<
  string,
  { title: string; singular: string; kinds: CatalogKind[]; href: string; description: string }
> = {
  weapons: {
    title: "WARDOGS Weapons",
    singular: "Weapon",
    kinds: ["weapon"],
    href: "/wiki/weapons",
    description: "Browse recorded weapon prices, calibers, rate of fire, range, ammunition and attachment relationships.",
  },
  ammunition: {
    title: "WARDOGS Ammunition",
    singular: "Ammunition",
    kinds: ["ammo"],
    href: "/wiki/ammunition",
    description: "Trace magazines and rounds back to compatible weapons, with unknown launch values clearly marked.",
  },
  attachments: {
    title: "WARDOGS Attachments",
    singular: "Attachment",
    kinds: ["attachment"],
    href: "/wiki/attachments",
    description: "Compare optics, muzzles, grips, magazines, stocks and recorded stat effects.",
  },
  equipment: {
    title: "WARDOGS Equipment",
    singular: "Equipment",
    kinds: ["armor", "medical", "storage", "throwable", "explosive", "utility", "supplies", "deployable", "melee", "other"],
    href: "/wiki/equipment",
    description: "Explore armor, medical gear, storage, throwables, supplies, utility and buildable field equipment.",
  },
  vehicles: {
    title: "WARDOGS Vehicles",
    singular: "Vehicle",
    kinds: ["vehicle"],
    href: "/wiki/vehicles",
    description: "Compare recorded costs, crew capacity, speed, range and battlefield roles across air and ground vehicles.",
  },
};

export const weaponCategoryMap: Record<string, string[]> = {
  "assault-rifles": ["Assault Rifle"],
  smgs: ["SMG"],
  lmgs: ["LMG"],
  "marksman-rifles": ["Marksman Rifle"],
  "sniper-rifles": ["Sniper"],
  shotguns: ["Shotgun"],
  pistols: ["Pistol"],
  launchers: ["Launcher", "Bow"],
};

export const equipmentCategoryMap: Record<string, CatalogKind[]> = {
  armor: ["armor"],
  medical: ["medical"],
  storage: ["storage"],
  throwables: ["throwable"],
  explosives: ["explosive"],
  utility: ["utility", "other", "melee"],
  supplies: ["supplies"],
  deployables: ["deployable"],
};

export const vehicleCategoryMap: Record<string, (item: CatalogItem) => boolean> = {
  "ground-vehicles": (item) => !String(item.type).toLowerCase().includes("air"),
  tanks: (item) => /tank|tracked|armou?r/i.test(`${item.name} ${item.type} ${item.category}`),
  helicopters: (item) => /rotary|helicopter/i.test(`${item.name} ${item.type} ${item.category}`),
  logistics: (item) => /logistic|supply|cargo|ural|pickup/i.test(`${item.name} ${item.type} ${item.role} ${item.category}`) || (item.stats.passengers ?? 0) >= 5,
};

export function getItem(slug: string) {
  return catalogBySlug.get(slug);
}

export function getItemsBySlugs(slugs: string[]) {
  return slugs.map((slug) => getItem(slug)).filter((item): item is CatalogItem => Boolean(item));
}

export function getRelatedItems(item: CatalogItem) {
  const relationSlugs = [...item.ammoIds, ...item.attachmentIds, ...item.compatibleWeaponIds];
  return getItemsBySlugs(relationSlugs);
}

export function itemHref(item: CatalogItem) {
  if (item.kind === "weapon") return `/wiki/weapons/${item.slug}`;
  if (item.kind === "ammo") return `/wiki/ammunition/${item.slug}`;
  if (item.kind === "attachment") return `/wiki/attachments/${item.slug}`;
  if (item.kind === "vehicle") return `/wiki/vehicles/${item.slug}`;
  return `/wiki/equipment/${item.slug}`;
}

export function itemListingHref(item: Pick<CatalogItem, "kind">) {
  if (item.kind === "weapon") return "/wiki/weapons";
  if (item.kind === "ammo") return "/wiki/ammunition";
  if (item.kind === "attachment") return "/wiki/attachments";
  if (item.kind === "vehicle") return "/wiki/vehicles";
  return "/wiki/equipment";
}
