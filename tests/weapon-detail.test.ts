import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { weaponMetaDescription, weaponTitle } from "../src/lib/wiki/weapon-detail.ts";
import type { CatalogItem } from "../src/types/catalog.ts";

const m4: CatalogItem = {
  id: "m4", slug: "m4", name: "M4", kind: "weapon", category: "Ranged", type: "Assault Rifle", role: "Infantry", slot: "Primary", caliber: "5.56x45mm", ammoType: null, price: 2800, weight: 2.92, image: null, summary: "", fireModes: ["Auto", "Semi"], weapons: [], countermeasures: [], ammoIds: [], attachmentIds: [], compatibleWeaponIds: [], statEffects: {}, observedFacts: [], dataStatus: "community", dataSource: "test", sourceUrl: "https://example.com", patchVersion: "Pre-Early Access beta snapshot", lastChecked: "2026-09-09",
  stats: { damage: null, rpm: 800, muzzleVelocity: 910, effectiveRange: 500, magazineSize: null, recoil: 1, accuracy: .84, penetration: null, seats: null, passengers: null, maxSpeed: null, maxFuel: null, rangeKm: null, trunkSlots: null },
};
const catalog = JSON.parse(readFileSync(new URL("../src/data/catalog/items.json", import.meta.url), "utf8")) as CatalogItem[];

test("weapon detail metadata stays within the published search-snippet brief", () => {
  for (const weapon of catalog.filter((item) => item.kind === "weapon")) {
    assert.ok(weaponTitle(weapon).length >= 40 && weaponTitle(weapon).length <= 60, `${weapon.slug} title length`);
    assert.ok(weaponMetaDescription(weapon).length >= 140 && weaponMetaDescription(weapon).length <= 160, `${weapon.slug} description length`);
  }
});

test("weapon detail metadata describes concrete weapon fields", () => {
  const description = weaponMetaDescription(m4);
  assert.match(description, /\$2,800/);
  assert.match(description, /5\.56x45mm/);
  assert.match(description, /800 RPM/);
});
