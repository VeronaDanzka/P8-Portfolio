import type { APIRoute } from 'astro';
import { v2 as cloudinary } from 'cloudinary';
import sanitizeHtml from 'sanitize-html';
import { db, Project, Image } from 'astro:db';

export const prerender = false;

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    // Récupération et nettoyage des champs
    const title = formData.get('title')?.toString().trim() || '';
    const subtitle = formData.get('subtitle')?.toString().trim() || '';
    const description = sanitizeHtml(formData.get('description')?.toString() || '');
    const tags = formData.get('tags')?.toString().trim() || '';
    const github = formData.get('github')?.toString().trim() || '';
    const website = formData.get('website')?.toString().trim() || '';
    const file = formData.get('file') as File | null;

    // Vérifications des champs obligatoires
    if (!title || !subtitle || !description || !tags || !file || !github || !website) {
      return new Response(JSON.stringify({ error: 'Tous les champs obligatoires doivent être remplis.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Upload de l'image
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'projects' }, (err, result) => {
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
      github,
      website,
      tags,
      created_at: new Date(),
      // Tu peux ajouter des colonnes comme : imageUrl: uploadResult.secure_url
    });
    await db.insert(Image).values({
      projectId: id,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      created_at: new Date(),
    });
    return new Response(JSON.stringify({ success: true, result: uploadResult }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Erreur lors de l\'upload' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
