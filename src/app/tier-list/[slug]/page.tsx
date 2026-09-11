import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TierListPage, tierSections } from "@/page/tier-list/TierListPage";
import { buildMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export function generateStaticParams() { return tierSections.map((slug) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; if (!tierSections.includes(slug)) return {}; return buildMetadata({ ...tdk.tierDetails[slug as keyof typeof tdk.tierDetails], path: `/tier-list/${slug}` }); }
export default async function TierRoute({ params, searchParams }: Props) { const { slug } = await params; if (!tierSections.includes(slug)) notFound(); return <TierListPage section={slug} searchParams={await searchParams} />; }
