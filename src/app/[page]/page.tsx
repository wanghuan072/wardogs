import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, legalPages } from "@/page/legal/LegalPage";
import { buildMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";

type Props = { params: Promise<{ page: string }> };

export function generateStaticParams() {
  return Object.keys(legalPages).map((page) => ({ page }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = legalPages[(await params).page];
  return page ? buildMetadata(tdk[page.tdkKey]) : {};
}

export default async function InformationPageRoute({ params }: Props) {
  const page = (await params).page;
  if (!legalPages[page]) notFound();
  return <LegalPage slug={page} />;
}
