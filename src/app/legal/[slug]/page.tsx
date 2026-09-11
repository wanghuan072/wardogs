import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, legalPages } from "@/page/legal/LegalPage";
import { buildMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return Object.keys(legalPages).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = legalPages[(await params).slug];
  if (!page) return {};
  return buildMetadata(tdk[page.tdkKey]);
}

export default async function LegalRoute({ params }: Props) {
  const slug = (await params).slug;
  if (!legalPages[slug]) notFound();
  return <LegalPage slug={slug} />;
}
