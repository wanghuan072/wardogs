import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isListingCategory, WikiListingPage, resolveListing } from "@/page/wiki/WikiListingPage";
import { catalogItems, itemHref, listingGroups } from "@/lib/data/catalog";
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
  const item = catalogItems.find((entry) => itemHref(entry).split("/").filter(Boolean).slice(1).join("/") === slug.join("/"));
  if (item) redirect(itemHref(item).split("/").slice(0, 3).join("/"));
  if (slug.length === 2 && isListingCategory(slug[0], slug[1])) redirect(`/wiki/${slug[0]}?category=${encodeURIComponent(slug[1])}`);
  if (resolveListing(slug)) return <WikiListingPage segments={slug} searchParams={query} />;
  notFound();
}
