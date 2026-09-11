import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolDefinitions } from "@/config/tools";
import { catalogDisplayItems } from "@/lib/data/catalog";
import type { ToolItem } from "@/lib/tools/calculations";
import { ToolDetailPage } from "@/page/tools/ToolDetailPage";
import { buildMetadata } from "@/seo/metadata";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export function generateStaticParams() { return toolDefinitions.map((tool) => ({ slug: tool.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const tool = toolDefinitions.find((entry) => entry.slug === slug); if (!tool) return {}; return buildMetadata({ ...tool.seo, path: `/tools/${slug}` }); }
export default async function ToolRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const tool = toolDefinitions.find((entry) => entry.slug === slug); if (!tool) notFound(); const query = await searchParams;
  const items: ToolItem[] = catalogDisplayItems.map((item) => ({ slug: item.slug, name: item.name, kind: item.kind, type: item.type, role: item.role, slot: item.slot, caliber: item.caliber, price: item.price, weight: item.weight, image: item.image, rpm: item.stats.rpm, damage: item.stats.damage, range: item.stats.effectiveRange, velocity: item.stats.muzzleVelocity, recoil: item.stats.recoil, ammoIds: item.ammoIds, compatibleWeaponIds: item.compatibleWeaponIds }));
  return <ToolDetailPage tool={tool} items={items} query={query} />;
}
