export function formatMoney(value: number | null | undefined) {
  return typeof value === "number" ? `$${value.toLocaleString("en-US")}` : "Unknown";
}

export function formatNumber(value: number | null | undefined, suffix = "") {
  return typeof value === "number" ? `${value.toLocaleString("en-US")}${suffix}` : "Unknown";
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
