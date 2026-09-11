import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function buildMetadata({
  title,
  description,
  path,
  noIndex = false,
  image = "/images/og-image.png",
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  image?: string;
}): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
      images: [{ url: image, width: 1731, height: 909, alt: `${siteConfig.shortName} Field Intel` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
