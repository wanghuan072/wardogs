import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const SOURCE_URL = "https://wardogs.zone/database";
const SNAPSHOT_DATE = "2026-09-09";
const SNAPSHOT_VERSION = "Pre-Early Access beta snapshot";
const OUTPUT_DIR = path.join(process.cwd(), "src", "data", "catalog");
const IMAGE_DIR = path.join(process.cwd(), "public", "images", "items");

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractItems(html) {
  const scripts = [...html.matchAll(/<script>self\.__next_f\.push\((\[1,"[\s\S]*?"\])\)<\/script>/g)];
  const payload = scripts
    .map((match) => JSON.parse(match[1])[1])
    .find((value) => value.includes('"items":[{"id"'));

  if (!payload) throw new Error("Could not locate the public database payload.");

  const marker = '"items":';
  const start = payload.indexOf('"items":[{"id"') + marker.length;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < payload.length; index += 1) {
    const char = payload[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }

    if (char === '"') inString = true;
    else if (char === "[") depth += 1;
    else if (char === "]") {
      depth -= 1;
      if (depth === 0) return JSON.parse(payload.slice(start, index + 1));
    }
  }

  throw new Error("The database payload ended before the items array closed.");
}

function uniqueSlug(item, used) {
  const base = slugify(item.name || item.id) || slugify(item.id);
  const key = used.has(base) ? `${base}-${slugify(item.id)}` : base;
  used.add(key);
  return key;
}

function summarize(item) {
  const price = typeof item.price === "number" ? ` Recorded vendor cost: $${item.price.toLocaleString("en-US")}.` : "";
  if (item.kind === "weapon") {
    return `${item.caliber || "Caliber unconfirmed"} ${String(item.type || "weapon").toLowerCase()} recorded in the pre-release WARDOGS dataset.${price}`;
  }
  if (item.kind === "ammo") {
    return `${item.caliber || "Unconfirmed caliber"} ${item.ammoType || "ammunition"} with ${item.fitsWeapons?.length || 0} recorded weapon connection${item.fitsWeapons?.length === 1 ? "" : "s"}.${price}`;
  }
  if (item.kind === "attachment") {
    return `${item.attachSlot || "Weapon"} attachment with compatibility recorded for ${item.fitsWeapons?.length || 0} weapon${item.fitsWeapons?.length === 1 ? "" : "s"}.${price}`;
  }
  if (item.kind === "vehicle") {
    return `${item.type || "Vehicle"} configured for ${item.role || "combined-arms"} play.${price}`;
  }
  return `${item.type || item.category || item.kind} field item recorded in the community beta snapshot.${price}`;
}

function normalize(item, slug, slugById) {
  const attachmentIds = (item.attachmentSlots || []).flatMap((group) => group.items || []);
  const vehicle = item.vehicle || {};
  const stats = {
    damage: item.damage ?? item.baseDamage ?? null,
    rpm: item.rpm ?? null,
    muzzleVelocity: item.muzzleVelocity ?? null,
    effectiveRange: item.effectiveRange ?? null,
    magazineSize: item.magRounds ?? null,
    recoil: item.baseAttrs?.vRecoil ?? null,
    accuracy: item.accuracy ?? item.baseAttrs?.accuracy ?? null,
    penetration: item.penetration ?? item.armorPenetration ?? null,
    seats: vehicle.seats ?? null,
    passengers: vehicle.passengers ?? null,
    maxSpeed: vehicle.maxSpeed ?? null,
    maxFuel: vehicle.maxFuel ?? null,
    rangeKm: vehicle.rangeKm ?? null,
    trunkSlots: vehicle.trunkSlots ?? null,
  };

  return {
    id: item.id,
    slug,
    name: item.name,
    kind: item.kind,
    category: item.category || null,
    type: item.type || null,
    role: item.role || null,
    slot: item.slot || item.attachSlot || null,
    caliber: item.caliber || null,
    ammoType: item.ammoType || null,
    price: typeof item.price === "number" ? item.price : null,
    weight: typeof item.weight === "number" ? item.weight : null,
    image: item.icon ? `/images/items/${slug}${path.extname(item.icon) || ".png"}` : null,
    summary: summarize(item),
    stats,
    fireModes: item.fireModes || (item.fireMode ? [item.fireMode] : []),
    weapons: vehicle.weapons || [],
    countermeasures: vehicle.countermeasures || [],
    ammoIds: (item.ammo || []).map((id) => slugById.get(id)).filter(Boolean),
    attachmentIds: attachmentIds.map((id) => slugById.get(id)).filter(Boolean),
    compatibleWeaponIds: (item.fitsWeapons || []).map((id) => slugById.get(id)).filter(Boolean),
    statEffects: item.statMods || {},
    observedFacts: Array.isArray(item.description) ? item.description : [],
    dataStatus: "community",
    dataSource: "Community game-file snapshot; verify against launch build",
    sourceUrl: SOURCE_URL,
    patchVersion: SNAPSHOT_VERSION,
    lastChecked: SNAPSHOT_DATE,
  };
}

async function downloadIcon(source, destination) {
  try {
    await access(destination);
    return "cached";
  } catch {}

  const response = await fetch(new URL(source, SOURCE_URL));
  if (!response.ok) throw new Error(`Icon request failed (${response.status})`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  return "downloaded";
}

async function main() {
  const response = await fetch(SOURCE_URL);
  if (!response.ok) throw new Error(`Database request failed (${response.status})`);
  const rawItems = extractItems(await response.text());
  const used = new Set();
  const slugById = new Map();

  for (const item of rawItems) slugById.set(item.id, uniqueSlug(item, used));
  const items = rawItems.map((item) => normalize(item, slugById.get(item.id), slugById));

  await mkdir(OUTPUT_DIR, { recursive: true });
  await mkdir(IMAGE_DIR, { recursive: true });
  await writeFile(
    path.join(OUTPUT_DIR, "items.json"),
    `${JSON.stringify(items, null, 2)}\n`,
    "utf8",
  );

  const iconJobs = rawItems
    .filter((item) => item.icon)
    .map((item) => ({
      source: item.icon,
      destination: path.join(IMAGE_DIR, `${slugById.get(item.id)}${path.extname(item.icon) || ".png"}`),
    }));

  let cursor = 0;
  let completed = 0;
  async function worker() {
    while (cursor < iconJobs.length) {
      const job = iconJobs[cursor++];
      try {
        await downloadIcon(job.source, job.destination);
        completed += 1;
      } catch (error) {
        console.warn(`Skipped ${job.source}: ${error.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: 12 }, worker));
  console.log(`Wrote ${items.length} records and resolved ${completed}/${iconJobs.length} icons.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
