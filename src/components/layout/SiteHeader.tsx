import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, Search } from "lucide-react";
import { headerDropdowns, primaryNavigation, wikiNavigation } from "@/config/navigation";
import { catalogCounts } from "@/lib/data/catalog";
import styles from "@/style/layout/site-layout.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <Link href="/" className={styles.brand} aria-label="WARDOGS Field Intel home">
          <span className={styles.brandMark}><Image src="/images/logo.svg" width={28} height={28} alt="" priority /></span>
          <span className={styles.brandCopy}><span className={styles.wordmark}>WARDOGS</span><span className={styles.brandSuffix}>Player guide</span></span>
        </Link>
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <Link className={styles.navTrigger} href="/">Home</Link>
          <div className={styles.megaRoot}>
            <Link className={styles.navTrigger} href="/wiki">Wiki <ChevronDown aria-hidden="true" size={12} /></Link>
            <div className={styles.megaMenu}>
              <div className={styles.megaIntro}>
                <span>Game items / {catalogCounts.total} listed</span>
                <strong>Gear, guides and tools for your next match.</strong>
                <p>Every relationship leads to the next useful decision.</p>
                <Link href="/wiki">Open full wiki <span aria-hidden="true">→</span></Link>
              </div>
              {wikiNavigation.map((group) => (
                <div key={group.label} className={styles.megaColumn}>
                  <span>{group.label}</span>
                  {group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
                </div>
              ))}
            </div>
          </div>
          {primaryNavigation.slice(2).map((item) => {
            const dropdown = headerDropdowns[item.label];
            return dropdown?.length ? (
              <div className={styles.navGroup} key={item.href}>
                <Link className={styles.navTrigger} href={item.href}>{item.label}<ChevronDown aria-hidden="true" size={11} /></Link>
                <div className={styles.navMenu}>{dropdown.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div>
              </div>
            ) : <Link className={styles.navTrigger} href={item.href} key={item.href}>{item.label}</Link>;
          })}
        </nav>
        <div className={styles.headerActions}>
          <Link href="/search" className={styles.searchButton} aria-label="Search WARDOGS Field Intel"><Search aria-hidden="true" /><span>Search</span><i aria-hidden="true">↗</i></Link>
        </div>
        <details className={styles.mobileNav}>
          <summary><Menu aria-hidden="true" /><span>Menu</span></summary>
          <nav aria-label="Mobile navigation">
            {primaryNavigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <Link href="/search">Search</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
