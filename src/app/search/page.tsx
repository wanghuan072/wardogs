import type { Metadata } from "next";
import { SearchPage } from "@/page/search/SearchPage";
import { buildMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
export const metadata: Metadata = buildMetadata({ ...tdk.search, noIndex: true });
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const value = (await searchParams).q;
  return <SearchPage query={Array.isArray(value) ? value[0] || "" : value || ""} />;
}
