import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session) {
		event.locals.user = session.user;
		event.locals.session = session.session;
	} else {
		event.locals.user = null;
		event.locals.session = null;
	}

	// Detectar sesión expirada: si está en /admin/* sin sesión pero con cookie de sesión
	// (significa que la sesión expiró, no que nunca inició sesión)
	const isAdminRoute = event.url.pathname.startsWith('/admin');
	const hasSessionCookie = event.request.headers.get('cookie')?.includes('session_token');

	if (isAdminRoute && !session && hasSessionCookie) {
		throw redirect(303, '/login?expired=true');
	}

	const response = await resolve(event);

	// Headers de seguridad
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	return response;
};
