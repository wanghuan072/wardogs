"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "@/style/page/wiki/wiki-listing.module.css";

export function CatalogSort({ value }: { value: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <label className={styles.sortControl}>
      <span>Sort by</span>
      <select
        value={value}
        onChange={(event) => {
          const query = new URLSearchParams(searchParams.toString());
          query.set("sort", event.target.value);
          router.push(`${pathname}?${query.toString()}`);
        }}
      >
        <option value="name">Name</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="rpm">Rate of fire</option>
      </select>
    </label>
  );
}
