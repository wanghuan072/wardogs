"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Info, Search, X } from "lucide-react";
import { calculateBudget, isBudgetItem, type ToolItem } from "@/lib/tools/calculations";
import styles from "@/style/page/tools/workbench.module.css";

function money(value: number | null | undefined) { return typeof value === "number" ? `$${value.toLocaleString("en-US")}` : "Unknown"; }
function number(value: number | null | undefined, suffix = "") { return typeof value === "number" ? `${value.toLocaleString("en-US")}${suffix}` : "Unknown"; }

function RecordList({ items, selected, onToggle, label }: { items: ToolItem[]; selected: string[]; onToggle: (slug: string) => void; label: string }) {
  return <div className={styles.recordList} aria-label={label}>{items.map((item) => { const active = selected.includes(item.slug); return <button type="button" key={item.slug} className={active ? styles.recordRowActive : styles.recordRow} onClick={() => onToggle(item.slug)} aria-pressed={active}><div className={styles.recordThumb}>{item.image && <Image src={item.image} alt="" fill sizes="74px" />}</div><span><strong>{item.name}</strong><small>{item.type || item.kind}{item.caliber ? ` · ${item.caliber}` : ""}</small></span><b>{money(item.price)}</b></button>; })}</div>;
}

function ListToolbar({ value, onChange, resultCount, placeholder }: { value: string; onChange: (value: string) => void; resultCount: number; placeholder: string }) {
  return <div className={styles.listToolbar}><label><Search aria-hidden="true" /><input type="search" name="tool-query" value={value} onChange={(event) => onChange(event.target.value)} placeholder={`${placeholder}…`} aria-label={placeholder} autoComplete="off" spellCheck={false} /></label><span aria-live="polite">{resultCount} items</span></div>;
}

export function ToolWorkbench({ tool, items }: { tool: string; items: ToolItem[] }) {
  return tool === "weapon-compare" ? <WeaponCompare items={items} /> : <BudgetPlanner items={items} />;
}

function WeaponCompare({ items }: { items: ToolItem[] }) {
  const weapons = useMemo(() => items.filter((item) => item.kind === "weapon").sort((a, b) => a.name.localeCompare(b.name)), [items]);
  const ammoBySlug = useMemo(() => new Map(items.filter((item) => item.kind === "ammo").map((item) => [item.slug, item])), [items]);
  const [selected, setSelected] = useState(["m4", "ak74"]);
  const [query, setQuery] = useState("");
  const visibleWeapons = weapons.filter((item) => `${item.name} ${item.type} ${item.caliber}`.toLowerCase().includes(query.toLowerCase()));
  const chosen = selected.map((slug) => weapons.find((item) => item.slug === slug)).filter((item): item is ToolItem => Boolean(item));
  const toggle = (slug: string) => setSelected((current) => current.includes(slug) ? current.filter((item) => item !== slug) : current.length < 4 ? [...current, slug] : current);
  const fields: Array<[string, (item: ToolItem) => string]> = [["Price", (item) => money(item.price)], ["Type", (item) => item.type || "Unknown"], ["Caliber", (item) => item.caliber || "Unknown"], ["Rate of fire", (item) => number(item.rpm, " RPM")], ["Velocity", (item) => number(item.velocity, " m/s")], ["Effective range", (item) => number(item.range, " m")], ["Weight", (item) => number(item.weight, " kg")], ["Recorded ammo", (item) => String(item.ammoIds?.length ?? 0)]];
  return <div className={styles.listWorkbench}>
    <section className={styles.inventoryPanel}><div className={styles.panelHead}><span>01 / choose weapons</span><h2>Select up to four</h2></div><ListToolbar value={query} onChange={setQuery} resultCount={visibleWeapons.length} placeholder="Search weapons" /><RecordList items={visibleWeapons} selected={selected} onToggle={toggle} label="Weapons" /><p className={styles.formNote}><Info aria-hidden="true" /> {selected.length}/4 selected. Compare the details shown here; this tool does not calculate damage, TTK, armor or a single “best weapon”.</p></section>
    <section className={styles.output}><div className={styles.panelHead}><span>02 / side by side</span><h2>Compare weapon details</h2></div>{chosen.length ? <><div className={styles.selectedRack}>{chosen.map((item) => <button type="button" key={item.slug} onClick={() => toggle(item.slug)}><div>{item.image && <Image src={item.image} alt="" fill sizes="130px" />}</div><span>{item.type || "Weapon"}</span><strong>{item.name}</strong><small>Remove</small></button>)}</div><div className={styles.compareTable}><div className={styles.compareHead}><span>Detail</span>{chosen.map((item) => <strong key={item.slug}>{item.name}</strong>)}</div>{fields.map(([label, render]) => <div key={label}><span>{label}</span>{chosen.map((item) => <b key={item.slug}>{render(item)}</b>)}</div>)}</div><div className={styles.compatibility}><span>Compatible ammunition</span>{chosen.map((weapon) => { const rounds = (weapon.ammoIds ?? []).map((slug) => ammoBySlug.get(slug)?.name).filter(Boolean); return <div key={weapon.slug}><strong>{weapon.name}</strong><p>{rounds.length ? rounds.join(" · ") : "No compatible ammunition is listed yet."}</p></div>; })}</div></> : <div className={styles.emptyList}><Info aria-hidden="true" /><p>Select a weapon from the list to begin a comparison.</p></div>}</section>
  </div>;
}

