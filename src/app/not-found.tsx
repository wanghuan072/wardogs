import Link from "next/link";
import { ArrowRight, BookOpenText, Crosshair, Wrench } from "lucide-react";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import styles from "@/style/page/not-found/not-found.module.css";

const exits = [
  { href: "/wiki", label: "Wiki database", text: "Search connected player records.", icon: Crosshair },
  { href: "/guides", label: "Field guides", text: "Learn economy, combat and logistics.", icon: BookOpenText },
  { href: "/tools", label: "Tactical tools", text: "Compare, calculate and build.", icon: Wrench },
];

export default function NotFound() {
  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.backdrop} />
      <section className={`container ${styles.content}`}>
        <span>ERROR 404 / SIGNAL LOST</span>
        <h1>Intel Not Found</h1>
        <p>The requested route is outside the current operations board. Search the database or redeploy through a known section.</p>
        <GlobalSearch />
        <div className={styles.grid}>{exits.map((exit) => <Link key={exit.href} href={exit.href}><exit.icon aria-hidden="true" /><div><strong>{exit.label}</strong><span>{exit.text}</span></div><ArrowRight aria-hidden="true" /></Link>)}</div>
        <Link className={styles.home} href="/">Return to command overview <ArrowRight size={15} /></Link>
      </section>
    </main>
  );
}
