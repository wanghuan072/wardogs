import type { CatalogItem } from "@/types/catalog";

export type BuilderItem = Pick<
  CatalogItem,
  | "slug"
  | "name"
  | "kind"
  | "category"
  | "type"
  | "slot"
  | "caliber"
  | "ammoType"
  | "price"
  | "weight"
  | "image"
  | "ammoIds"
  | "attachmentIds"
  | "compatibleWeaponIds"
  | "observedFacts"
> & { stats: Pick<CatalogItem["stats"], "magazineSize"> };

// 构筑器的分类既用于界面切换，也用于确定目录筛选规则。
export type BuilderTab =
  | "primary"
  | "sidearm"
  | "launcher"
  | "ammo"
  | "magazine"
  | "attachment"
  | "medical"
  | "building"
  | "recon"
  | "vehicle"
  | "tactical";

// 目录中允许出现在构筑器里的类别。新增类别时只需在这里登记，并由目录校验保证数据结构完整。
const builderKinds = new Set([
  "weapon",
  "ammo",
  "attachment",
  "vehicle",
  "armor",
  "medical",
  "storage",
  "throwable",
  "explosive",
  "utility",
  "supplies",
  "deployable",
  "melee",
]);

export const defaultPackCapacity = 8;

export function isBuilderItem(item: CatalogItem) {
  return builderKinds.has(item.kind);
}

export function toBuilderItem(item: CatalogItem): BuilderItem {
  return {
    slug: item.slug,
    name: item.name,
    kind: item.kind,
    category: item.category,
    type: item.type,
    slot: item.slot,
    caliber: item.caliber,
    ammoType: item.ammoType,
    price: item.price,
    weight: item.weight,
    image: item.image,
    stats: { magazineSize: item.stats.magazineSize },
    ammoIds: item.ammoIds,
    attachmentIds: item.attachmentIds,
    compatibleWeaponIds: item.compatibleWeaponIds,
    observedFacts: item.observedFacts,
  };
}

/**
 * 判断弹药、弹匣或配件是否能用于指定武器。
 * 兼容关系只读取目录字段，避免在组件内维护另一份容易漂移的规则。
 */
export function isCompatibleWithWeapon(item: BuilderItem, weapon: BuilderItem | undefined): boolean {
  if (!weapon) return false;
  if (item.kind === "ammo") {
    const weaponReferencesItem = item.ammoType === "magazine"
      ? weapon.attachmentIds.includes(item.slug)
      : weapon.ammoIds.includes(item.slug);
    return weaponReferencesItem || item.compatibleWeaponIds.includes(weapon.slug);
  }
  if (item.kind === "attachment") {
    return weapon.attachmentIds.includes(item.slug) || item.compatibleWeaponIds.includes(weapon.slug);
  }
  return false;
}

/**
 * 根据当前军械库分类返回可展示记录。该函数无副作用，方便单独测试与复用。
 */
export function getBuilderOptions(items: BuilderItem[], tab: BuilderTab, activeWeapon?: BuilderItem): BuilderItem[] {
  switch (tab) {
    case "primary": return items.filter((item) => item.kind === "weapon" && item.slot === "Primary");
    case "sidearm": return items.filter((item) => item.kind === "weapon" && item.slot === "Sidearm");
    case "launcher": return items.filter((item) => item.kind === "weapon" && item.slot === "Specialist");
    case "ammo": return items.filter((item) => item.kind === "ammo" && item.ammoType !== "magazine" && isCompatibleWithWeapon(item, activeWeapon));
    case "magazine": return items.filter((item) => item.kind === "ammo" && item.ammoType === "magazine" && isCompatibleWithWeapon(item, activeWeapon));
    case "attachment": return items.filter((item) => item.kind === "attachment" && isCompatibleWithWeapon(item, activeWeapon));
    case "medical": return items.filter((item) => item.kind === "medical");
    case "building": return items.filter((item) => item.kind === "deployable" || item.kind === "supplies");
    case "recon": return items.filter((item) => item.kind === "utility" || item.kind === "storage" || item.kind === "armor");
    case "vehicle": return items.filter((item) => item.kind === "vehicle");
    case "tactical": return items.filter((item) => item.kind === "throwable" || item.kind === "explosive" || item.kind === "melee");
  }
}

export function magazineCapacity(item: Pick<BuilderItem, "name" | "stats">): number | null {
  // 部分数据有结构化容量，旧数据则从名称（例如 30 RND）中兼容解析。
  if (typeof item.stats.magazineSize === "number" && item.stats.magazineSize > 0) return item.stats.magazineSize;
  const match = item.name.match(/(\d+)\s*(?:RND|round)/i);
  return match ? Number(match[1]) : null;
}

export function storageCapacity(item: Pick<BuilderItem, "observedFacts"> | undefined): number | null {
  if (!item) return null;
  for (const fact of item.observedFacts) {
    const match = fact.match(/Number of Slots:\s*(\d+)/i);
    if (match) return Number(match[1]);
  }
  return null;
}
