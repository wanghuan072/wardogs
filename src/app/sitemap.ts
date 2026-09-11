import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { toolDefinitions } from "@/config/tools";
import { guides } from "@/lib/data/editorial";

const pages: { path: string; lastModified: string; priority: number; frequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", lastModified: "2026-09-10", priority: 1, frequency: "weekly" }, { path: "/wiki", lastModified: "2026-09-10", priority: .9, frequency: "weekly" },
  { path: "/wiki/weapons", lastModified: "2026-09-09", priority: .84, frequency: "weekly" }, { path: "/wiki/ammunition", lastModified: "2026-09-09", priority: .84, frequency: "weekly" }, { path: "/wiki/attachments", lastModified: "2026-09-09", priority: .8, frequency: "weekly" }, { path: "/wiki/equipment", lastModified: "2026-09-09", priority: .8, frequency: "weekly" }, { path: "/wiki/vehicles", lastModified: "2026-09-09", priority: .8, frequency: "weekly" },
  { path: "/guides", lastModified: "2026-09-10", priority: .88, frequency: "weekly" }, { path: "/builder", lastModified: "2026-09-10", priority: .88, frequency: "weekly" }, { path: "/tools", lastModified: "2026-09-10", priority: .82, frequency: "weekly" },
  { path: "/tier-list", lastModified: "2026-09-10", priority: .8, frequency: "weekly" }, { path: "/tier-list/weapons", lastModified: "2026-09-09", priority: .74, frequency: "weekly" }, { path: "/tier-list/ammunition", lastModified: "2026-09-09", priority: .74, frequency: "weekly" }, { path: "/tier-list/attachments", lastModified: "2026-09-09", priority: .74, frequency: "weekly" }, { path: "/tier-list/equipment", lastModified: "2026-09-09", priority: .74, frequency: "weekly" }, { path: "/tier-list/vehicles", lastModified: "2026-09-09", priority: .74, frequency: "weekly" },
  { path: "/updates", lastModified: "2026-09-10", priority: .8, frequency: "weekly" },
  { path: "/legal/privacy-policy", lastModified: "2026-09-11", priority: .35, frequency: "yearly" }, { path: "/legal/terms-of-service", lastModified: "2026-09-11", priority: .35, frequency: "yearly" }, { path: "/legal/copyright", lastModified: "2026-09-11", priority: .35, frequency: "yearly" }, { path: "/legal/about-us", lastModified: "2026-09-11", priority: .45, frequency: "monthly" }, { path: "/legal/contact-us", lastModified: "2026-09-11", priority: .35, frequency: "yearly" },
];

const entry = (path: string, date: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]): MetadataRoute.Sitemap[number] => ({ url: new URL(path, siteConfig.url).toString(), lastModified: new Date(`${date}T00:00:00Z`), changeFrequency, priority });

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((page) => entry(page.path, page.lastModified, page.priority, page.frequency)),
    ...guides.map((guide) => entry(`/guides/${guide.slug}`, guide.updatedAt, .78, "monthly")),
    ...toolDefinitions.map((tool) => entry(`/tools/${tool.slug}`, "2026-09-10", .72, "monthly")),
  ];
}
