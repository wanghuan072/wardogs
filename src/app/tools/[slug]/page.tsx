import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolDefinitions } from "@/config/tools";
import { catalogDisplayItems } from "@/lib/data/catalog";
import { isBudgetItem, type ToolItem } from "@/lib/tools/calculations";
import { ToolDetailPage } from "@/page/tools/ToolDetailPage";
import { buildMetadata } from "@/seo/metadata";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return toolDefinitions.map((tool) => ({ slug: tool.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const tool = toolDefinitions.find((entry) => entry.slug === slug); if (!tool) return {}; return buildMetadata({ ...tool.seo, path: `/tools/${slug}` }); }
export default async function ToolRoute({ params }: Props) {
  const { slug } = await params;
  const tool = toolDefinitions.find((entry) => entry.slug === slug); if (!tool) notFound();
  const sourceItems = tool.slug === "weapon-compare"
    ? catalogDisplayItems.filter((item) => item.kind === "weapon" || item.kind === "ammo")
    : catalogDisplayItems.filter(isBudgetItem);
  const items: ToolItem[] = sourceItems.map((item) => {
    const base = { slug: item.slug, name: item.name, kind: item.kind, type: item.type, caliber: item.caliber, price: item.price, image: item.image };
    if (tool.slug === "budget-planner") return base;
    return { ...base, role: item.role, slot: item.slot, weight: item.weight, rpm: item.stats.rpm, damage: item.stats.damage, range: item.stats.effectiveRange, velocity: item.stats.muzzleVelocity, recoil: item.stats.recoil, ammoIds: item.ammoIds, compatibleWeaponIds: item.compatibleWeaponIds };
  });
  return <ToolDetailPage tool={tool} items={items} />;
}
