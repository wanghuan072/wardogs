import Link from "next/link";
import { Database } from "lucide-react";
import { siteConfig } from "@/config/site";
import styles from "@/style/layout/site-layout.module.css";

export function DataNotice() {
  return (
    <aside className={styles.dataNotice} aria-label="Data quality notice">
      <div className={`container ${styles.dataNoticeInner}`}>
        <Database aria-hidden="true" />
        <p><strong>{siteConfig.dataVersion}:</strong> item values and compatibility are not yet verified against the current Early Access build.</p>
        <Link href="/about">Data policy</Link>
      </div>
    </aside>
  );
}
