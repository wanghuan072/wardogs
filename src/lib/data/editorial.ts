import rawGuides from "@/data/guides/guides.json";
import rawUpdates from "@/data/updates/updates.json";
import type { Guide, UpdateEntry } from "@/types/catalog";

export const guides = rawGuides as Guide[];
export const updates = rawUpdates as UpdateEntry[];
export const guideBySlug = new Map(guides.map((guide) => [guide.slug, guide]));
