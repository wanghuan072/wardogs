import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Backpack, Boxes, Crosshair, SlidersHorizontal, Wrench } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import JsonLd from "@/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { attachmentGroupsForWeapon, getWeaponRelations, weapons } from "@/lib/data/catalog";
import { formatCatalogLabel, formatMoney } from "@/lib/formatting/format-values";
import { weaponBriefing, weaponReadout } from "@/lib/wiki/weapon-detail";
import type { CatalogItem } from "@/types/catalog";
import styles from "@/style/page/wiki/weapon-detail.module.css";

type RecordLinkProps = { item: CatalogItem; href: string };

function RecordLink({ item, href }: RecordLinkProps) {
  return <Link href={href} className={styles.recordLink}>
    {item.image && <span><Image src={item.image} alt="" fill sizes="64px" /></span>}
    <b>{item.name}</b>
    <small>{item.type || item.ammoType || item.kind}{item.price !== null ? ` · ${formatMoney(item.price)}` : ""}</small>
    <ArrowRight aria-hidden="true" />
  </Link>;
}

function weaponListingSearch(item: CatalogItem) {
  return `/wiki/${item.kind === "ammo" ? "ammunition" : "attachments"}?q=${encodeURIComponent(item.name)}`;
}

export function WeaponDetailPage({ weapon }: { weapon: CatalogItem }) {
  const relations = getWeaponRelations(weapon);
  const attachmentGroups = attachmentGroupsForWeapon(weapon);
  const peers = weapons.filter((item) => item.slug !== weapon.slug && item.type === weapon.type)
    .sort((a, b) => Math.abs((a.price ?? 99999) - (weapon.price ?? 99999)) - Math.abs((b.price ?? 99999) - (weapon.price ?? 99999)))
    .slice(0, 3);
  const allRelatedCount = relations.ammunition.length + relations.magazines.length + relations.attachments.length;

  return (
    <main id="main-content">
      <header className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <Breadcrumb items={[{ label: "Wiki", href: "/wiki" }, { label: "Weapons", href: "/wiki/weapons" }, { label: weapon.name }]} />
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span>WARDOGS weapon record</span>
              <h1>{weapon.name}</h1>
              <p>{weaponBriefing(weapon)}</p>
              <div className={styles.heroActions}>
                <Link href={`/builder?item=${weapon.slug}`}>Build with {weapon.name}<ArrowRight aria-hidden="true" /></Link>
                <Link href="/wiki/weapons">Back to weapon list</Link>
              </div>
            </div>
            <div className={styles.weaponRender}>
              {weapon.image ? <Image src={weapon.image} alt={`${weapon.name} weapon render`} fill sizes="(max-width: 768px) 100vw, 540px" preload /> : null}
            </div>
            <dl className={styles.heroReadout}>
              <div><dt>Class</dt><dd>{weapon.type || "not recorded"}</dd></div>
              <div><dt>Recorded price</dt><dd>{formatMoney(weapon.price)}</dd></div>
              <div><dt>Caliber</dt><dd>{weapon.caliber || "not recorded"}</dd></div>
              <div><dt>Compatible records</dt><dd>{allRelatedCount}</dd></div>
            </dl>
          </div>
        </div>
      </header>

      <div className={`container ${styles.pageGrid}`}>
        <article className={styles.article}>
          <section className={styles.section} aria-labelledby="weapon-readout">
            <div className={styles.sectionHeading}><span>What is recorded</span><h2 id="weapon-readout">{weapon.name} at a glance</h2><p>These are the fields captured for this weapon, not a simulated performance rating.</p></div>
            <dl className={styles.readout}>{weaponReadout(weapon).map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
          </section>

          <section className={styles.section} aria-labelledby="weapon-compatibility">
            <div className={styles.sectionHeading}><span>Loadout links</span><h2 id="weapon-compatibility">What the {weapon.name} can use</h2><p>Check ammunition, magazines and parts together before spending the rest of your cash on a kit.</p></div>
            <div className={styles.compatibilityGrid}>
              <div className={styles.compatibilityPanel}><div><Boxes aria-hidden="true" /><h3>Ammunition</h3><small>{relations.ammunition.length} recorded options</small></div>{relations.ammunition.length ? relations.ammunition.map((item) => <RecordLink item={item} href={weaponListingSearch(item)} key={item.slug} />) : <p>No compatible loose ammunition is recorded for this weapon.</p>}</div>
              <div className={styles.compatibilityPanel}><div><Backpack aria-hidden="true" /><h3>Magazines</h3><small>{relations.magazines.length} recorded options</small></div>{relations.magazines.length ? relations.magazines.map((item) => <RecordLink item={item} href={weaponListingSearch(item)} key={item.slug} />) : <p>No compatible magazine is recorded for this weapon.</p>}</div>
            </div>
            <div className={styles.attachmentBlock}><div className={styles.attachmentHeading}><Wrench aria-hidden="true" /><div><h3>Attachments</h3><p>{relations.attachments.length} parts are available to browse by slot. Open the Builder to assemble them into a kit.</p></div><Link href={`/builder?item=${weapon.slug}`}>Open in Builder <ArrowRight aria-hidden="true" /></Link></div>{attachmentGroups.length ? <div className={styles.attachmentGroups}>{attachmentGroups.map(([label, items]) => <details key={label}><summary>{formatCatalogLabel(label)} <span>{items.length}</span></summary><div>{items.map((item) => <RecordLink item={item} href={weaponListingSearch(item)} key={item.slug} />)}</div></details>)}</div> : <p className={styles.emptyCopy}>No compatible attachments are available for this weapon.</p>}</div>
          </section>
        </article>

        <aside className={styles.sidebar}>
          <section className={styles.sidebarPanel}><SlidersHorizontal aria-hidden="true" /><span>Use it in a kit</span><p>Open the Builder with this weapon selected, then choose ammunition, magazines and parts for the job you are taking.</p><Link href={`/builder?item=${weapon.slug}`}>Start {weapon.name} build <ArrowRight aria-hidden="true" /></Link></section>
          {peers.length ? <section className={styles.sidebarPanel}><Crosshair aria-hidden="true" /><span>Same class</span>{peers.map((item) => <Link href={`/wiki/weapons/${item.slug}`} key={item.slug}><b>{item.name}</b><small>{formatMoney(item.price)} · {item.caliber || "caliber not recorded"}</small><ArrowRight aria-hidden="true" /></Link>)}</section> : null}
        </aside>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: `${weapon.name} WARDOGS weapon record`, description: weaponBriefing(weapon), dateModified: weapon.lastChecked, author: { "@type": "Organization", name: siteConfig.name }, mainEntityOfPage: `${siteConfig.url}/wiki/weapons/${weapon.slug}` }} />
    </main>
  );
}
