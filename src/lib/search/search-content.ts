import { catalogDisplayItems, itemHref } from "@/lib/data/catalog";
import { guides } from "@/lib/data/editorial";

export type SearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  group: string;
  image: string | null;
};

const index: SearchResult[] = [
  ...catalogDisplayItems.map((item) => ({
    id: `catalog:${item.slug}`,
    title: item.name,
    description: [item.type || item.kind, item.caliber, item.price === null ? null : `$${item.price.toLocaleString()}`].filter(Boolean).join(" · "),
    href: itemHref(item),
    group:
      item.kind === "weapon"
        ? "Weapons"
        : item.kind === "ammo"
          ? "Ammunition"
          : item.kind === "attachment"
            ? "Attachments"
            : item.kind === "vehicle"
              ? "Vehicles"
              : "Equipment",
    image: item.image,
  })),
  ...guides.map((guide) => ({
    id: `guide:${guide.slug}`,
    title: guide.title,
    description: guide.description,
    href: `/guides/${guide.slug}`,
    group: "Guides",
    image: guide.image,
  })),
  { id: "tool:builder", title: "Equipment Builder", description: "Assemble a weapon, compatible ammunition, attachments, armor and field gear with live cost and weight.", href: "/builder", group: "Tools", image: "/images/official/wardogs-12.jpg" },
];

export function searchContent(query: string) {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];

  return index
    .map((result) => {
      const haystack = `${result.title} ${result.description} ${result.group}`.toLowerCase();
      const score = tokens.reduce((total, token) => {
        if (result.title.toLowerCase() === token) return total + 20;
        if (result.title.toLowerCase().includes(token)) return total + 8;
        return haystack.includes(token) ? total + 2 : total;
      }, 0);
      return { result, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
    .map(({ result }) => result);
}
