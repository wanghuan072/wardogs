import type { CatalogItem } from "@/types/catalog";

export type CatalogSortKey = "name" | "price-asc" | "price-desc" | "rpm" | "recent";
export type PriceRange = "up-to-1000" | "under-1000" | "1000-2500" | "2501-5000" | "5001";

const sortKeys = new Set<CatalogSortKey>(["name", "price-asc", "price-desc", "rpm", "recent"]);

export function normalizeCatalogSort(value: string, allowRateOfFire: boolean): CatalogSortKey {
  if (!sortKeys.has(value as CatalogSortKey)) return "name";
  if (value === "rpm" && !allowRateOfFire) return "name";
  return value as CatalogSortKey;
}

export function matchesPriceRange(value: number | null, range: string) {
  if (!range) return true;
  if (value === null) return false;
  if (range === "up-to-1000" || range === "under-1000") return value <= 1000;
  if (range === "1000-2500") return value > 1000 && value <= 2500;
  if (range === "2501-5000") return value > 2500 && value <= 5000;
  if (range === "5001") return value > 5000;
  return true;
}

export function countCatalogType(items: CatalogItem[], value: string) {
  return items.filter((item) => (item.type || item.kind) === value).length;
}

export function sortCatalogItems(items: CatalogItem[], sort: CatalogSortKey) {
  return [...items].sort((a, b) => {
    if (sort === "price-asc") return (a.price ?? Infinity) - (b.price ?? Infinity) || a.name.localeCompare(b.name);
    if (sort === "price-desc") return (b.price ?? -1) - (a.price ?? -1) || a.name.localeCompare(b.name);
    if (sort === "rpm") return (b.stats.rpm ?? -1) - (a.stats.rpm ?? -1) || a.name.localeCompare(b.name);
    if (sort === "recent") return b.lastChecked.localeCompare(a.lastChecked) || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name);
  });
}
