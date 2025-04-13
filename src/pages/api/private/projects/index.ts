import type { APIRoute } from 'astro';
import { v2 as cloudinary } from 'cloudinary';
import sanitizeHtml from 'sanitize-html';
import { db, Project, Image, sql } from 'astro:db';

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
      })
    );

    return new Response(JSON.stringify(projectsWithImageUrl), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Erreur GET /projects', err);
    return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des projets.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};


cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export const POST: APIRoute = async ({ request }) => {
  let public_id = '';
  try {
    const formData = await request.formData();

    // Récupération et nettoyage des champs
    const title = formData.get('title')?.toString().trim() || '';
    const subtitle = formData.get('subtitle')?.toString().trim() || '';
    const description = sanitizeHtml(formData.get('description')?.toString() || '',
          { allowedAttributes: {
            '*': ['class'], // Autorise class sur tous les éléments
          }});
    const tags = formData.get('tags')?.toString().trim() || '';
    const github = formData.get('github')?.toString().trim() || '';
    const website = formData.get('website')?.toString().trim() || '';
    const file = formData.get('file') as File | null;

    // Vérifications des champs obligatoires
    if (!title || !subtitle || !description || !tags || !file) {
      return new Response(JSON.stringify({ error: 'Tous les champs obligatoires doivent être remplis.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Upload de l'image
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: 'projects', 
          format: 'webp', 
          quality: 'auto:eco',
          transformation: [
            {
              width: 500,
              height: 500,
              crop: 'fill',        // fill le cadre 500x500
              gravity: 'auto',     
            },
          ], 
        }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }).end(buffer);
    });
    const id = Date.now(); // Génération d'un ID unique basé sur le timestamp
    // Sauvegarde en base de données
    await db.insert(Project).values({
      id,
      title,
      subtitle,
      description,
      tags,
      created_at: new Date(),
      ...(github && { github }),
      ...(website && { website }),

    });
    public_id = uploadResult.public_id; // Récupération du public_id pour la suppression éventuelle
    await db.insert(Image).values({
      projectId: id,
      url: uploadResult.secure_url,
      public_id: public_id,
      created_at: new Date(),
    });
    return new Response(JSON.stringify({ success: true, result: uploadResult }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error(err);
    await cloudinary.uploader.destroy(public_id);
    return new Response(JSON.stringify({ error: 'Erreur lors de l\'upload' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
