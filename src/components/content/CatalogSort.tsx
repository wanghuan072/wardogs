"use client";

import { usePathname, useSearchParams } from "next/navigation";
import styles from "@/style/page/wiki/wiki-listing.module.css";

export function CatalogSort({ value, showRateOfFire = false }: { value: string; showRateOfFire?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <label className={styles.sortControl}>
      <span>Sort by</span>
      <select
        value={value}
        onChange={(event) => {
          const query = new URLSearchParams(searchParams.toString());
          query.set("sort", event.target.value);
          // 排序会改变独立 URL；使用完整文档导航以重新初始化统计与广告位。
          window.location.assign(`${pathname}?${query.toString()}`);
        }}
      >
        <option value="name">Name</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        {showRateOfFire && <option value="rpm">Rate of fire</option>}
      </select>
    </label>
  );
}
