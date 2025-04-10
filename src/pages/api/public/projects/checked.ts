import type { APIRoute } from 'astro';
import { db, Project, Image, SelectProject, sql } from 'astro:db';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    // On récupère tous les projets
    const projects = await db.select().from(Project);

    // Pour chaque projet, on récupère l'image associée (une seule) → juste l'URL
    const projectsWithImageUrl = await Promise.all(
      projects.map(async (project) => {
        const [image] = await db
          .select()
          .from(Image)
          .where(sql`projectId = ${project.id}`);

        return {
          ...project,
          imageUrl: image?.url ?? null,
        };
      }));
    // On récupère tous les projets sélectionnés
    const selectedProjects = await db
        .select({ projectId: SelectProject.projectId })
        .from(SelectProject)
        .where(sql`checked = true`);
    // On filtre les projets pour ne garder que ceux qui sont sélectionnés
    const selectedIds = selectedProjects.map((project) => project.projectId);
    const selectedProjectsArray = projectsWithImageUrl.filter((project) =>
      selectedIds.includes(project.id)
    );
    return new Response(JSON.stringify(selectedProjectsArray), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    } catch (err) {
        console.error('Erreur GET /public/projects/checked', err);
        return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des projets.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        });
    }
}