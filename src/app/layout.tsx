import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
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
        {children}
        <SiteFooter />
        {/* Google Analytics：全站只加载一次，避免重复统计。 */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-BDJC0P6XXW" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BDJC0P6XXW');
        `}</Script>
        {/* 联盟 Popunder：延迟至浏览器空闲，避免影响首屏内容。 */}
        <Script id="affiliate-popunder" src="https://pl31790058.profitableratecpmnetwork.com/b3/9e/3e/b39e3e0171f747fd46e7826163472742.js" strategy="lazyOnload" />
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
