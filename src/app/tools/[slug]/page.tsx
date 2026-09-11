import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { toolDefinitions } from "@/config/tools";
import { catalogItems } from "@/lib/data/catalog";
import type { ToolItem } from "@/lib/tools/calculations";
import { ToolDetailPage } from "@/page/tools/ToolDetailPage";
import { buildMetadata } from "@/seo/metadata";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export function generateStaticParams() { return toolDefinitions.map((tool) => ({ slug: tool.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const tool = toolDefinitions.find((entry) => entry.slug === slug); if (!tool) return {}; return buildMetadata({ ...tool.seo, path: `/tools/${slug}` }); }
export default async function ToolRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  if (slug === "loadout-builder") redirect("/builder");
  if (["damage-calculator", "ttk-calculator", "weapon-finder", "ammo-selector", "loadout-advisor"].includes(slug)) redirect("/tools/weapon-compare");
  if (["budget-calculator", "death-cost-calculator"].includes(slug)) redirect("/tools/budget-planner");
  const tool = toolDefinitions.find((entry) => entry.slug === slug); if (!tool) notFound(); const query = await searchParams;
  const items: ToolItem[] = catalogItems.map((item) => ({ slug: item.slug, name: item.name, kind: item.kind, type: item.type, role: item.role, slot: item.slot, caliber: item.caliber, price: item.price, weight: item.weight, image: item.image, rpm: item.stats.rpm, damage: item.stats.damage, range: item.stats.effectiveRange, velocity: item.stats.muzzleVelocity, recoil: item.stats.recoil, ammoIds: item.ammoIds, compatibleWeaponIds: item.compatibleWeaponIds }));
  return <ToolDetailPage tool={tool} items={items} query={query} />;
}
