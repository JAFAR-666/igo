import { query } from "../db/pool.js";

export async function listCategories() {
  const result = await query<{
    id: string;
    slug: string;
    name: string;
    icon: string;
    description: string;
  }>(
    `
      SELECT id, slug, name, icon, description
      FROM categories
      WHERE is_active = TRUE
      ORDER BY name ASC
    `
  );
  return result.rows;
}
