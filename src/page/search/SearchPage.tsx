import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { PageHero } from "@/components/common/PageHero";
import { searchContent } from "@/lib/search/search-content";
import styles from "@/style/page/search/search.module.css";

export function SearchPage({ query }: { query: string }) {
  const results = searchContent(query); const groups = [...new Set(results.map((result) => result.group))];
  return <main id="main-content"><PageHero eyebrow="Weapons, gear, guides and tools" title="Search WARDOGS items and guides" description="Search for a weapon, caliber, vehicle, item or guide topic, then open the matching list or guide." image="/images/official/wardogs-07.jpg" crumbs={[{ label: "Search" }]}><GlobalSearch defaultValue={query} /></PageHero><section className={`container ${styles.results}`}><div className={styles.resultSummary}><Search /><div><span>{query ? `Search / ${query}` : "Start searching"}</span><h2>{query ? `${results.length} results` : "What are you looking for?"}</h2></div></div>{query && !results.length && <div className={styles.empty}><h2>Nothing matched that search</h2><p>Try a weapon name, caliber, vehicle, item type or guide topic.</p><Link href="/wiki">Browse game items <ArrowRight /></Link></div>}{groups.map((group) => <section key={group}><div className={styles.groupTitle}><span>{group}</span><strong>{results.filter((result) => result.group === group).length}</strong></div><div className={styles.resultGrid}>{results.filter((result) => result.group === group).slice(0,12).map((result) => <Link href={result.href} key={result.href}><div>{result.image ? <Image src={result.image} alt="" fill sizes="110px" /> : <Search />}</div><span>{result.group}</span><h3>{result.title}</h3><p>{result.description}</p><ArrowRight /></Link>)}</div></section>)}</section></main>;
}
