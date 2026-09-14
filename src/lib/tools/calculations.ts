export type ToolItem = {
  slug: string;
  name: string;
  kind: string;
  type: string | null;
  caliber: string | null;
  price: number | null;
  image: string | null;
  role?: string | null;
  slot?: string | null;
  weight?: number | null;
  rpm?: number | null;
  damage?: number | null;
  range?: number | null;
  velocity?: number | null;
  recoil?: number | null;
  ammoIds?: string[];
  compatibleWeaponIds?: string[];
};

const budgetItemKinds = new Set(["weapon", "ammo", "attachment", "armor", "medical", "storage", "utility", "supplies", "throwable", "explosive", "deployable", "melee", "vehicle"]);

export function isBudgetItem(item: Pick<ToolItem, "kind">) {
  return budgetItemKinds.has(item.kind);
}

export function calculateBudget(cash: number, selected: ToolItem[]) {
  const knownPrices = selected.filter((item) => item.price !== null);
  const loadoutCost = knownPrices.reduce((total, item) => total + (item.price || 0), 0);
  const cashRemaining = cash - loadoutCost;
  return {
    loadoutCost,
    cashRemaining,
    bankUsed: cash > 0 ? (loadoutCost / cash) * 100 : 0,
    livesAffordable: loadoutCost > 0 ? Math.floor(cash / loadoutCost) : 0,
    complete: knownPrices.length === selected.length,
  };
}
