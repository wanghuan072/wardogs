"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Backpack,
  Boxes,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Crosshair,
  HeartPulse,
  LockKeyhole,
  Minus,
  PackagePlus,
  Plus,
  Radar,
  RotateCcw,
  Shield,
  Truck,
  Weight,
  Wrench,
  Zap,
} from "lucide-react";
import type { CatalogItem } from "@/types/catalog";
import styles from "@/style/page/builder/builder.module.css";

type ArmoryTab =
  | "primary"
  | "sidearm"
  | "launcher"
  | "ammo"
  | "magazine"
  | "attachment"
  | "medical"
  | "building"
  | "recon"
  | "vehicle"
  | "tactical";

type EquipmentState = {
  primary: string;
  sidearm: string;
  special: string;
  support: string;
};

type GearState = {
  helmet: string;
  armor: string;
  vest: string;
  backpack: string;
  traversal: string;
};

type WeaponSlot = "primary" | "sidearm" | "special";
type AmmoBySlot = Record<WeaponSlot, string>;
type AttachmentsBySlot = Record<WeaponSlot, Record<string, string>>;
type LoadedMagazine = { slug: string; ammoSlug: string; rounds: number; capacity: number };
type MagazinesBySlot = Record<WeaponSlot, LoadedMagazine | null>;

const fieldBudget = 10000;
const packCapacity = 8;

const armoryTabs: Array<{ id: ArmoryTab; label: string; shortLabel: string; icon: typeof Crosshair }> = [
  { id: "primary", label: "Primary weapons", shortLabel: "Primary", icon: Crosshair },
  { id: "sidearm", label: "Sidearms", shortLabel: "Sidearm", icon: Shield },
  { id: "launcher", label: "Launchers", shortLabel: "Launcher", icon: Zap },
  { id: "medical", label: "Medical", shortLabel: "Medical", icon: HeartPulse },
  { id: "building", label: "Building", shortLabel: "Building", icon: Wrench },
  { id: "recon", label: "Recon", shortLabel: "Recon", icon: Radar },
  { id: "vehicle", label: "Vehicles", shortLabel: "Vehicle", icon: Truck },
  { id: "tactical", label: "Tactical gear", shortLabel: "Tactical", icon: Boxes },
];

const tabDescriptions: Record<ArmoryTab, string> = {
  primary: "Select the main weapon carried in the primary sling.",
  sidearm: "Choose a compact backup weapon for close emergencies.",
  launcher: "Equip one specialist launcher in the utility slot.",
  ammo: "Choose compatible loose ammunition for the selected weapon.",
  magazine: "Choose a compatible magazine for the selected weapon.",
  attachment: "Only parts recorded as compatible with the selected weapon are shown.",
  medical: "Add trauma supplies to the pack. Every unit uses one capacity.",
  building: "Pack field construction and repair equipment.",
  recon: "Carry navigation, observation and survival equipment.",
  vehicle: "Choose one vehicle requisition for this deployment.",
  tactical: "Equip an explosive or pack grenades and tactical tools.",
};

function money(value: number | null) {
  return value === null || value <= 0 ? "N/A" : `$${value.toLocaleString()}`;
}

function itemLabel(item: CatalogItem) {
  return item.type || item.category || item.slot || item.kind;
}

function isPackCategory(tab: ArmoryTab) {
  return ["medical", "building", "recon", "tactical"].includes(tab);
}

function magazineCapacity(item: CatalogItem) {
  const match = item.name.match(/(\d+)\s*RND/i);
  return match ? Number(match[1]) : 0;
}

function looseAmmoPurchaseSize(magazine: LoadedMagazine | null) {
  return magazine?.capacity || 30;
}

