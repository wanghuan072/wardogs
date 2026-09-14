import assert from "node:assert/strict";
import test from "node:test";
import {
  countCatalogType,
  matchesPriceRange,
  normalizeCatalogSort,
  sortCatalogItems,
} from "../src/lib/catalog/listing.ts";
import type { CatalogItem } from "../src/types/catalog.ts";

function item(name: string, overrides: Partial<CatalogItem> = {}): CatalogItem {
  return {
    id: name,
    slug: name.toLowerCase(),
    name,
    kind: "ammo",
    category: null,
    type: null,
    role: null,
    slot: null,
    caliber: null,
    ammoType: null,
    price: null,
    weight: null,
    image: null,
    summary: "",
    stats: { damage: null, rpm: null, muzzleVelocity: null, effectiveRange: null, magazineSize: null, recoil: null, accuracy: null, penetration: null, seats: null, passengers: null, maxSpeed: null, maxFuel: null, rangeKm: null, trunkSlots: null },
    fireModes: [],
    weapons: [],
    countermeasures: [],
    ammoIds: [],
    attachmentIds: [],
    compatibleWeaponIds: [],
    statEffects: {},
    observedFacts: [],
    dataStatus: "community",
    dataSource: "test",
    sourceUrl: "https://example.com",
    patchVersion: "test",
    lastChecked: "2026-01-01",
    ...overrides,
  };
}

test("price ranges have complete, non-overlapping boundaries", () => {
  assert.equal(matchesPriceRange(1000, "up-to-1000"), true);
  assert.equal(matchesPriceRange(1000, "1000-2500"), false);
  assert.equal(matchesPriceRange(1001, "1000-2500"), true);
  assert.equal(matchesPriceRange(null, "up-to-1000"), false);
});

test("fallback kind facets report the same count they filter", () => {
  assert.equal(countCatalogType([item("A"), item("B", { type: "FMJ" })], "ammo"), 1);
});

test("recent sort uses the last checked date and stable name fallback", () => {
  const records = [item("Bravo", { lastChecked: "2026-01-01" }), item("Alpha", { lastChecked: "2026-02-01" })];
  assert.deepEqual(sortCatalogItems(records, "recent").map((entry) => entry.name), ["Alpha", "Bravo"]);
});

test("invalid and unsupported sort keys fall back to name", () => {
  assert.equal(normalizeCatalogSort("rpm", false), "name");
  assert.equal(normalizeCatalogSort("unexpected", true), "name");
});
