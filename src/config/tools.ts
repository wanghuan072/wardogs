import { BadgeDollarSign, GitCompareArrows } from "lucide-react";

export const toolDefinitions = [
  { slug: "weapon-compare", name: "Weapon Compare", group: "Compare", icon: GitCompareArrows, description: "Put two to four weapons side by side, then check the ammunition that works with each one.", seo: { title: "WARDOGS Weapon Compare - Check Your Best Matchup", description: "Compare WARDOGS weapons side by side by price, caliber, damage, range and rate of fire. Check compatible ammunition before choosing the weapon that fits your next role." } },
  { slug: "budget-planner", name: "Budget Planner", group: "Economy", icon: BadgeDollarSign, description: "See what one deployment costs before you spend your cash. It totals the items you choose and does not predict earnings or survival.", seo: { title: "WARDOGS Budget Planner - Price Your Next Deployment", description: "Price a complete WARDOGS deployment before you spend your cash. Add weapons, ammunition, gear and utility, then see how much of your reserve remains for the next life." } },
] as const;
