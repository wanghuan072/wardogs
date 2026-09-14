import { Database, Radio, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import styles from "@/style/common/common.module.css";

export function DataStatus({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={compact ? styles.dataStatusCompact : styles.dataStatus} aria-label="Data quality status">
      <span><Radio aria-hidden="true" /> Game state<strong>Early Access</strong></span>
      <span><Database aria-hidden="true" /> Data set<strong>Community beta snapshot</strong></span>
      <span><ShieldCheck aria-hidden="true" /> Verification<strong>In progress · {siteConfig.dataUpdated}</strong></span>
      {!compact && <p>Item records are not yet verified against the current Early Access build. Unknown values stay blank instead of becoming estimates.</p>}
    </aside>
  );
}
