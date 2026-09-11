import type { Metadata } from "next";
import { UpdatesPage } from "@/page/updates/UpdatesPage";
import { buildMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
export const metadata: Metadata = buildMetadata(tdk.updates);
export default function Page() { return <UpdatesPage />; }
