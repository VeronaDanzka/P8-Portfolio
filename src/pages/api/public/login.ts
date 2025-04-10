import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';

export const prerender = false; // important pour les endpoints dynamiques

const SECRET = import.meta.env.JWT_SECRET || 'dev-secret';

export const POST: APIRoute = async ({ request }) => {
  const { username, password } = await request.json();

  // Auth de test
  if (username === import.meta.env.USER && password === import.meta.env.PASSWORD) {
    const token = jwt.sign({ username }, SECRET, {
      expiresIn: '24h',
    });
    const headers = new Headers();
    headers.append('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax`);
    headers.append('Set-Cookie', `visibleTokenLoggedIn=true; Path=/; SameSite=Lax`);
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  }

  return new Response(JSON.stringify({ success: false, message: 'Identifiants invalides' }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};