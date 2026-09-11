import Link from "next/link";
import { ChevronRight } from "lucide-react";
import styles from "@/style/common/common.module.css";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((item) => (
        <span key={`${item.href}-${item.label}`}>
          <ChevronRight aria-hidden="true" size={13} />
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
