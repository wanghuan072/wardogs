import { notFound, permanentRedirect } from "next/navigation";
import { legacyLegalPaths } from "@/page/legal/LegalPage";

type Props = { params: Promise<{ page: string }> };

export function generateStaticParams() { return Object.keys(legacyLegalPaths).map((page) => ({ page })); }

export default async function LegacyInformationRoute({ params }: Props) {
  const destination = legacyLegalPaths[(await params).page];
  if (!destination) notFound();
  permanentRedirect(destination);
}
