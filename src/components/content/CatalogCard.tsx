import Image from "next/image";
import Link from "next/link";
import { formatCaliber, formatCatalogLabel, formatMoney, formatNumber, formatStatEffect } from "@/lib/formatting/format-values";
import type { CatalogItem } from "@/types/catalog";
import styles from "@/style/common/common.module.css";

function keyFacts(item: CatalogItem) {
  const known = (facts: { label: string; value: number | null | undefined; suffix?: string }[]) => facts.filter((fact) => typeof fact.value === "number").map((fact) => ({ label: fact.label, value: formatNumber(fact.value, fact.suffix) }));
  if (item.kind === "weapon") return known([{ label: "Rate of fire", value: item.stats.rpm, suffix: " RPM" }, { label: "Effective range", value: item.stats.effectiveRange, suffix: " m" }, { label: "Magazine", value: item.stats.magazineSize, suffix: " rounds" }, { label: "Weight", value: item.weight, suffix: " kg" }]);
  if (item.kind === "vehicle") return known([{ label: "Top speed", value: item.stats.maxSpeed, suffix: " km/h" }, { label: "Seats", value: item.stats.seats }, { label: "Range", value: item.stats.rangeKm, suffix: " km" }, { label: "Weight", value: item.weight, suffix: " kg" }]);
  if (item.kind === "ammo") return known([{ label: "Damage", value: item.stats.damage }, { label: "Penetration", value: item.stats.penetration }, { label: "Velocity", value: item.stats.muzzleVelocity, suffix: " m/s" }, { label: "Weight", value: item.weight, suffix: " kg" }]);
  const [effectName, effect] = Object.entries(item.statEffects || {})[0] || [];
  const facts = item.slot ? [{ label: "Slot", value: formatCatalogLabel(item.slot) }] : [];
  if (effectName && effect) facts.push(formatStatEffect(effectName, effect));
  if (typeof item.weight === "number") facts.push({ label: "Weight", value: formatNumber(item.weight, " kg") });
  return facts;
}

export function CatalogCard({ item, compact = false, view = "grid", href }: { item: CatalogItem; compact?: boolean; view?: "grid" | "list"; href?: string }) {
  const facts = keyFacts(item);
  const price = item.price === null ? "Price not listed" : formatMoney(item.price);
  const itemType = formatCatalogLabel(item.type || item.category || item.kind, item.kind);
  if (view === "list") {
    const card = (
      <article className={styles.catalogListCard}>
        <div className={styles.catalogListImage}>
          <Image src={item.image || "/images/official/wardogs-09.jpg"} alt={`${item.name} WARDOGS item render`} fill sizes="210px" />
        </div>
        <div className={styles.catalogListBody}>
          <span>{itemType}{item.caliber ? ` · ${formatCaliber(item.caliber)}` : ""}</span>
          <div><h3>{item.name}</h3><strong>{price}</strong></div>
        </div>
        {facts.length > 0 && <dl className={styles.catalogListFacts}>
          {facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
        </dl>}
      </article>
    );
    return href ? <Link className={styles.catalogCardLink} href={href} aria-label={`Open ${item.name}`}>{card}</Link> : card;
  }
  const card = (
    <article className={compact ? styles.catalogCardCompact : styles.catalogCard}>
      <div className={styles.catalogImage}>
        {item.image ? (
          <Image src={item.image} alt={`${item.name} WARDOGS item render`} fill sizes={compact ? "180px" : "(max-width: 700px) 50vw, 320px"} />
        ) : (
          <Image src="/images/official/wardogs-09.jpg" alt="" fill sizes="320px" />
        )}
      </div>
      <div className={styles.catalogBody}>
        <div className={styles.catalogTitleRow}>
          <div>
            <h3>{item.name}</h3>
            <span>{itemType}{item.caliber ? ` · ${formatCaliber(item.caliber)}` : ""}</span>
          </div>
          {compact ? <strong className={styles.compactPrice}>{price}</strong> : <strong className={styles.cardPrice}>{price}</strong>}
        </div>
        {!compact && facts.length > 0 && (
          <div
            className={`${styles.miniStats} ${
              facts.length === 1
                ? styles.miniStatsOne
                : facts.length === 2
                  ? styles.miniStatsTwo
                  : facts.length === 3
                    ? styles.miniStatsThree
                    : ""
            }`}
          >
            {facts.map((fact) => <span key={fact.label}><small>{fact.label}</small><b>{fact.value}</b></span>)}
          </div>
        )}
      </div>
    </article>
  );
  return href ? <Link className={styles.catalogCardLink} href={href} aria-label={`Open ${item.name}`}>{card}</Link> : card;
}
