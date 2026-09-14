import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { PageHero } from "@/components/common/PageHero";
import { searchContent } from "@/lib/search/search-content";
import styles from "@/style/page/search/search.module.css";

const groupListings: Record<string, string> = {
  Weapons: "/wiki/weapons",
  Ammunition: "/wiki/ammunition",
  Attachments: "/wiki/attachments",
  Equipment: "/wiki/equipment",
  Vehicles: "/wiki/vehicles",
};

export function SearchPage({ query }: { query: string }) {
  const results = searchContent(query);
  const groups = [...new Set(results.map((result) => result.group))];

  return (
    <main id="main-content">
      <PageHero
        eyebrow="Weapons, gear, guides and tools"
        title="Search WARDOGS items and guides"
        description="Search for a weapon, caliber, vehicle, item or guide topic, then open the matching list or guide."
        image="/images/official/wardogs-07.jpg"
        crumbs={[{ label: "Search" }]}
      >
        <GlobalSearch defaultValue={query} />
      </PageHero>
      <section className={`container ${styles.results}`}>
        <div className={styles.resultSummary}>
          <Search aria-hidden="true" />
          <div><span>{query ? `Search / ${query}` : "Start searching"}</span><h2>{query ? `${results.length} results` : "What are you looking for?"}</h2></div>
        </div>
        {query && !results.length && (
          <div className={styles.empty}>
            <h2>Nothing matched that search</h2>
            <p>Try a weapon name, caliber, vehicle, item type or guide topic.</p>
            <Link href="/wiki">Browse game items <ArrowRight aria-hidden="true" /></Link>
          </div>
        )}
        {groups.map((group) => {
          const groupResults = results.filter((result) => result.group === group);
          const listing = groupListings[group];
          return (
            <section key={group}>
              <div className={styles.groupTitle}><span>{group}</span><strong>{groupResults.length}</strong></div>
              <div className={styles.groupResults}>
                <div className={styles.resultGrid}>
                  {groupResults.slice(0, 12).map((result) => (
                    <Link href={result.href} key={result.id}>
                      <div>{result.image ? <Image src={result.image} alt="" fill sizes="110px" /> : <Search aria-hidden="true" />}</div>
                      <span>{result.group}</span><h3>{result.title}</h3><p>{result.description}</p><ArrowRight aria-hidden="true" />
                    </Link>
                  ))}
                </div>
                {listing && groupResults.length > 12 && (
                  <Link className={styles.moreResults} href={`${listing}?q=${encodeURIComponent(query)}`}>
                    View all {groupResults.length} matching {group.toLowerCase()} <ArrowRight aria-hidden="true" />
                  </Link>
                )}
              </div>
            </section>
          );
        })}
      </section>
    </main>
  );
}
