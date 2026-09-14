import assert from "node:assert/strict";
import test from "node:test";
import { getBuilderOptions, magazineCapacity, storageCapacity, type BuilderItem } from "../src/lib/tools/loadout.ts";

const weapon = { slug: "rifle", name: "Rifle", kind: "weapon", category: null, type: null, slot: "Primary", caliber: null, ammoType: null, price: null, weight: null, image: null, ammoIds: ["rifle-round"], attachmentIds: ["rifle-mag", "scope"], compatibleWeaponIds: [], observedFacts: [], stats: { magazineSize: null } } satisfies BuilderItem;
const cartridge = { ...weapon, slug: "rifle-round", kind: "ammo", slot: null, ammoType: "cartridge", ammoIds: [], attachmentIds: [], compatibleWeaponIds: [] } satisfies BuilderItem;
const unrelatedCartridge = { ...cartridge, slug: "other-round" } satisfies BuilderItem;
const magazine = { ...cartridge, slug: "rifle-mag", ammoType: "magazine" } satisfies BuilderItem;

test("magazine capacity prefers structured data", () => {
  assert.equal(magazineCapacity({ name: "Extended Magazine", stats: { magazineSize: 45 } }), 45);
});

test("magazine capacity recognizes common item names", () => {
  assert.equal(magazineCapacity({ name: "STANAG 30 RND Magazine", stats: { magazineSize: null } }), 30);
  assert.equal(magazineCapacity({ name: "20 round internal magazine", stats: { magazineSize: null } }), 20);
});

test("unknown magazine capacity stays unknown instead of becoming zero", () => {
  assert.equal(magazineCapacity({ name: "Extended Magazine", stats: { magazineSize: null } }), null);
});

test("storage capacity is read from recorded facts", () => {
  assert.equal(storageCapacity({ observedFacts: ["Grid: 4x2 Item Storage Slots", "Number of Slots: 8"] }), 8);
  assert.equal(storageCapacity({ observedFacts: ["Item Storage + Sling"] }), null);
});

test("builder options only show records compatible with the active weapon", () => {
  assert.deepEqual(getBuilderOptions([cartridge, unrelatedCartridge, magazine], "ammo", weapon).map((item) => item.slug), ["rifle-round"]);
  assert.deepEqual(getBuilderOptions([cartridge, unrelatedCartridge, magazine], "magazine", weapon).map((item) => item.slug), ["rifle-mag"]);
  assert.deepEqual(getBuilderOptions([cartridge, magazine], "ammo").map((item) => item.slug), []);
});