function EquipmentSlot({
  label,
  item,
  weaponSlot,
  browseTab,
  ammo,
  magazine,
  attachmentCount,
  canSelectAmmo,
  canSelectMagazine,
  canSelectAttachments,
  onBrowse,
}: {
  label: string;
  item?: CatalogItem;
  weaponSlot: WeaponSlot;
  browseTab: ArmoryTab;
  ammo?: CatalogItem;
  magazine?: LoadedMagazine | null;
  attachmentCount: number;
  canSelectAmmo: boolean;
  canSelectMagazine: boolean;
  canSelectAttachments: boolean;
  onBrowse: (slot: WeaponSlot, tab: ArmoryTab) => void;
}) {
  return (
    <article className={`${styles.equipmentSlot} ${item ? styles.filledSlot : ""}`}>
      <button type="button" className={styles.slotMain} onClick={() => onBrowse(weaponSlot, browseTab)} aria-label={`Change ${label}`}>
        <span className={styles.cornerIndex}>{label}</span>
        {item?.price && item.price > 0 ? <strong className={styles.priceTag}>{money(item.price)}</strong> : null}
        <span className={styles.slotVisual}>
          {item?.image ? <Image src={item.image} alt="" fill sizes="(max-width: 760px) 80vw, 280px" /> : <PackagePlus />}
        </span>
        <span className={styles.slotName}>{item?.name || `Empty ${label.toLowerCase()}`}</span>
        <small>{item ? `${itemLabel(item)}${item.caliber ? ` / ${item.caliber}` : ""}` : "Select equipment"}</small>
      </button>
      <div className={styles.slotActions}>
        <button type="button" onClick={() => onBrowse(weaponSlot, "ammo")} disabled={!canSelectAmmo}>
          <span>Ammo</span><strong>{canSelectAmmo ? ammo?.name || "Select" : "—"}</strong>
        </button>
        <button type="button" onClick={() => onBrowse(weaponSlot, "magazine")} disabled={!canSelectMagazine}>
          <span>Mag.</span><strong>{canSelectMagazine ? (magazine ? `${magazine.rounds}/${magazine.capacity || "?"}` : "Select") : "—"}</strong>
        </button>
        <button type="button" onClick={() => onBrowse(weaponSlot, "attachment")} disabled={!canSelectAttachments}>
          <span>Attc.</span><strong>{canSelectAttachments ? `${attachmentCount}/4` : "—"}</strong>
        </button>
      </div>
    </article>
  );
}

