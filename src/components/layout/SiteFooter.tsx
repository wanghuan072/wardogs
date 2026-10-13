import Image from "next/image";
import { Disc3, MessageCircle, Youtube } from "lucide-react";
import { primaryNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { AdSlot } from "@/components/ads/AdSlot";
import styles from "@/style/layout/site-layout.module.css";

export function SiteFooter() {
  return (
    <>
      {/* 全站底部广告：和正文结尾保持间隔，不与其他广告连续出现。 */}
      <AdSlot placement="site-footer" />
      <footer className={styles.footer}>
      <Image className={styles.footerImage} src="/images/official/wardogs-06.jpg" alt="" fill sizes="100vw" quality={45} />
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerBrand}>
          <div><Image src="/images/logo.png" width={36} height={36} alt="" /><strong>WARDOGS</strong></div>
          <p>Independent player tools for the next WARDOGS deployment.</p>
          <nav className={styles.footerMainLinks} aria-label="Footer navigation">
            {primaryNavigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>
        </div>
        <div className={styles.footerMeta}>
          <nav className={styles.socialLinks} aria-label="WARDOGS community links">
            <a href={siteConfig.steamUrl} target="_blank" rel="noreferrer" aria-label="WARDOGS on Steam"><Disc3 /></a>
            <span aria-hidden="true">𝕏</span><span aria-hidden="true"><Youtube /></span><span aria-hidden="true"><MessageCircle /></span>
          </nav>
          <p>Copyright © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.<br />WARDOGS Field Intel is an independent fan site and is not affiliated with, endorsed by, or connected to the WARDOGS game or its rights holders.</p>
          <nav className={styles.footerLinks} aria-label="Legal information">
            <span>Legal</span>
            <a href="/privacy" rel="nofollow">Privacy Policy</a>
            <a href="/terms" rel="nofollow">Terms of Service</a>
            <a href="/copyright" rel="nofollow">Copyright</a>
            <a href="/about" rel="nofollow">About Us</a>
            <a href="/contact" rel="nofollow">Contact Us</a>
          </nav>
        </div>
      </div>
      </footer>
    </>
  );
}
