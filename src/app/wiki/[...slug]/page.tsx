import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WikiListingPage, resolveListing } from "@/page/wiki/WikiListingPage";
import { getItem, listingGroups, weapons } from "@/lib/data/catalog";
import { WeaponDetailPage } from "@/page/wiki/WeaponDetailPage";
import { buildMetadata } from "@/seo/metadata";
import { weaponMetaDescription, weaponTitle } from "@/lib/wiki/weapon-detail";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return [
    ...Object.keys(listingGroups).map((section) => ({ slug: [section] })),
    ...weapons.map((weapon) => ({ slug: ["weapons", weapon.slug] })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = resolveListing(slug);
  if (listing) return buildMetadata({ title: listing.metaTitle, description: listing.description, path: `/wiki/${slug.join("/")}` });
  if (slug.length === 2 && slug[0] === "weapons") {
    const weapon = getItem(slug[1]);
    if (weapon?.kind === "weapon" && weapons.some((item) => item.slug === weapon.slug)) return buildMetadata({ title: weaponTitle(weapon), description: weaponMetaDescription(weapon), path: `/wiki/weapons/${weapon.slug}`, image: weapon.image || "/images/og-image.png" });
  }

  return {};
}

export default async function WikiRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  if (resolveListing(slug)) return <WikiListingPage segments={slug} searchParams={query} />;
  if (slug.length === 2 && slug[0] === "weapons") {
    const weapon = getItem(slug[1]);
    if (weapon?.kind === "weapon" && weapons.some((item) => item.slug === weapon.slug)) return <WeaponDetailPage weapon={weapon} />;
  }
  notFound();
}
