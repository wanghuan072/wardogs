import { Database, Radio, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import styles from "@/style/common/common.module.css";

export function DataStatus({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={compact ? styles.dataStatusCompact : styles.dataStatus} aria-label="Current game information">
      <span><Radio aria-hidden="true" /> Game state<strong>Early Access</strong></span>
      <span><Database aria-hidden="true" /> Item info<strong>Early Access review in progress</strong></span>
      <span><ShieldCheck aria-hidden="true" /> Snapshot date<strong>{siteConfig.dataUpdated}</strong></span>
      {!compact && <p>Records are being checked against the live Early Access build. Unknown values stay blank until they can be verified.</p>}
    </aside>
  );
}
