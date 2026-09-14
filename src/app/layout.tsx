import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { DataNotice } from "@/components/layout/DataNotice";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteConfig } from "@/config/site";
import JsonLd from "@/seo/JsonLd";
import { tdk } from "@/seo/tdk";
import "@/style/globals.css";

const anton = localFont({
  src: "../../node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2",
  display: "swap",
  variable: "--font-anton",
  weight: "400",
});

const robotoCondensed = localFont({
  src: [
    { path: "../../node_modules/@fontsource/roboto-condensed/files/roboto-condensed-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/roboto-condensed/files/roboto-condensed-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/roboto-condensed/files/roboto-condensed-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/roboto-condensed/files/roboto-condensed-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-roboto-condensed",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: tdk.home.title, template: "%s" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "games",
  keywords: ["WARDOGS", "WARDOGS wiki", "WARDOGS database", "WARDOGS guides", "WARDOGS tools"],
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon", sizes: "any" }],
    shortcut: "/favicon.ico",
    apple: [{ url: "/images/ico.png", type: "image/png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#081115",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anton.variable} ${robotoCondensed.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <DataNotice />
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
            logo: `${siteConfig.url}/images/logo.png`,
            email: siteConfig.contactEmail,
          }}
        />
      </body>
    </html>
  );
}
