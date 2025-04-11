import type { APIRoute } from 'astro';
import { db, Project, Image, SelectProject, sql } from 'astro:db';
import sanitizeHtml from 'sanitize-html';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export const prerender = false;

// Supprimer un projet (et son image Cloudinary) 
export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!id) return new Response('ID manquant ou invalide', { status: 400 });

  try {
    const [image] = await db
      .select({ public_id: Image.public_id })
      .from(Image)
      .where(sql`projectId = ${id}`);

    if (image?.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await db.delete(SelectProject).where(sql`projectId = ${id}`);
    await db.delete(Image).where(sql`projectId = ${id}`);
    await db.delete(Project).where(sql`id = ${id}`);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Erreur DELETE /projects/[id]', err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
  }
};

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});


// Mettre à jour un projet
export const PUT: APIRoute = async ({ request, params }) => {
  const id = Number(params.id);
  if (!id) return new Response('ID manquant ou invalide', { status: 400 });

  try {
    const formData = await request.formData();

    // Champs texte
    const title = formData.get('title')?.toString().trim() || '';
    const subtitle = formData.get('subtitle')?.toString().trim() || '';
    const description = sanitizeHtml(formData.get('description')?.toString() || '');
    const tags = formData.get('tags')?.toString().trim() || '';
    const github = formData.get('github')?.toString().trim() || '';
    const website = formData.get('website')?.toString().trim() || '';
    const file = formData.get('file') as File | null;

    if (!title || !subtitle || !description || !tags) {
      return new Response(JSON.stringify({ error: 'Champs obligatoires manquants' }), {
        status: 400,
      });
    }

    // Si un nouveau fichier est fourni, on supprime l'ancien et on upload le nouveau
    if (file && file.size > 0) {
      // Récupération de l'ancienne image
      const [oldImage] = await db
        .select({ public_id: Image.public_id })
        .from(Image)
        .where(sql`projectId = ${id}`);

      // Suppression de l'image Cloudinary précédente
      if (oldImage?.public_id) {
        await cloudinary.uploader.destroy(oldImage.public_id);
      }

      // Upload de la nouvelle image
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'projects',
            format: 'webp',
            quality: 'auto:eco',
            transformation: [
              { width: 500, height: 500, crop: 'fill', gravity: 'auto' }
            ]
          },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        ).end(buffer);
      });

      // Mettre à jour l'image en base
      await db
        .update(Image)
        .set({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          created_at: new Date(),
        })
        .where(sql`projectId = ${id}`);
    }

    // Mise à jour du projet
    await db
      .update(Project)
      .set({
        title,
        subtitle,
        description,
        github,
        website,
        tags,
      })
      .where(sql`id = ${id}`);

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
  }
};

