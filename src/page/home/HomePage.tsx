import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Backpack, CircleDollarSign, Crosshair, GitCompareArrows, Plane, Shield, Sparkles, Wrench } from "lucide-react";
import { CatalogCard } from "@/components/content/CatalogCard";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { SectionHeading } from "@/components/common/SectionHeading";
import { catalogCounts, equipment, getItemsBySlugs } from "@/lib/data/catalog";
import { guides, updates } from "@/lib/data/editorial";
import { dateLabel } from "@/lib/formatting/format-values";
import { buildMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
import JsonLd from "@/seo/JsonLd";
import styles from "@/style/page/home/home.module.css";

export const metadata: Metadata = buildMetadata(tdk.home);

const explore = [
  { title: "Weapons", href: "/wiki/weapons", image: "/images/items/m4.png", text: "Prices, calibers and weapon roles", count: catalogCounts.weapon, icon: Crosshair },
  { title: "Ammunition", href: "/wiki/ammunition", image: "/images/items/5-56x45mm.png", text: "Rounds and magazines that fit your weapon", count: catalogCounts.ammo, icon: Sparkles },
  { title: "Attachments", href: "/wiki/attachments", image: "/images/items/10x-thermal-scope.png", text: "Optics, grips, muzzles and more", count: catalogCounts.attachment, icon: Wrench },
  { title: "Equipment", href: "/wiki/equipment", image: "/images/items/assault-backpack.png", text: "Armor, storage and field supplies", count: equipment.length, icon: Backpack },
  { title: "Vehicles", href: "/wiki/vehicles", image: "/images/items/ah-6m-miniguns.png", text: "Ground and rotary-wing assets", count: catalogCounts.vehicle, icon: Plane },
];

const operations = [
  { title: "Weapon Compare", href: "/tools/weapon-compare", text: "Put weapon details side by side before spending cash.", icon: GitCompareArrows, image: "/images/official/wardogs-12.jpg" },
  { title: "Budget Planner", href: "/tools/budget-planner", text: "Price a deployment before you leave the safe zone.", icon: CircleDollarSign, image: "/images/official/wardogs-11.jpg" },
];

const popularItems = getItemsBySlugs(["m4", "ak74", "mp5", "svd"]);
const databaseStats = [
  { icon: Crosshair, value: catalogCounts.weapon, label: "Weapons" },
  { icon: Sparkles, value: catalogCounts.ammo, label: "Ammunition" },
  { icon: Wrench, value: catalogCounts.attachment, label: "Attachments" },
  { icon: Shield, value: equipment.length, label: "Equipment" },
  { icon: Plane, value: catalogCounts.vehicle, label: "Vehicles" },
];

const homeFaq = [
  { question: "What is WARDOGS?", answer: "WARDOGS is a large-scale tactical FPS where three teams fight for Control Zones. You can buy gear, use vehicles, build defenses and choose how you help your team win." },
  { question: "How does cash work in WARDOGS?", answer: "Every player starts with $10,000 and buys a kit for each life. Cash carries between matches, so the cost of a weapon, vehicle or field kit matters beyond one round." },
  { question: "What can I do on this site?", answer: "Use the item lists to check gear, build a compatible kit, compare weapons, plan a budget and read guides for your first matches, the cash system, helicopters and Control Zones." },
  { question: "Will item values change during Early Access?", answer: "Yes. Prices, compatibility and other item details can change with game updates. Check the latest in-game build before making an expensive choice." },
];

export default function HomePage() {
  const latestUpdate = updates[0];
  const featuredGuide = guides[0];

  return (
    <main id="main-content">
      <section className={styles.hero}>
        <Image src="/images/home/wardogs-command-overlook.png" alt="WARDOGS soldiers overlooking a mountain battlefield" fill sizes="100vw" preload className={styles.heroImage} />
        <div className={styles.heroShade} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Independent WARDOGS game guide</span>
            <h1><span>WARDOGS Game</span>{" "}Plan your next<br />deployment.</h1>
            <p>Find the gear you want, build a kit that fits, and get ready for your next WARDOGS match with practical guides and current update notes.</p>
            <GlobalSearch />
            <div className={styles.heroActions}><Link href="/wiki">Browse the database <ArrowRight aria-hidden="true" /></Link><Link href="/builder">Open builder</Link></div>
          </div>
          <aside className={styles.releaseDossier}>
            <span>Latest update</span>
            <strong>{latestUpdate.version}</strong>
            <time dateTime={latestUpdate.date}>{dateLabel(latestUpdate.date)}</time>
            <b>{latestUpdate.title}</b>
            <Link href="/updates">Read release log <ArrowRight aria-hidden="true" /></Link>
          </aside>
        </div>
      </section>

      <section className={styles.statBand} aria-label="Database snapshot"><div className="container">
        {databaseStats.map(({ icon: Icon, value, label }) => <div key={label} className={styles.statItem}><Icon aria-hidden="true" /><strong>{value}</strong><span>{label}</span></div>)}
      </div></section>

      <section className={`container ${styles.catalogueSection}`}>
        <SectionHeading eyebrow="Game items" title="Browse game items" description="Weapons, ammo, gear and vehicles in one place. Check the important details directly from each list." href="/wiki" />
        <div className={styles.exploreGrid}>
          {explore.map((item) => <Link key={item.href} href={item.href} className={styles.exploreCard}>
            <div className={styles.exploreMedia}><Image src={item.image} alt="" fill sizes="(max-width: 700px) 50vw, 220px" /><item.icon aria-hidden="true" /></div>
            <div><span>{item.count} items</span><h3>{item.title}</h3><p>{item.text}</p></div><ArrowRight aria-hidden="true" />
          </Link>)}
        </div>
      </section>

      <section className={`container ${styles.commandDeck}`}>
        <Link href="/builder" className={styles.builderPanel}>
          <Image src="/images/official/wardogs-03.jpg" alt="WARDOGS operator preparing equipment" fill sizes="(max-width: 800px) 100vw, 620px" />
          <span className={styles.builderShade} />
          <div><span>Field kit / live compatibility</span><h2>Build your kit</h2><p>Select a weapon, then see only the linked ammunition and attachments. Price and carried weight update as you assemble the kit.</p><b>Enter equipment builder <ArrowRight aria-hidden="true" /></b></div>
        </Link>
        <div className={styles.commandBrief}>
          <span>Start here</span>
          <h2>How to use the site</h2>
          <ol><li><b>01</b><div><strong>Check the item lists</strong><p>Use categories to see prices, types and key stats.</p></div></li><li><b>02</b><div><strong>Build a kit</strong><p>Only compatible gear stays available in the builder.</p></div></li><li><b>03</b><div><strong>Compare your options</strong><p>Use tools when price or weapon choice is the question.</p></div></li></ol>
        </div>
      </section>

      <section className={`container ${styles.operationsSection}`}>
        <SectionHeading eyebrow="Decision support" title="Useful tools" description="Compare weapons, check your budget, or jump straight into a guide." href="/tools" />
        <div className={styles.operationsGrid}>
          {operations.map((operation) => <Link key={operation.href} href={operation.href} className={styles.operationCard}>
            <Image src={operation.image} alt="" fill sizes="(max-width: 700px) 100vw, 400px" /><span /><operation.icon aria-hidden="true" /><div><h3>{operation.title}</h3><p>{operation.text}</p></div><ArrowRight aria-hidden="true" />
          </Link>)}
          <Link href={`/guides/${featuredGuide.slug}`} className={styles.guideFeature}>
            <Image src={featuredGuide.image} alt="" fill sizes="(max-width: 700px) 100vw, 460px" /><span /><div><small>Field guide / {dateLabel(featuredGuide.updatedAt)}</small><h3>{featuredGuide.title}</h3><p>{featuredGuide.description}</p><b>Read guide <ArrowRight aria-hidden="true" /></b></div>
          </Link>
        </div>
      </section>

      <section className={`container ${styles.aboutFaq}`}>
        <div className={styles.aboutCopy}>
          <span>About this site</span>
          <h2>Built for the questions players ask between matches.</h2>
          <p>WARDOGS Field Intel is an independent WARDOGS game companion with item lists, a kit builder, practical tools and a small set of long-form guides. It is built to help you spend less time hunting through menus and more time deciding what to take into the next round.</p>
          <p>The game is in Early Access, so some prices, compatibility details and balance values can change. We update pages as the game changes and leave uncertain values blank rather than filling them in with a guess.</p>
          <Link href="/about">How the site stays up to date <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className={styles.faqPanel}>
          <span>Quick answers</span>
          <h2>Before you jump in</h2>
          {homeFaq.map((entry) => <details key={entry.question}><summary>{entry.question}</summary><p>{entry.answer}</p></details>)}
        </div>
      </section>

      <section className={`container ${styles.intelGrid}`}>
        <div>
          <SectionHeading eyebrow="Community interest" title="Popular weapons" description="A quick look at the weapons players search for most." href="/wiki/weapons" />
          <div className={styles.weaponGrid}>{popularItems.map((item) => <CatalogCard key={item.slug} item={item} compact />)}</div>
          <Link href="/updates" className={styles.updateLink}><span>Release log</span><strong>{latestUpdate.version}</strong><p>{latestUpdate.label} · {dateLabel(latestUpdate.date)}</p><ArrowRight aria-hidden="true" /></Link>
        </div>
        <aside className={styles.guideRail}>
          <SectionHeading eyebrow="Four field guides" title="Guides for new players" href="/guides" />
          <div className={styles.guideList}>{guides.map((guide) => <Link href={`/guides/${guide.slug}`} key={guide.slug}><Image src={guide.image} alt="" width={88} height={54} /><div><strong>{guide.title}</strong><span>{dateLabel(guide.updatedAt)} · WARDOGS guide</span></div><ArrowRight aria-hidden="true" /></Link>)}</div>
        </aside>
      </section>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: homeFaq.map((entry) => ({ "@type": "Question", name: entry.question, acceptedAnswer: { "@type": "Answer", text: entry.answer } })) }} />
    </main>
  );
}
