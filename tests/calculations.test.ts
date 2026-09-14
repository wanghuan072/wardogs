import assert from "node:assert/strict";
import test from "node:test";
import { calculateBudget, isBudgetItem, type ToolItem } from "../src/lib/tools/calculations.ts";

function item(price: number | null, kind = "weapon"): ToolItem {
  return { slug: "test", name: "Test", kind, type: null, role: null, slot: null, caliber: null, price, weight: null, image: null, rpm: null, damage: null, range: null, velocity: null, recoil: null, ammoIds: [], compatibleWeaponIds: [] };
}

test("budget totals known prices and reports incomplete source data", () => {
  assert.deepEqual(calculateBudget(10_000, [item(2_500), item(null)]), {
    loadoutCost: 2_500,
    cashRemaining: 7_500,
    bankUsed: 25,
    livesAffordable: 4,
    complete: false,
  });
});

test("budget planner includes storage, supplies, and explosives", () => {
  for (const kind of ["storage", "supplies", "explosive"]) assert.equal(isBudgetItem(item(100, kind)), true);
  assert.equal(isBudgetItem(item(100, "other")), false);
});
