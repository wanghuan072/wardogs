import { ArrowDown, CalendarDays, CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import { DataStatus } from "@/components/common/DataStatus";
import { PageHero } from "@/components/common/PageHero";
import { RelatedLinks } from "@/components/common/RelatedLinks";
import { updates } from "@/lib/data/editorial";
import { dateLabel } from "@/lib/formatting/format-values";
import styles from "@/style/page/updates/updates.module.css";

export function UpdatesPage() {
  const latest = updates[0];
  const changeCount = updates.reduce((total, update) => total + update.changes.length, 0);
  const releaseOrder = [...updates].reverse();

  return (
    <main id="main-content">
      <PageHero eyebrow="Patches, announcements and release dates" title="WARDOGS Updates – What changed and when" description="See WARDOGS announcements in date order, from the first launch news through Early Access. Every version and its key changes are listed on this page." image="/images/official/wardogs-08.jpg" crumbs={[{ label: "Updates" }]}>
        <DataStatus compact />
      </PageHero>

      <section className={`container ${styles.archiveBand}`} aria-label="Update archive summary">
        <div className={styles.currentBuild}><span>Latest version</span><strong>{latest.version}</strong><small>{latest.label}</small></div>
        <div><CalendarDays aria-hidden="true" /><span>Updates listed</span><strong>{updates.length}</strong></div>
        <div><CheckCircle2 aria-hidden="true" /><span>Changes listed</span><strong>{changeCount}</strong></div>
        <div><ShieldCheck aria-hidden="true" /><span>Game state</span><strong>Early Access</strong></div>
      </section>

      <section className={`container ${styles.releaseArchive}`}>
        <header className={styles.archiveHeading}>
          <div><span>Version timeline</span><h2>From the first news to Early Access</h2></div>
          <p>Start at the first announcement, then follow each update through to Early Access. The full change list stays on this page.</p>
        </header>

        <ol className={styles.versionTrack} aria-label="WARDOGS version progression">
          {releaseOrder.map((update, index) => (
            <li key={update.slug}><span className={styles.trackIndex}>{String(index + 1).padStart(2, "0")}</span><strong>{update.version}</strong><small>{dateLabel(update.date)}</small>{index < releaseOrder.length - 1 && <ArrowDown aria-hidden="true" />}</li>
          ))}
        </ol>

        <div className={styles.releaseLog}>
          {updates.map((update, index) => (
            <article className={styles.release} key={update.slug}>
              <aside className={styles.releaseMark}><span>{String(updates.length - index).padStart(2, "0")}</span><i aria-hidden="true" /></aside>
              <div className={styles.releaseVersion}><strong>{update.version}</strong><time dateTime={update.date}>{dateLabel(update.date)}</time><span>{update.label}</span></div>
              <div className={styles.releaseBody}>
                <div className={styles.releaseTitle}><div><small>{update.categories.join(" / ")}</small><h2>{update.title}</h2></div><a href={update.sourceUrl} target="_blank" rel="noreferrer">Official update <ExternalLink aria-hidden="true" /></a></div>
                <p>{update.summary}</p>
                <div className={styles.changeList} aria-label={`${update.version} recorded changes`}>
                  {update.changes.map((change) => <div key={`${change.area}-${change.description}`}><span>{change.area}</span><p>{change.description}</p></div>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="container"><RelatedLinks links={[
        { label: "Official WARDOGS updates", href: "https://steamcommunity.com/app/1867240/announcements/", text: "Read announcements from the WARDOGS team on Steam." },
        { label: "Browse game items", href: "/wiki", text: "Look up weapons, gear and vehicles for your next match." },
        { label: "About this site", href: "/legal/about-us", text: "See what WARDOGS Field Intel covers and how pages are updated." },
      ]} /></div>
    </main>
  );
}
