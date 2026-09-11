import { ArrowRight, Search } from "lucide-react";
import styles from "@/style/common/common.module.css";

export function GlobalSearch({ defaultValue = "", compact = false, showButton = true }: { defaultValue?: string; compact?: boolean; showButton?: boolean }) {
  return (
    <form className={compact ? styles.searchCompact : styles.search} action="/search" role="search">
      <Search aria-hidden="true" size={21} />
      <label className="sr-only" htmlFor={compact ? "global-search-compact" : "global-search"}>Search WARDOGS database</label>
      <input id={compact ? "global-search-compact" : "global-search"} name="q" defaultValue={defaultValue} placeholder="Search weapons, ammo, vehicles, guides..." aria-keyshortcuts="Control+K" />
      {showButton && <button type="submit"><span>Search</span><ArrowRight aria-hidden="true" /></button>}
    </form>
  );
}
