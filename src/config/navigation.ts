export const primaryNavigation = [
  { label: "Home", href: "/" },
  { label: "Wiki", href: "/wiki" },
  { label: "Guides", href: "/guides" },
  { label: "Builder", href: "/builder" },
  { label: "Tier List", href: "/tier-list" },
  { label: "Tools", href: "/tools" },
  { label: "Updates", href: "/updates" },
];

export const wikiNavigation = [
  {
    label: "Armory",
    links: [
      ["Weapons", "/wiki/weapons"],
      ["Ammunition", "/wiki/ammunition"],
      ["Attachments", "/wiki/attachments"],
    ],
  },
  {
    label: "Gear",
    links: [
      ["All Equipment", "/wiki/equipment"],
      ["Armor", "/wiki/equipment?category=armor"],
      ["Medical", "/wiki/equipment?category=medical"],
      ["Storage", "/wiki/equipment?category=storage"],
      ["Deployables", "/wiki/equipment?category=deployables"],
    ],
  },
  {
    label: "Vehicles",
    links: [
      ["All Vehicles", "/wiki/vehicles"],
      ["Ground", "/wiki/vehicles?category=ground-vehicles"],
      ["Tanks / Armored", "/wiki/vehicles?category=tanks"],
      ["Helicopters", "/wiki/vehicles?category=helicopters"],
      ["Logistics", "/wiki/vehicles?category=logistics"],
    ],
  },
] as const;

export const headerDropdowns: Record<string, readonly (readonly [string, string])[]> = {
  Guides: [
    ["All Guides", "/guides"],
    ["Beginner Guide", "/guides/beginner-guide"],
    ["Cash Economy", "/guides/cash-economy"],
    ["Helicopter Controls", "/guides/helicopter-controls"],
    ["Control Zone", "/guides/control-zone-guide"],
  ],
  "Tier List": [
    ["Tier List Overview", "/tier-list"],
    ["Weapons", "/tier-list/weapons"],
    ["Ammunition", "/tier-list/ammunition"],
    ["Attachments", "/tier-list/attachments"],
    ["Vehicles", "/tier-list/vehicles"],
  ],
  Tools: [
    ["All Tools", "/tools"],
    ["Weapon Compare", "/tools/weapon-compare"],
    ["Budget Planner", "/tools/budget-planner"],
  ],
};
