import { db, SelectProject, sql } from 'astro:db';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { selectedIds } = await request.json();

    if (!Array.isArray(selectedIds)) {
      return new Response(JSON.stringify({ error: "selectedIds must be an array" }), { status: 400 });
    }

    // 1. Met à false tout ce qui est dans SelectProject
    await db
      .update(SelectProject)
      .set({ checked: false });

    // 2. Met à true les projets sélectionnés (s'ils existent déjà)
    await Promise.all(
      selectedIds.map(async (projectId) => {
        const [existing] = await db
          .select()
          .from(SelectProject)
          .where(sql`projectId = ${projectId}`);

        if (existing) {
          // Si la ligne existe déjà → update
          await db
            .update(SelectProject)
            .set({ checked: true })
            .where(sql`projectId = ${projectId}`);
        } else {
          // Sinon → insert
          await db.insert(SelectProject).values({ projectId, checked: true });
        }
      })
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Erreur API api/private/projects/checked:", err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}