const budgetGroups = [
  ["all", "All items"], ["weapon", "Weapons"], ["ammo", "Ammunition"], ["attachment", "Attachments"], ["gear", "Gear"], ["vehicle", "Vehicles"],
] as const;

function BudgetPlanner({ items }: { items: ToolItem[] }) {
  const purchasable = useMemo(() => items.filter(isBudgetItem).sort((a, b) => a.name.localeCompare(b.name)), [items]);
  const bySlug = useMemo(() => new Map(items.map((item) => [item.slug, item])), [items]);
  const [cash, setCash] = useState(10000);
  const [selected, setSelected] = useState(["m4"]);
  const [group, setGroup] = useState<(typeof budgetGroups)[number][0]>("all");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(48);
  const groupMatch = (item: ToolItem) => group === "all" || group === item.kind || (group === "gear" && !["weapon", "ammo", "attachment", "vehicle"].includes(item.kind));
  const visibleItems = purchasable.filter((item) => groupMatch(item) && `${item.name} ${item.type} ${item.caliber}`.toLowerCase().includes(query.toLowerCase()));
  const selectedItems = selected.map((slug) => bySlug.get(slug)).filter((item): item is ToolItem => Boolean(item));
  const result = calculateBudget(cash, selectedItems);
  const toggle = (slug: string) => setSelected((current) => current.includes(slug) ? current.filter((item) => item !== slug) : current.length < 6 ? [...current, slug] : current);
  return <div className={styles.budgetWorkbench}>
    <section className={styles.inventoryPanel}><div className={styles.panelHead}><span>01 / choose items</span><h2>Build a price list</h2></div><label className={styles.cashField}><span>Current cash</span><input type="number" name="cash" inputMode="numeric" autoComplete="off" min={0} step={100} value={cash} onChange={(event) => setCash(Math.max(0, Number(event.target.value)))} /></label><div className={styles.filterChips} role="group" aria-label="Item groups">{budgetGroups.map(([value, label]) => <button type="button" className={group === value ? styles.chipActive : ""} onClick={() => { setGroup(value); setVisibleCount(48); }} key={value}>{label}</button>)}</div><ListToolbar value={query} onChange={(value) => { setQuery(value); setVisibleCount(48); }} resultCount={visibleItems.length} placeholder="Search items you can buy" /><RecordList items={visibleItems.slice(0, visibleCount)} selected={selected} onToggle={toggle} label="Items you can buy" />{visibleItems.length > visibleCount && <button type="button" className={styles.showMore} onClick={() => setVisibleCount((count) => count + 48)}>Show 48 more <span>{visibleCount} of {visibleItems.length}</span></button>}<p className={styles.formNote}><Info aria-hidden="true" /> {selected.length}/6 selected. $10,000 is the official starting balance. Item prices can change during Early Access.</p></section>
    <section className={styles.budgetOutput}><div className={styles.panelHead}><span>02 / your planned kit</span><h2>What it will cost</h2></div><div className={styles.selectedManifest}>{selectedItems.length ? selectedItems.map((item) => <button type="button" key={item.slug} onClick={() => toggle(item.slug)}><div>{item.image && <Image src={item.image} alt="" fill sizes="58px" />}</div><span><strong>{item.name}</strong><small>{item.type || item.kind}</small></span><b>{money(item.price)}</b><X aria-label={`Remove ${item.name}`} /></button>) : <p>No items selected.</p>}</div><div className={styles.budgetReadout}><div><small>Known item cost</small><strong>{money(result.loadoutCost)}</strong></div><div><small>Cash after purchase</small><strong>{money(result.cashRemaining)}</strong></div><div><small>Bank committed</small><strong>{result.bankUsed.toFixed(1)}%</strong></div><div><small>Full repeats at this price</small><strong>{result.livesAffordable}</strong></div></div><p className={styles.formNote}>{result.complete ? "Every selected item has a listed price." : "One or more selected items do not have a listed price, so they are left out of the total."} This planner does not predict match earnings or survival.</p></section>
  </div>;
}
