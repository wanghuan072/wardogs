export type DataStatus = "verified" | "observed" | "community" | "unknown";

export type CatalogKind =
  | "weapon"
  | "ammo"
  | "attachment"
  | "vehicle"
  | "armor"
  | "medical"
  | "storage"
  | "throwable"
  | "explosive"
  | "utility"
  | "supplies"
  | "deployable"
  | "melee"
  | "other";

export type CatalogStats = {
  damage: number | null;
  rpm: number | null;
  muzzleVelocity: number | null;
  effectiveRange: number | null;
  magazineSize: number | null;
  recoil: number | null;
  accuracy: number | null;
  penetration: number | null;
  seats: number | null;
  passengers: number | null;
  maxSpeed: number | null;
  maxFuel: number | null;
  rangeKm: number | null;
  trunkSlots: number | null;
};

export type CatalogItem = {
  id: string;
  slug: string;
  name: string;
  kind: CatalogKind;
  category: string | null;
  type: string | null;
  role: string | null;
  slot: string | null;
  caliber: string | null;
  ammoType: string | null;
  price: number | null;
  weight: number | null;
  image: string | null;
  summary: string;
  stats: CatalogStats;
  fireModes: string[];
  weapons: string[];
  countermeasures: string[];
  ammoIds: string[];
  attachmentIds: string[];
  compatibleWeaponIds: string[];
  statEffects: Record<string, { op?: string; v?: number }>;
  observedFacts: string[];
  dataStatus: DataStatus;
  dataSource: string;
  sourceUrl: string;
  patchVersion: string;
  lastChecked: string;
};

export type GuideSection = { heading: string; body: string[]; image?: string; caption?: string };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  seo: { title: string; description: string };
  category: string;
  image: string;
  publishedAt: string;
  updatedAt: string;
  patchVersion: string;
  quickAnswer: string;
  sections: GuideSection[];
  relatedWiki: string[];
  relatedTools: string[];
  faq?: { question: string; answer: string }[];
};

export type UpdateEntry = {
  slug: string;
  title: string;
  label: string;
  version: string;
  date: string;
  sourceUrl: string;
  sourceLabel: string;
  summary: string;
  categories: string[];
  changes: { area: string; description: string }[];
};
