import { defineMiddleware } from 'astro:middleware';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export const prerender = false;
const SECRET = import.meta.env.JWT_SECRET || 'dev-secret';

export const onRequest = defineMiddleware(async ({ request, redirect }, next) => {
  const { pathname } = new URL(request.url);

  // Cibler uniquement les requêtes vers les endpoints API privés
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/public/')) {
    const rawCookie = request.headers.get('cookie') || '';
    const cookies = cookie.parse(rawCookie);
    const token = cookies.token;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      jwt.verify(token, SECRET);
    } catch {
      return new Response(JSON.stringify({ error: 'Jeton invalide' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return next();
});
