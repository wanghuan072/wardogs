import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { toolDefinitions } from "@/config/tools";
import { guides } from "@/lib/data/editorial";
import { weapons } from "@/lib/data/catalog";

// Only routes touched by this release receive the release date. Keep this
// explicit so future deployments do not refresh every URL's lastmod value.
const releaseDate = "2026-09-14";

const pages: { path: string; lastModified: string; priority: number; frequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", lastModified: releaseDate, priority: 1, frequency: "weekly" }, { path: "/wiki", lastModified: releaseDate, priority: .9, frequency: "weekly" },
  { path: "/wiki/weapons", lastModified: releaseDate, priority: .84, frequency: "weekly" }, { path: "/wiki/ammunition", lastModified: releaseDate, priority: .84, frequency: "weekly" }, { path: "/wiki/attachments", lastModified: releaseDate, priority: .8, frequency: "weekly" }, { path: "/wiki/equipment", lastModified: releaseDate, priority: .8, frequency: "weekly" }, { path: "/wiki/vehicles", lastModified: releaseDate, priority: .8, frequency: "weekly" },
  { path: "/guides", lastModified: releaseDate, priority: .88, frequency: "weekly" }, { path: "/builder", lastModified: releaseDate, priority: .88, frequency: "weekly" }, { path: "/tools", lastModified: releaseDate, priority: .82, frequency: "weekly" },
  { path: "/tier-list", lastModified: releaseDate, priority: .8, frequency: "weekly" }, { path: "/tier-list/weapons", lastModified: releaseDate, priority: .74, frequency: "weekly" },
  { path: "/updates", lastModified: releaseDate, priority: .8, frequency: "weekly" },
  { path: "/privacy", lastModified: releaseDate, priority: .35, frequency: "yearly" }, { path: "/terms", lastModified: releaseDate, priority: .35, frequency: "yearly" }, { path: "/copyright", lastModified: releaseDate, priority: .35, frequency: "yearly" }, { path: "/about", lastModified: releaseDate, priority: .45, frequency: "monthly" }, { path: "/contact", lastModified: releaseDate, priority: .35, frequency: "yearly" },
];

const entry = (path: string, date: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]): MetadataRoute.Sitemap[number] => ({ url: new URL(path, siteConfig.url).toString(), lastModified: new Date(`${date}T00:00:00Z`), changeFrequency, priority });

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((page) => entry(page.path, page.lastModified, page.priority, page.frequency)),
    ...guides.map((guide) => entry(`/guides/${guide.slug}`, releaseDate, .78, "monthly")),
    ...toolDefinitions.map((tool) => entry(`/tools/${tool.slug}`, releaseDate, .72, "monthly")),
    ...weapons.map((weapon) => entry(`/wiki/weapons/${weapon.slug}`, releaseDate, .68, "monthly")),
  ];
}
