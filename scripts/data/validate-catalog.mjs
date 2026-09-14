import { access, readFile } from "node:fs/promises";
import path from "node:path";

const catalogPath = path.join(process.cwd(), "src", "data", "catalog", "items.json");
const allowedKinds = new Set(["weapon", "ammo", "attachment", "vehicle", "armor", "medical", "storage", "throwable", "explosive", "utility", "supplies", "deployable", "melee", "other"]);
const allowedStatuses = new Set(["verified", "observed", "community", "unknown"]);
const relationFields = ["ammoIds", "attachmentIds", "compatibleWeaponIds"];

function fail(errors) {
  console.error(`Catalog validation failed with ${errors.length} issue${errors.length === 1 ? "" : "s"}:`);
  for (const error of errors.slice(0, 50)) console.error(`- ${error}`);
  if (errors.length > 50) console.error(`- …and ${errors.length - 50} more`);
  process.exitCode = 1;
}

const items = JSON.parse(await readFile(catalogPath, "utf8"));
const errors = [];
if (!Array.isArray(items)) errors.push("items.json must contain an array");

const ids = new Set();
const slugs = new Set();
for (const [index, item] of items.entries()) {
  const label = item?.slug || item?.id || `record ${index}`;
  if (!item || typeof item !== "object") {
    errors.push(`record ${index} is not an object`);
    continue;
  }
  for (const field of ["id", "slug", "name", "kind", "summary", "dataStatus", "dataSource", "sourceUrl", "patchVersion", "lastChecked"]) {
    if (typeof item[field] !== "string" || !item[field].trim()) errors.push(`${label}: ${field} must be a non-empty string`);
  }
  if (ids.has(item.id)) errors.push(`${label}: duplicate id ${item.id}`);
  if (slugs.has(item.slug)) errors.push(`${label}: duplicate slug ${item.slug}`);
  ids.add(item.id);
  slugs.add(item.slug);
  if (!allowedKinds.has(item.kind)) errors.push(`${label}: unsupported kind ${item.kind}`);
  if (!allowedStatuses.has(item.dataStatus)) errors.push(`${label}: unsupported dataStatus ${item.dataStatus}`);
  if (!item.stats || typeof item.stats !== "object") errors.push(`${label}: stats must be an object`);
  for (const field of relationFields) if (!Array.isArray(item[field])) errors.push(`${label}: ${field} must be an array`);
}

for (const item of items) {
  for (const field of relationFields) {
    for (const slug of item[field] || []) if (!slugs.has(slug)) errors.push(`${item.slug}: ${field} references missing slug ${slug}`);
  }
  if (item.image) {
    const imagePath = path.join(process.cwd(), "public", item.image.replace(/^\/+/, ""));
    try {
      await access(imagePath);
    } catch {
      errors.push(`${item.slug}: image does not exist at ${item.image}`);
    }
  }
}

if (errors.length) fail(errors);
else {
  const counts = Object.fromEntries([...allowedStatuses].map((status) => [status, items.filter((item) => item.dataStatus === status).length]));
  console.log(`Catalog validation passed: ${items.length} records; ${JSON.stringify(counts)}`);
}
