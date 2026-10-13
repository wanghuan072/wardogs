import Image from "next/image";
import { ChevronDown, Menu, Search } from "lucide-react";
import { headerDropdowns, primaryNavigation, wikiNavigation } from "@/config/navigation";
import { catalogCounts } from "@/lib/data/catalog";
import styles from "@/style/layout/site-layout.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <a href="/" className={styles.brand} aria-label="WARDOGS Field Intel home">
          <span className={styles.brandMark}><Image src="/images/logo.png" width={34} height={34} alt="" priority /></span>
          <span className={styles.brandCopy}><span className={styles.wordmark}>WARDOGS</span></span>
        </a>
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <a className={styles.navTrigger} href="/">Home</a>
          <div className={styles.megaRoot}>
            <a className={styles.navTrigger} href="/wiki">Wiki <ChevronDown aria-hidden="true" size={12} /></a>
            <div className={styles.megaMenu}>
              <div className={styles.megaIntro}>
                <span>Game items / {catalogCounts.total} listed</span>
                <strong>Gear, guides and tools for your next match.</strong>
                <p>Every relationship leads to the next useful decision.</p>
                <a href="/wiki">Open full wiki <span aria-hidden="true">→</span></a>
              </div>
              {wikiNavigation.map((group) => (
                <div key={group.label} className={styles.megaColumn}>
                  <span>{group.label}</span>
                  {group.links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
                </div>
              ))}
            </div>
          </div>
          {primaryNavigation.slice(2).map((item) => {
            const dropdown = headerDropdowns[item.label];
            return dropdown?.length ? (
              <div className={styles.navGroup} key={item.href}>
                <a className={styles.navTrigger} href={item.href}>{item.label}<ChevronDown aria-hidden="true" size={11} /></a>
                <div className={styles.navMenu}>{dropdown.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</div>
              </div>
            ) : <a className={styles.navTrigger} href={item.href} key={item.href}>{item.label}</a>;
          })}
        </nav>
        <div className={styles.headerActions}>
          <a href="/search" className={styles.searchButton} aria-label="Search WARDOGS Field Intel"><Search aria-hidden="true" /><span>Search</span><i aria-hidden="true">↗</i></a>
        </div>
        <details className={styles.mobileNav}>
          <summary><Menu aria-hidden="true" /><span>Menu</span></summary>
          <nav aria-label="Mobile navigation">
            {primaryNavigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
            <a href="/search">Search</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
