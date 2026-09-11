import Link from "next/link";
import Image from "next/image";
import { Disc3, MessageCircle, Youtube } from "lucide-react";
import { primaryNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import styles from "@/style/layout/site-layout.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerImage} />
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerBrand}>
          <div><Image src="/images/logo.svg" width={28} height={28} alt="" /><strong>WARDOGS</strong></div>
          <p>Independent player tools for the next WARDOGS deployment.</p>
          <nav className={styles.footerMainLinks} aria-label="Footer navigation">
            {primaryNavigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>
        </div>
        <div className={styles.footerMeta}>
          <nav className={styles.socialLinks} aria-label="WARDOGS community links">
            <a href={siteConfig.steamUrl} target="_blank" rel="noreferrer" aria-label="WARDOGS on Steam"><Disc3 /></a>
            <span aria-hidden="true">𝕏</span><span aria-hidden="true"><Youtube /></span><span aria-hidden="true"><MessageCircle /></span>
          </nav>
          <p>Copyright © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.<br />WARDOGS Field Intel is an independent fan site and is not affiliated with, endorsed by, or connected to the official WARDOGS game or its rights holders.</p>
          <nav className={styles.footerLinks} aria-label="Legal information">
            <span>Legal</span>
            <a href="/legal/privacy-policy" rel="noopener noreferrer nofollow">Privacy Policy</a>
            <a href="/legal/terms-of-service" rel="noopener noreferrer nofollow">Terms of Service</a>
            <a href="/legal/copyright" rel="noopener noreferrer nofollow">Copyright</a>
            <a href="/legal/about-us" rel="noopener noreferrer nofollow">About Us</a>
            <a href="/legal/contact-us" rel="noopener noreferrer nofollow">Contact Us</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
