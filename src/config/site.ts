export const siteConfig = {
  name: "WARDOGS Field Intel",
  shortName: "WARDOGS",
  description:
    "Independent WARDOGS player site with weapon and gear lists, a compatible loadout builder, practical guides, comparison tools, tier picks and patch updates.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://wardogs.com",
  steamUrl: "https://store.steampowered.com/app/1867240/WARDOGS/",
  currentStatus: "WARDOGS Early Access",
  dataVersion: "Early Access",
  dataUpdated: "2026-09-09",
  contactEmail: "wyong@wardogs.com",
} as const;
