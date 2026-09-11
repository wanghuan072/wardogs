import Image from "next/image";
import { formatMoney, formatNumber } from "@/lib/formatting/format-values";
import type { CatalogItem } from "@/types/catalog";
import styles from "@/style/common/common.module.css";

function keyFacts(item: CatalogItem) {
  if (item.kind === "weapon") return [{ label: "Rate of fire", value: formatNumber(item.stats.rpm, " RPM") }, { label: "Effective range", value: formatNumber(item.stats.effectiveRange, " m") }, { label: "Magazine", value: formatNumber(item.stats.magazineSize, " rounds") }, { label: "Weight", value: formatNumber(item.weight, " kg") }];
  if (item.kind === "vehicle") return [{ label: "Top speed", value: formatNumber(item.stats.maxSpeed, " km/h") }, { label: "Seats", value: formatNumber(item.stats.seats) }, { label: "Range", value: formatNumber(item.stats.rangeKm, " km") }, { label: "Weight", value: formatNumber(item.weight, " kg") }];
  if (item.kind === "ammo") return [{ label: "Damage", value: formatNumber(item.stats.damage) }, { label: "Penetration", value: formatNumber(item.stats.penetration) }, { label: "Velocity", value: formatNumber(item.stats.muzzleVelocity, " m/s") }, { label: "Weight", value: formatNumber(item.weight, " kg") }];
  const [effectName, effect] = Object.entries(item.statEffects || {})[0] || [];
  return [{ label: "Slot", value: item.slot || "Unknown" }, { label: "Role", value: item.role || item.type || item.kind }, { label: effectName ? effectName.replaceAll("-", " ") : "Effect", value: effect ? `${effect.op || "value"} ${effect.v ?? "Unknown"}` : "Unknown" }, { label: "Weight", value: formatNumber(item.weight, " kg") }];
}

export function CatalogCard({ item, compact = false, view = "grid" }: { item: CatalogItem; compact?: boolean; view?: "grid" | "list" }) {
  const facts = keyFacts(item);
  if (view === "list") {
    return (
      <article className={styles.catalogListCard}>
        <div className={styles.catalogListImage}>
          <Image src={item.image || "/images/official/wardogs-09.jpg"} alt={`${item.name} WARDOGS item render`} fill sizes="210px" />
          <span>{item.dataStatus}</span>
        </div>
        <div className={styles.catalogListBody}>
          <span>{item.type || item.category || item.kind}{item.caliber ? ` · ${item.caliber}` : ""}</span>
          <div><h3>{item.name}</h3><strong>{formatMoney(item.price)}</strong></div>
        </div>
        <dl className={styles.catalogListFacts}>
          {facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
        </dl>
      </article>
    );
  }
  return (
    <article className={compact ? styles.catalogCardCompact : styles.catalogCard}>
      <div className={styles.catalogImage}>
        {item.image ? (
          <Image src={item.image} alt={`${item.name} WARDOGS item render`} fill sizes={compact ? "180px" : "(max-width: 700px) 50vw, 320px"} />
        ) : (
          <Image src="/images/official/wardogs-09.jpg" alt="" fill sizes="320px" />
        )}
        {!compact && <span className={styles.catalogStatus}>{item.dataStatus}</span>}
      </div>
      <div className={styles.catalogBody}>
        <div className={styles.catalogTitleRow}>
          <div>
            <h3>{item.name}</h3>
            <span>{item.type || item.category || item.kind}{item.caliber ? ` · ${item.caliber}` : ""}</span>
          </div>
          {compact ? <strong className={styles.compactPrice}>{formatMoney(item.price)}</strong> : <strong className={styles.cardPrice}>{formatMoney(item.price)}</strong>}
        </div>
        {!compact && (
          <div className={styles.miniStats}>
            {facts.map((fact) => <span key={fact.label}><small>{fact.label}</small><b>{fact.value}</b></span>)}
          </div>
        )}
      </div>
    </article>
  );
}
