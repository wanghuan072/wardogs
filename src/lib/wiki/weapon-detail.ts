import type { CatalogItem } from "../../types/catalog";

const money = (value: number | null) => value === null ? "not recorded" : `$${value.toLocaleString("en-US")}`;

function number(value: number | null, suffix: string) {
  return value === null ? "not recorded" : `${value.toLocaleString("en-US")}${suffix}`;
}

export function weaponTitle(item: CatalogItem) {
  return `${item.name} WARDOGS Weapon Stats, Ammo and Attachments`;
}

export function weaponMetaDescription(item: CatalogItem) {
  const type = item.type ? item.type.toLowerCase() : "weapon";
  const rate = item.stats.rpm === null ? "no recorded fire rate" : `${item.stats.rpm.toLocaleString("en-US")} RPM`;
  const caliber = item.caliber || "unrecorded caliber";
  const text = `Check ${item.name} in WARDOGS: ${type} price ${money(item.price)}, ${caliber} and ${rate}. Compare compatible ammunition, magazines and attachments before building a kit for your next match.`;
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).replace(/\s+\S*$/, "").trimEnd()}…`;
}

export function weaponBriefing(item: CatalogItem) {
  const range = item.stats.effectiveRange === null ? null : number(item.stats.effectiveRange, " m");
  const rate = item.stats.rpm === null ? null : number(item.stats.rpm, " RPM");
  const weight = item.weight === null ? null : number(item.weight, " kg");
  const detail = [range && `effective range of ${range}`, rate && `${rate} fire rate`, weight && `${weight} weight`].filter(Boolean).join(", ");
  const type = item.type ? item.type.toLowerCase() : "weapon";
  const role = item.role ? `It fills the ${item.role.toLowerCase()} role in the current weapon list.` : "Use the listed stats to judge where it fits in your kit.";
  const article = /^[aeiou]/i.test(type) ? "an" : "a";
  return `${item.name} is ${article} ${type}${item.caliber ? ` chambered for ${item.caliber}` : ""}. ${detail ? `Key numbers include ${detail}. ` : "Use the available loadout details to compare it with nearby options. "}${role}`;
}

export function weaponReadout(item: CatalogItem) {
  return [
    { label: "Recorded price", value: money(item.price) },
    { label: "Class", value: item.type || "not recorded" },
    { label: "Loadout slot", value: item.slot || "not recorded" },
    { label: "Caliber", value: item.caliber || "not recorded" },
    { label: "Rate of fire", value: number(item.stats.rpm, " RPM") },
    { label: "Effective range", value: number(item.stats.effectiveRange, " m") },
    { label: "Muzzle velocity", value: number(item.stats.muzzleVelocity, " m/s") },
    { label: "Weight", value: number(item.weight, " kg") },
  ];
}
