import type { Metadata } from "next";
import { catalogDisplayItems } from "@/lib/data/catalog";
import { isBuilderItem, toBuilderItem } from "@/lib/tools/loadout";
import { EquipmentBuilder } from "@/page/builder/components/EquipmentBuilder";
import { PageHero } from "@/components/common/PageHero";
import { buildMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
import styles from "@/style/page/builder/builder.module.css";

export const metadata: Metadata = buildMetadata(tdk.builder);

type BuilderPageProps = {
  searchParams: Promise<{ item?: string | string[] }>;
};

export default async function BuilderPage({ searchParams }: BuilderPageProps) {
  const query = await searchParams;
  const initialItemSlug = Array.isArray(query.item) ? query.item[0] : query.item;
  const items = catalogDisplayItems.filter(isBuilderItem).map(toBuilderItem);
  return (
    <main id="main-content" className={styles.builderPage}>
      <section className={styles.builderContainer}>
        <PageHero
          eyebrow="Choose gear that works together"
          title="WARDOGS Loadout Builder – Build your kit"
          description="Pick a weapon, then add the ammunition, attachments and equipment that work with it. Keep an eye on cash, weight and backpack space before you deploy."
          image="/images/official/wardogs-header.jpg"
          meta="BUILD YOUR KIT / FIELD ISSUE"
          containerClassName={styles.builderContainer}
        />
        <EquipmentBuilder items={items} initialItemSlug={initialItemSlug} />
      </section>
    </main>
  );
}
