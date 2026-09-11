import { Database, Radio, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import styles from "@/style/common/common.module.css";

export function DataStatus({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={compact ? styles.dataStatusCompact : styles.dataStatus} aria-label="Current game information">
      <span><Radio aria-hidden="true" /> Game state<strong>Early Access</strong></span>
      <span><Database aria-hidden="true" /> Item info<strong>Pre-launch data snapshot</strong></span>
      <span><ShieldCheck aria-hidden="true" /> Snapshot date<strong>{siteConfig.dataUpdated}</strong></span>
      {!compact && <p>These records are not yet verified against the public Early Access build. Unknown values stay blank rather than being guessed.</p>}
    </aside>
  );
}
