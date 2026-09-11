import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideDetailPage } from "@/page/guides/GuideDetailPage";
import { guideBySlug, guides } from "@/lib/data/editorial";
import { buildMetadata } from "@/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug.get(slug);
  if (guide) return buildMetadata({ ...guide.seo, path: `/guides/${slug}` });
  return {};
}

export default async function GuideRoute({ params }: Props) {
  const { slug } = await params;
  const guide = guideBySlug.get(slug);
  if (guide) return <GuideDetailPage guide={guide} />;
  notFound();
}
