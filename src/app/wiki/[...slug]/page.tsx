import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WikiListingPage, resolveListing } from "@/page/wiki/WikiListingPage";
import { listingGroups } from "@/lib/data/catalog";
import { buildMetadata } from "@/seo/metadata";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return Object.keys(listingGroups).map((section) => ({ slug: [section] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = resolveListing(slug);
  if (listing) return buildMetadata({ title: listing.metaTitle, description: listing.description, path: `/wiki/${slug.join("/")}` });

  return {};
}

export default async function WikiRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  if (resolveListing(slug)) return <WikiListingPage segments={slug} searchParams={query} />;
  notFound();
}
