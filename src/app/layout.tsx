import type { Metadata, Viewport } from "next";
import "@fontsource/anton/400.css";
import "@fontsource/roboto-condensed/400.css";
import "@fontsource/roboto-condensed/500.css";
import "@fontsource/roboto-condensed/600.css";
import "@fontsource/roboto-condensed/700.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteConfig } from "@/config/site";
import JsonLd from "@/seo/JsonLd";
import { tdk } from "@/seo/tdk";
import "@/style/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: tdk.home.title, template: "%s" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "games",
  keywords: ["WARDOGS", "WARDOGS wiki", "WARDOGS database", "WARDOGS guides", "WARDOGS tools"],
  icons: { icon: "/images/logo.svg", shortcut: "/images/logo.svg", apple: "/images/logo.svg" },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#081115",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteConfig.url,
            description: siteConfig.description,
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteConfig.url}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            logo: `${siteConfig.url}/images/logo.svg`,
            email: siteConfig.contactEmail,
          }}
        />
      </body>
    </html>
  );
}
