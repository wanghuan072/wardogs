export function formatMoney(value: number | null | undefined) {
  return typeof value === "number" ? `$${value.toLocaleString("en-US")}` : "Unknown";
}

export function formatNumber(value: number | null | undefined, suffix = "") {
  return typeof value === "number" ? `${value.toLocaleString("en-US")}${suffix}` : "Unknown";
}

export function formatStatEffect(name: string, effect: { op?: string; v?: number }) {
  const value = effect.v;
  if (typeof value !== "number") return { label: "Recorded effect", value: "Needs review" };
  const labels: Record<string, string> = { vRecoil: "Vertical recoil", hRecoil: "Horizontal recoil", spread: "Spread", ads: "ADS time", equip: "Equip time" };
  if (effect.op === "mul" && labels[name]) {
    const percentage = Math.round((value - 1) * 100);
    return { label: labels[name], value: `${percentage > 0 ? "+" : ""}${percentage}%` };
  }
  if (name === "zoom") return { label: "Magnification", value: `${value}×` };
  if (name === "zeroMin") return { label: "Minimum zero", value: `${value} m` };
  if (name === "zeroMax") return { label: "Maximum zero", value: `${value} m` };
  return { label: "Recorded effect", value: effect.op === "set" ? String(value) : `${value}` };
}

export function formatCatalogLabel(value: string | null | undefined, fallback = "Unclassified"): string {
  if (!value || value === "None") return fallback === "Unclassified" ? fallback : formatCatalogLabel(fallback);
  const labels: Record<string, string> = { "Stationary STN_05": "Stationary Defense", DustCover: "Dust Cover", CantedSight: "Canted Sight", Pistolgrip: "Pistol Grip", FMJTracer: "FMJ Tracer", attachment: "Attachment", medical: "Medical", storage: "Storage", offensive: "Offensive", utility: "Utility", explosive: "Explosive", supplies: "Supplies", throwable: "Throwable", deployable: "Deployable", other: "Other" };
  return labels[value] || value.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ");
}

export function formatCaliber(value: string | null | undefined) {
  if (!value) return "";
  const labels: Record<string, string> = { ".50Cal": ".50 Cal", "338Nor": ".338 Norma" };
  return labels[value] || value;
}

export function titleFromSlug(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
