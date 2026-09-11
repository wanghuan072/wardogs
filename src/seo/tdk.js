// Shared search snippets for indexable WARDOGS pages. Keep titles focused and
// descriptions useful at search-result length; article-level copy stays with its data.
export const tdk = {
  home: {
    title: "WARDOGS - Weapons, Gear, Guides & Updates",
    description: "Plan your next WARDOGS deployment with clear weapon and gear lists, compatible loadouts, player-written guides, practical tools, tier picks and patch notes.",
    path: "/",
  },
  wiki: {
    title: "WARDOGS Wiki - Weapons, Ammo, Gear & Vehicles",
    description: "Use the WARDOGS Wiki to check weapon prices, ammunition, attachments, field gear and vehicles in one place, with the details players need before buying a kit.",
    path: "/wiki",
  },
  wikiListings: {
    weapons: { title: "WARDOGS Weapons - Prices, Stats and Full List", description: "Browse WARDOGS weapons with prices, calibers, fire rates, range and compatible ammunition. Compare rifles, SMGs, pistols and launchers before you spend." },
    ammunition: { title: "WARDOGS Ammunition - Calibers, Mags and Full List", description: "Check WARDOGS ammunition by caliber, magazine and round type. See which weapons use each option, then choose a supply that matches the kit you plan to deploy." },
    attachments: { title: "WARDOGS Attachments - Optics, Muzzles and Full List", description: "Compare WARDOGS attachments by slot, including optics, muzzles, grips, magazines and stocks. Check the practical fit before you buy parts for your next weapon." },
    equipment: { title: "WARDOGS Equipment - Armor, Medical and Full List", description: "Browse WARDOGS equipment including armor, medical supplies, storage, throwables and deployables. Find useful details for each kit slot before deployment." },
    vehicles: { title: "WARDOGS Vehicles - Ground, Air and Full List", description: "Compare WARDOGS vehicles across ground transport, armored platforms, helicopters and logistics. Check role, crew space, cost and use details before committing." },
  },
  guides: {
    title: "WARDOGS Guides - Learn the Systems, Win More Fights",
    description: "Read focused WARDOGS guides for your first match, cash economy, helicopter controls and Control Zone play, written to help you make better calls under pressure.",
    path: "/guides",
  },
  builder: {
    title: "WARDOGS Loadout Builder - Build a Compatible Kit",
    description: "Build a WARDOGS kit before you deploy: choose a weapon, see compatible ammunition and attachments, then track cash, weight, storage and utility in one screen.",
    path: "/builder",
  },
  tools: {
    title: "WARDOGS Tools - Compare Weapons and Plan Your Budget",
    description: "Use practical WARDOGS tools to compare weapons side by side and price a complete deployment, so every purchase supports the job you are taking into the match.",
    path: "/tools",
  },
  tierList: {
    title: "WARDOGS Tier Lists - Community Picks by Category",
    description: "Explore WARDOGS tier lists for weapons, ammunition, attachments, equipment and vehicles. Compare picks by role, price and the job each item covers in a match.",
    path: "/tier-list",
  },
  tierDetails: {
    weapons: { title: "WARDOGS Weapons Tier List - Picks by Weapon Type", description: "Explore the WARDOGS weapons tier list with rifles, SMGs, pistols and launchers on one board. Filter by weapon type to compare price, role and practical use." },
    ammunition: { title: "WARDOGS Ammo Tier List - Picks by Caliber and Type", description: "Explore the WARDOGS ammunition tier list by caliber and round family. Compare options on one board, then judge each pick against your weapon and role." },
    attachments: { title: "WARDOGS Attachments Tier List - Picks by Slot", description: "Explore the WARDOGS attachments tier list for optics, muzzles, grips, magazines and stocks. Filter by slot to compare useful upgrades for your weapon build." },
    equipment: { title: "WARDOGS Equipment Tier List - Picks for Every Kit", description: "Explore the WARDOGS equipment tier list for armor, medical gear, storage, supplies and deployables. Filter by role to choose useful support for each deployment." },
    vehicles: { title: "WARDOGS Vehicles Tier List - Ground, Air and Logistics", description: "Explore the WARDOGS vehicles tier list for transport, armored assets, helicopters and logistics. Filter by vehicle type to compare roles, costs and value." },
  },
  updates: {
    title: "WARDOGS Updates - Patches, Release Dates & Changes",
    description: "Follow the WARDOGS update timeline with listed patch versions, release dates and player-relevant changes before rebuilding a kit or changing your match plan.",
    path: "/updates",
  },
  about: {
    title: "About WARDOGS Field Intel - Player Guide and Tools",
    description: "Learn how WARDOGS Field Intel organizes item lists, compatible kits, practical guides and updates, plus how to send a useful correction when a record changes.",
    path: "/legal/about-us",
  },
  privacy: {
    title: "Privacy Policy - WARDOGS Field Intel Player Site",
    description: "Read the WARDOGS Field Intel privacy policy for local tool inputs, routine hosting data and external links on this independent resource for WARDOGS players.",
    path: "/legal/privacy-policy",
  },
  terms: {
    title: "Terms of Service - WARDOGS Field Intel Player Site",
    description: "Read the WARDOGS Field Intel terms of service, including informational use, acceptable use, availability and responsibilities when using this player guide.",
    path: "/legal/terms-of-service",
  },
  copyright: {
    title: "Copyright Notice - WARDOGS Field Intel Fan Site",
    description: "Read the WARDOGS Field Intel copyright notice covering game names, fan-site materials, attribution and how rights holders can request a correction or removal.",
    path: "/legal/copyright",
  },
  contact: {
    title: "Contact WARDOGS Field Intel - Corrections and Rights",
    description: "Contact WARDOGS Field Intel about an item correction, a technical issue, attribution or rights concern. Include the page URL and context to check the report.",
    path: "/legal/contact-us",
  },
  search: {
    title: "Search WARDOGS Items, Guides and Player Tools",
    description: "Search WARDOGS weapons, ammunition, attachments, equipment, vehicles, guides and player tools from one place when you need a quick answer before a match.",
    path: "/search",
  },
};

export function getTdk(key) {
  return tdk[key];
}