export function EquipmentBuilder({ items, initialItem }: { items: CatalogItem[]; initialItem?: string }) {
  const bySlug = useMemo(() => new Map(items.map((item) => [item.slug, item])), [items]);
  const requestedItem = initialItem ? bySlug.get(initialItem) : undefined;
  const defaultPrimary =
    (requestedItem?.kind === "weapon" && requestedItem.slot === "Primary" ? requestedItem : undefined) ??
    bySlug.get("ak74") ??
    items.find((item) => item.kind === "weapon" && item.slot === "Primary");
  const defaultSpecial = bySlug.get("improvised-explosive-device");

  const initialEquipment: EquipmentState = {
    primary: defaultPrimary?.slug || "",
    sidearm: requestedItem?.kind === "weapon" && requestedItem.slot === "Sidearm" ? requestedItem.slug : "",
    special: requestedItem?.kind === "weapon" && requestedItem.slot === "Specialist" ? requestedItem.slug : defaultSpecial?.slug || "",
    support: requestedItem?.kind === "vehicle" ? requestedItem.slug : "",
  };

  const initialTab: ArmoryTab = requestedItem?.kind === "ammo"
    ? "ammo"
    : requestedItem?.kind === "attachment"
      ? "attachment"
      : requestedItem?.kind === "medical"
        ? "medical"
        : requestedItem?.kind === "vehicle"
          ? "vehicle"
          : requestedItem?.kind === "weapon" && requestedItem.slot === "Sidearm"
            ? "sidearm"
            : requestedItem?.kind === "weapon" && requestedItem.slot === "Specialist"
              ? "launcher"
              : "tactical";

  const [activeTab, setActiveTab] = useState<ArmoryTab>(initialTab);
  const [activeWeaponSlot, setActiveWeaponSlot] = useState<WeaponSlot>(initialTab === "sidearm" ? "sidearm" : initialTab === "launcher" ? "special" : "primary");
  const [equipment, setEquipment] = useState<EquipmentState>(initialEquipment);
  const [gear, setGear] = useState<GearState>({ helmet: "level-1-helmet", armor: "level-1-armor", vest: "small-tac-vest", backpack: "scout-backpack", traversal: "basic-parachute" });
  const [ammoBySlot, setAmmoBySlot] = useState<AmmoBySlot>({ primary: "", sidearm: "", special: "" });
  const [magazinesBySlot, setMagazinesBySlot] = useState<MagazinesBySlot>({ primary: null, sidearm: null, special: null });
  const [attachmentsBySlot, setAttachmentsBySlot] = useState<AttachmentsBySlot>({ primary: {}, sidearm: {}, special: {} });
  const [looseAmmoRounds, setLooseAmmoRounds] = useState<Record<string, number>>({});
  const [pack, setPack] = useState<Record<string, number>>(() => {
    if (requestedItem && !["weapon", "ammo", "attachment", "vehicle"].includes(requestedItem.kind)) {
      return { [requestedItem.slug]: 1 };
    }
    return {};
  });
  const [message, setMessage] = useState("Select an item below to equip it or add it to the pack.");

  const primary = bySlug.get(equipment.primary);
  const sidearm = bySlug.get(equipment.sidearm);
  const special = bySlug.get(equipment.special);
  const support = bySlug.get(equipment.support);
  const gearItems = Object.values(gear).map((slug) => bySlug.get(slug)).filter((item): item is CatalogItem => Boolean(item));
  const activeWeapon = bySlug.get(equipment[activeWeaponSlot]);
  const activeAttachments = attachmentsBySlot[activeWeaponSlot];
  const activeMagazine = magazinesBySlot[activeWeaponSlot];

  const compatibleAmmo = items.filter((item) => item.kind === "ammo" && item.ammoType !== "magazine" && Boolean(activeWeapon && (activeWeapon.ammoIds.includes(item.slug) || item.compatibleWeaponIds.includes(activeWeapon.slug))));
  const compatibleMagazines = items.filter((item) => item.kind === "ammo" && item.ammoType === "magazine" && Boolean(activeWeapon && (activeWeapon.attachmentIds.includes(item.slug) || item.compatibleWeaponIds.includes(activeWeapon.slug))));
  const compatibleAttachments = items.filter((item) => item.kind === "attachment" && Boolean(activeWeapon && (activeWeapon.attachmentIds.includes(item.slug) || item.compatibleWeaponIds.includes(activeWeapon.slug))));

  let optionRecords: CatalogItem[] = [];
  if (activeTab === "primary") optionRecords = items.filter((item) => item.kind === "weapon" && item.slot === "Primary");
  if (activeTab === "sidearm") optionRecords = items.filter((item) => item.kind === "weapon" && item.slot === "Sidearm");
  if (activeTab === "launcher") optionRecords = items.filter((item) => item.kind === "weapon" && item.slot === "Specialist");
  if (activeTab === "ammo") optionRecords = compatibleAmmo;
  if (activeTab === "magazine") optionRecords = compatibleMagazines;
  if (activeTab === "attachment") optionRecords = compatibleAttachments;
  if (activeTab === "medical") optionRecords = items.filter((item) => item.kind === "medical");
  if (activeTab === "building") optionRecords = items.filter((item) => ["deployable", "supplies"].includes(item.kind));
  if (activeTab === "recon") optionRecords = items.filter((item) => ["utility", "storage", "armor"].includes(item.kind));
  if (activeTab === "vehicle") optionRecords = items.filter((item) => item.kind === "vehicle");
  if (activeTab === "tactical") optionRecords = items.filter((item) => ["throwable", "explosive", "melee"].includes(item.kind));
  const options = optionRecords.filter((item) => item.image).slice(0, 32);

  const usedCapacity = Object.values(pack).reduce((total, quantity) => total + quantity, 0);
  const backpackItems = Object.entries(pack)
    .map(([slug, quantity]) => ({ item: bySlug.get(slug), quantity }))
    .filter((entry): entry is { item: CatalogItem; quantity: number } => Boolean(entry.item));
  const backpackUnits = backpackItems.flatMap(({ item, quantity }) =>
    Array.from({ length: quantity }, (_, index) => ({ item, index, quantity })),
  );

  const loadedMagazineItems = Object.values(magazinesBySlot).map((magazine) => magazine ? bySlug.get(magazine.slug) : undefined);
  const loadedAmmoItems = Object.values(magazinesBySlot).map((magazine) => magazine?.ammoSlug ? bySlug.get(magazine.ammoSlug) : undefined);
  const equippedItems = [primary, sidearm, special, support, ...gearItems, ...loadedMagazineItems, ...Object.values(attachmentsBySlot).flatMap((slotAttachments) => Object.values(slotAttachments)).map((slug) => bySlug.get(slug))]
    .filter((item): item is CatalogItem => Boolean(item));
  const knownCost = equippedItems.reduce((total, item) => total + (item.price && item.price > 0 ? item.price : 0), 0)
    + loadedAmmoItems.reduce((total, item, index) => total + (item?.price && item.price > 0 ? item.price * (Object.values(magazinesBySlot)[index]?.rounds || 0) : 0), 0)
    + backpackItems.reduce((total, { item, quantity }) => total + (item.price && item.price > 0 ? item.price * (item.ammoType === "cartridge" ? looseAmmoRounds[item.slug] || 0 : quantity) : 0), 0);
  const knownWeight = equippedItems.reduce((total, item) => total + (item.weight && item.weight > 0 ? item.weight : 0), 0)
    + backpackItems.reduce((total, { item, quantity }) => total + (item.weight && item.weight > 0 ? item.weight * quantity : 0), 0);
  const remaining = fieldBudget - knownCost;

  function openTab(tab: ArmoryTab) {
    setActiveTab(tab);
    setMessage(tabDescriptions[tab]);
  }

  function browseWeaponSlot(slot: WeaponSlot, tab: ArmoryTab) {
    setActiveWeaponSlot(slot);
    setActiveTab(tab);
    const weapon = bySlug.get(equipment[slot]);
    setMessage(weapon ? `${weapon.name}: ${tabDescriptions[tab]}` : `Choose a ${slot} weapon before browsing ${tab}.`);
  }

  function isCompatibleMunition(item: CatalogItem, nextEquipment: EquipmentState) {
    if (item.kind !== "ammo") return true;
    const nextWeapons = [nextEquipment.primary, nextEquipment.sidearm, nextEquipment.special]
      .map((slug) => bySlug.get(slug))
      .filter((weapon): weapon is CatalogItem => Boolean(weapon));
    return nextWeapons.some((weapon) => item.ammoType === "magazine"
      ? weapon.attachmentIds.includes(item.slug) || item.compatibleWeaponIds.includes(weapon.slug)
      : weapon.ammoIds.includes(item.slug) || item.compatibleWeaponIds.includes(weapon.slug));
  }

  function synchronizeMunitions(nextEquipment: EquipmentState) {
    setPack((current) => Object.fromEntries(
      Object.entries(current).filter(([slug]) => {
        const item = bySlug.get(slug);
        return !item || isCompatibleMunition(item, nextEquipment);
      }),
    ));
    setLooseAmmoRounds((current) => Object.fromEntries(
      Object.entries(current).filter(([slug]) => {
        const item = bySlug.get(slug);
        return !item || isCompatibleMunition(item, nextEquipment);
      }),
    ));
  }

  function selectWeapon(slot: WeaponSlot, item: CatalogItem, canToggle = false) {
    const shouldRemove = canToggle && equipment[slot] === item.slug;
    const nextEquipment = { ...equipment, [slot]: shouldRemove ? "" : item.slug };
    setEquipment(nextEquipment);
    setAmmoBySlot((current) => ({ ...current, [slot]: "" }));
    setMagazinesBySlot((current) => ({ ...current, [slot]: null }));
    setAttachmentsBySlot((current) => ({ ...current, [slot]: {} }));
    synchronizeMunitions(nextEquipment);
    setMessage(`${item.name} ${shouldRemove ? "removed" : "equipped"}. Incompatible ammunition, magazines, and fitted parts were cleared.`);
  }

  function addToPack(item: CatalogItem) {
    if (item.kind === "ammo" && item.ammoType === "cartridge") {
      addLooseAmmo(item);
      return;
    }
    if (usedCapacity >= packCapacity) {
      setMessage("Backpack full. Remove one unit before adding more gear.");
      return;
    }
    setPack((current) => ({ ...current, [item.slug]: (current[item.slug] || 0) + 1 }));
    setMessage(`${item.name} added to backpack.`);
  }

  function addLooseAmmo(item: CatalogItem) {
    const rounds = looseAmmoPurchaseSize(activeMagazine);
    const isNewStack = !pack[item.slug];
    if (isNewStack && usedCapacity >= packCapacity) {
      setMessage("Backpack full. Remove one item before adding loose ammunition.");
      return;
    }
    if (isNewStack) setPack((current) => ({ ...current, [item.slug]: 1 }));
    setLooseAmmoRounds((current) => ({ ...current, [item.slug]: (current[item.slug] || 0) + rounds }));
    setAmmoBySlot((current) => ({ ...current, [activeWeaponSlot]: item.slug }));
    setMessage(`${rounds} rounds of ${item.name} added to backpack.`);
  }

  function removeFromPack(slug: string) {
    const packItem = bySlug.get(slug);
    const itemName = packItem?.name || "Item";
    setPack((current) => {
      const quantity = current[slug] || 0;
      if (packItem?.kind === "ammo" && packItem.ammoType === "cartridge") {
        return Object.fromEntries(Object.entries(current).filter(([key]) => key !== slug));
      }
      if (quantity <= 1) return Object.fromEntries(Object.entries(current).filter(([key]) => key !== slug));
      return { ...current, [slug]: quantity - 1 };
    });
    if (packItem?.kind === "ammo" && packItem.ammoType === "cartridge") {
      setLooseAmmoRounds((current) => ({ ...current, [slug]: 0 }));
    }
    setMessage(`${itemName} removed from backpack.`);
  }

  function chooseItem(item: CatalogItem) {
    if (activeTab === "primary") {
      selectWeapon("primary", item);
      return;
    }
    if (activeTab === "sidearm") {
      selectWeapon("sidearm", item, true);
      return;
    }
    if (activeTab === "launcher") {
      selectWeapon("special", item, true);
      return;
    }
    if (activeTab === "ammo") {
      if (activeMagazine && !activeMagazine.ammoSlug) {
        setAmmoBySlot((current) => ({ ...current, [activeWeaponSlot]: item.slug }));
        setMagazinesBySlot((current) => ({ ...current, [activeWeaponSlot]: { ...activeMagazine, ammoSlug: item.slug, rounds: activeMagazine.capacity } }));
        setMessage(`${item.name} loaded into ${activeWeapon?.name || activeWeaponSlot}'s ${activeMagazine.capacity || "selected"}-round magazine.`);
        return;
      }
      addLooseAmmo(item);
      return;
    }
    if (activeTab === "magazine") {
      if (activeMagazine?.slug === item.slug) {
        addToPack(item);
        setMessage(`${item.name} added to backpack as a spare magazine.`);
        return;
      }
      if (activeMagazine && usedCapacity >= packCapacity) {
        setMessage("Backpack full. Remove one item before replacing the loaded magazine.");
        return;
      }
      const capacity = magazineCapacity(item);
      const looseAmmo = compatibleAmmo.find((ammoItem) => (looseAmmoRounds[ammoItem.slug] || 0) >= capacity);
      setMagazinesBySlot((current) => ({ ...current, [activeWeaponSlot]: { slug: item.slug, ammoSlug: looseAmmo?.slug || "", rounds: looseAmmo ? capacity : 0, capacity } }));
      if (activeMagazine) setPack((current) => ({ ...current, [activeMagazine.slug]: (current[activeMagazine.slug] || 0) + 1 }));
      if (looseAmmo) setLooseAmmoRounds((current) => ({ ...current, [looseAmmo.slug]: current[looseAmmo.slug] - capacity }));
      if (looseAmmo && looseAmmoRounds[looseAmmo.slug] === capacity) setPack((current) => Object.fromEntries(Object.entries(current).filter(([slug]) => slug !== looseAmmo.slug)));
      setMessage(`${item.name} equipped${looseAmmo ? ` and loaded with ${looseAmmo.name}` : ". Choose Ammo to load it."}`);
      return;
    }
    if (activeTab === "attachment") {
      const slot = item.slot || "Attachment";
      setAttachmentsBySlot((current) => ({
        ...current,
        [activeWeaponSlot]: current[activeWeaponSlot][slot] === item.slug
          ? Object.fromEntries(Object.entries(current[activeWeaponSlot]).filter(([key]) => key !== slot))
          : { ...current[activeWeaponSlot], [slot]: item.slug },
      }));
      setMessage(`${item.name} ${activeAttachments[slot] === item.slug ? "removed" : `fitted to ${activeWeapon?.name || activeWeaponSlot}`}.`);
      return;
    }
    if (activeTab === "vehicle") {
      setEquipment((current) => ({ ...current, support: current.support === item.slug ? "" : item.slug }));
      setMessage(`${item.name} ${equipment.support === item.slug ? "requisition cancelled" : "requisitioned"}.`);
      return;
    }
    if (activeTab === "recon") {
      if (item.kind === "armor") {
        const slot = item.name.toLowerCase().includes("helmet") ? "helmet" : "armor";
        setGear((current) => ({ ...current, [slot]: item.slug }));
        setMessage(`${item.name} equipped in ${slot}.`);
        return;
      }
      if (item.kind === "storage") {
        const slot = item.name.toLowerCase().includes("vest") ? "vest" : "backpack";
        setGear((current) => ({ ...current, [slot]: item.slug }));
        setMessage(`${item.name} equipped in ${slot}.`);
        return;
      }
      if (item.slug.includes("parachute")) {
        setGear((current) => ({ ...current, traversal: item.slug }));
        setMessage(`${item.name} equipped in traversal.`);
        return;
      }
    }
    if (activeTab === "tactical" && item.slug === "improvised-explosive-device") {
      setEquipment((current) => ({ ...current, special: current.special === item.slug ? "" : item.slug }));
      setMessage(`${item.name} ${equipment.special === item.slug ? "removed" : "equipped"}.`);
      return;
    }
    addToPack(item);
  }

  function isSelected(item: CatalogItem) {
    return [equipment.primary, equipment.sidearm, equipment.special, equipment.support, ...Object.values(magazinesBySlot).flatMap((magazine) => magazine ? [magazine.slug, magazine.ammoSlug] : []), ...Object.values(attachmentsBySlot).flatMap((slotAttachments) => Object.values(slotAttachments))].includes(item.slug)
      || Boolean(pack[item.slug]);
  }

  function reset() {
    setEquipment(initialEquipment);
    setAmmoBySlot({ primary: "", sidearm: "", special: "" });
    setMagazinesBySlot({ primary: null, sidearm: null, special: null });
    setLooseAmmoRounds({});
    setAttachmentsBySlot({ primary: {}, sidearm: {}, special: {} });
    setGear({ helmet: "level-1-helmet", armor: "level-1-armor", vest: "small-tac-vest", backpack: "scout-backpack", traversal: "basic-parachute" });
    setPack({});
    setActiveTab("tactical");
    setMessage("Loadout reset to the standard field issue.");
  }

  return (
    <div className={styles.builderShell}>
      <header className={styles.commandBar}>
        <div className={styles.commandTitle}>
          <span>Quartermaster / field issue terminal</span>
          <h2>Loadout Builder</h2>
          <p>Configure your carry exactly as you would before deployment.</p>
        </div>
        <div className={styles.readout}>
          <span>Known kit value</span>
          <strong>{money(knownCost)}</strong>
          <small className={remaining < 0 ? styles.negative : ""}>{remaining < 0 ? `${money(Math.abs(remaining))} over budget` : `${money(remaining)} available`}</small>
        </div>
        <div className={styles.readout}>
          <span>Carry weight</span>
          <strong>{knownWeight.toFixed(2)} <em>kg</em></strong>
          <small>{usedCapacity}/{packCapacity} pack capacity</small>
        </div>
        <button type="button" className={styles.resetButton} onClick={reset}><RotateCcw />Reset kit</button>
      </header>

      <div className={styles.loadoutStage}>
        <aside className={styles.operatorPanel} aria-label="Player gear slots">
          <div className={styles.playerHeader}><small>Loadout</small><strong>Jonniedw</strong><span>Field operator</span></div>
          <div className={styles.playerStatus}><span>Health <b>31</b></span><span>Weight <b>{knownWeight.toFixed(1)} kg</b></span></div>
          <div className={styles.gearHeading}>Gear</div>
          <div className={styles.gearGrid}>
            {([ ["helmet", "Helmet"], ["armor", "Armor"], ["vest", "Vest"], ["backpack", "Storage"], ["traversal", "Traversal"] ] as const).map(([key, label]) => {
              const item = bySlug.get(gear[key]);
              return <button type="button" className={styles.gearTile} onClick={() => openTab("recon")} key={key} aria-label={`Change ${label}`}><small>{label}</small>{item?.image ? <Image src={item.image} alt="" fill sizes="120px" /> : <PackagePlus />}<strong>{item?.name || label}</strong></button>;
            })}
          </div>
          <div className={styles.quickSlots}><span>Quick slots</span><i /><i /><i /><i /></div>
        </aside>
        <section className={styles.equipmentPanel} aria-labelledby="equipment-heading">
          <div className={styles.panelHeading}>
            <div><span>01</span><h2 id="equipment-heading">Equipment slots</h2></div>
            <p>Click a slot to browse replacements</p>
          </div>
          <div className={styles.equipmentGrid}>
            <EquipmentSlot label="Primary" item={primary} weaponSlot="primary" browseTab="primary" ammo={bySlug.get(ammoBySlot.primary)} magazine={magazinesBySlot.primary} attachmentCount={Object.keys(attachmentsBySlot.primary).length} canSelectAmmo={Boolean(primary && items.some((item) => item.kind === "ammo" && item.ammoType !== "magazine" && (primary.ammoIds.includes(item.slug) || item.compatibleWeaponIds.includes(primary.slug))))} canSelectMagazine={Boolean(primary && items.some((item) => item.kind === "ammo" && item.ammoType === "magazine" && (primary.attachmentIds.includes(item.slug) || item.compatibleWeaponIds.includes(primary.slug))))} canSelectAttachments={Boolean(primary && items.some((item) => item.kind === "attachment" && (primary.attachmentIds.includes(item.slug) || item.compatibleWeaponIds.includes(primary.slug))))} onBrowse={browseWeaponSlot} />
            <EquipmentSlot label="Sidearm" item={sidearm} weaponSlot="sidearm" browseTab="sidearm" ammo={bySlug.get(ammoBySlot.sidearm)} magazine={magazinesBySlot.sidearm} attachmentCount={Object.keys(attachmentsBySlot.sidearm).length} canSelectAmmo={Boolean(sidearm && items.some((item) => item.kind === "ammo" && item.ammoType !== "magazine" && (sidearm.ammoIds.includes(item.slug) || item.compatibleWeaponIds.includes(sidearm.slug))))} canSelectMagazine={Boolean(sidearm && items.some((item) => item.kind === "ammo" && item.ammoType === "magazine" && (sidearm.attachmentIds.includes(item.slug) || item.compatibleWeaponIds.includes(sidearm.slug))))} canSelectAttachments={Boolean(sidearm && items.some((item) => item.kind === "attachment" && (sidearm.attachmentIds.includes(item.slug) || item.compatibleWeaponIds.includes(sidearm.slug))))} onBrowse={browseWeaponSlot} />
            <EquipmentSlot label="Special issue" item={special} weaponSlot="special" browseTab="launcher" ammo={bySlug.get(ammoBySlot.special)} magazine={magazinesBySlot.special} attachmentCount={Object.keys(attachmentsBySlot.special).length} canSelectAmmo={Boolean(special && items.some((item) => item.kind === "ammo" && item.ammoType !== "magazine" && (special.ammoIds.includes(item.slug) || item.compatibleWeaponIds.includes(special.slug))))} canSelectMagazine={Boolean(special && items.some((item) => item.kind === "ammo" && item.ammoType === "magazine" && (special.attachmentIds.includes(item.slug) || item.compatibleWeaponIds.includes(special.slug))))} canSelectAttachments={Boolean(special && items.some((item) => item.kind === "attachment" && (special.attachmentIds.includes(item.slug) || item.compatibleWeaponIds.includes(special.slug))))} onBrowse={browseWeaponSlot} />
          </div>
          <div className={styles.statusStrip} role="status" aria-live="polite">
            <i />
            <p>{message}</p>
            {support ? <span>Support: <strong>{support.name}</strong></span> : <span>No vehicle requisition</span>}
          </div>
        </section>

        <aside className={styles.backpackPanel} aria-labelledby="backpack-heading">
          <div className={styles.panelHeading}>
            <div><span>02</span><h2 id="backpack-heading">Backpack</h2></div>
            <strong className={usedCapacity >= packCapacity ? styles.fullCapacity : ""}>CAP. {usedCapacity}/{packCapacity}</strong>
          </div>
          <div className={styles.packInterior}>
            <Image className={styles.operatorBackdrop} src="/images/home/wardogs-command-overlook.png" alt="" fill sizes="(max-width: 980px) 100vw, 440px" priority />
            <div className={styles.packFrame}>
              {backpackUnits.map(({ item, index, quantity }) => (
                <article className={styles.packItem} key={`${item.slug}-${index}`}>
                  {item.price && item.price > 0 ? <span>{money(item.price)}</span> : null}
                  <div>{item.image ? <Image src={item.image} alt="" fill sizes="90px" /> : <Backpack />}</div>
                  <strong>{item.name}</strong>
                  <footer>
                    <button type="button" onClick={() => removeFromPack(item.slug)} aria-label={`Remove one ${item.name}`}><Minus /></button>
                    <b>{item.ammoType === "cartridge" ? `${looseAmmoRounds[item.slug] || 0}R` : quantity > 1 ? `${index + 1}/${quantity}` : "1"}</b>
                    <button type="button" onClick={() => addToPack(item)} disabled={usedCapacity >= packCapacity} aria-label={`Add one ${item.name}`}><Plus /></button>
                  </footer>
                </article>
              ))}
              {Array.from({ length: Math.max(0, packCapacity - usedCapacity) }, (_, index) => (
                <div className={styles.emptyPackCell} key={`empty-${index}`}><span>{String(usedCapacity + index + 1).padStart(2, "0")}</span></div>
              ))}
            </div>
            {!backpackItems.length ? <div className={styles.emptyPackCopy}><Backpack /><strong>Pack is empty</strong><span>Add gear from the armory below</span></div> : null}
          </div>
        </aside>
      </div>

      <section className={styles.armoryPanel} aria-labelledby="armory-heading">
        <div className={styles.armoryTopline}>
          <div className={styles.panelHeading}>
            <div><span>03</span><h2 id="armory-heading">Field armory</h2></div>
          </div>
          <p>{tabDescriptions[activeTab]}</p>
          <span>{options.length} available</span>
        </div>
        <nav className={styles.armoryTabs} aria-label="Armory categories">
          {armoryTabs.map(({ id, shortLabel, icon: Icon }) => (
            <button type="button" key={id} className={activeTab === id ? styles.activeTab : ""} onClick={() => openTab(id)}>
              <Icon /><span>{shortLabel}</span>
            </button>
          ))}
        </nav>
        <div className={styles.carouselFrame}>
          <button type="button" className={styles.scrollHint} aria-label="Browse previous items" disabled><ChevronLeft /></button>
          <div className={styles.itemRail}>
            {options.map((item) => {
              const selected = isSelected(item);
              const packedQuantity = pack[item.slug] || 0;
              return (
                <button type="button" className={`${styles.armoryCard} ${selected ? styles.selectedCard : ""}`} key={item.slug} onClick={() => chooseItem(item)}>
                  <span className={styles.cardCode}>{item.slug.slice(0, 3).toUpperCase()}</span>
                  {item.price && item.price > 0 ? <span className={styles.cardPrice}>{money(item.price)}</span> : null}
                  <span className={styles.cardImage}>{item.image ? <Image src={item.image} alt="" fill sizes="210px" /> : <Boxes />}</span>
                  <span className={styles.cardCopy}>
                    <small>{itemLabel(item)}</small>
                    <strong>{item.name}</strong>
                    <em>{selected ? (packedQuantity ? `In pack ×${packedQuantity}` : "Equipped") : isPackCategory(activeTab) ? "Add to pack" : "Select item"}</em>
                  </span>
                  {selected ? <i className={styles.selectedMark}><Check /></i> : null}
                </button>
              );
            })}
            <div className={styles.lockedCard} aria-label="Locked armory record"><LockKeyhole /><strong>Restricted</strong><span>Reputation required</span></div>
          </div>
          <span className={styles.scrollHint}><ChevronRight /></span>
        </div>
        {!options.length ? <div className={styles.noItems}><LockKeyhole /><strong>No compatible equipment</strong><span>Change the primary weapon to load a different compatibility set.</span></div> : null}
      </section>

      <footer className={styles.manifestBar}>
        <div><CircleDollarSign /><span>Deployment cost</span><strong>{money(knownCost)}</strong></div>
        <div><Weight /><span>Known weight</span><strong>{knownWeight.toFixed(2)} kg</strong></div>
        <div><Backpack /><span>Pack load</span><strong>{usedCapacity}/{packCapacity}</strong></div>
        <p><Check /> Changes are calculated locally. Unknown source values are excluded from totals.</p>
      </footer>
    </div>
  );
}
