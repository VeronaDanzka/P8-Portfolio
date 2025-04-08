import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = () => {
    const headers = new Headers();
    headers.append('Set-Cookie', 'token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');
    headers.append('Set-Cookie', 'visibleTokenLoggedIn=; Path=/; Max-Age=0; SameSite=Lax');
    headers.set('Content-Type', 'application/json');
    headers.set('Location', '/');
    return new Response(null, {
        status: 302,
        headers,
    });
};