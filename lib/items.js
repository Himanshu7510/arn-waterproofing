import 'server-only';
import { COLLECTIONS, pickFields, slugify } from './schema';

export function validateItem(collection, body) {
  const def = COLLECTIONS[collection];
  if (!def) throw Object.assign(new Error('Unknown collection'), { status: 404 });
  const data = pickFields(def.fields, body);
  for (const f of def.fields) {
    if (f.required && !String(data[f.name] ?? '').trim()) throw Object.assign(new Error(`${f.label} is required`), { status: 400 });
  }
  return data;
}

export async function uniqueSlug(sql, collection, wanted, excludeId = 0) {
  const base = slugify(wanted) || 'item';
  let slug = base;
  for (let i = 2; i < 100; i++) {
    const [hit] = await sql`SELECT id FROM items WHERE collection = ${collection} AND data->>'slug' = ${slug} AND id <> ${excludeId}`;
    if (!hit) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}
