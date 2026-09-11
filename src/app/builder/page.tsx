import type { Metadata } from "next";
import { catalogDisplayItems } from "@/lib/data/catalog";
import { EquipmentBuilder } from "@/page/builder/components/EquipmentBuilder";
import { PageHero } from "@/components/common/PageHero";
import { buildMetadata } from "@/seo/metadata";
import { tdk } from "@/seo/tdk";
import styles from "@/style/page/builder/builder.module.css";

export const metadata: Metadata = buildMetadata(tdk.builder);

export default async function BuilderPage({ searchParams }: { searchParams: Promise<{ item?: string }> }) {
  const { item } = await searchParams;
  return (
    <main id="main-content" className={styles.builderPage}>
      <section className={styles.builderContainer}>
        <PageHero
          eyebrow="Choose gear that works together"
          title="WARDOGS Loadout Builder – Build your kit"
          description="Pick a weapon, then add the ammunition, attachments and equipment that fit it. Keep an eye on your cash, weight and backpack space before you deploy."
          image="/images/official/wardogs-header.jpg"
          meta="BUILD YOUR KIT / EARLY ACCESS"
          containerClassName={styles.builderContainer}
        />
        <EquipmentBuilder items={catalogDisplayItems} initialItem={item} />
      </section>
    </main>
  );
}
