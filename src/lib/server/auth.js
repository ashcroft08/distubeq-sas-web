import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true },
	session: {
		expiresIn: 60 * 60 * 8, // 8 horas (en segundos)
		updateAge: 60 * 60, // Renueva la sesión si pasa 1 hora de actividad
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5 // Cache de 5 minutos para evitar consultas excesivas a DB
		}
	},
	advanced: {
		cookiePrefix: 'distubeq',
		defaultCookieAttributes: {
			httpOnly: true,
			sameSite: 'lax',
			secure: env.NODE_ENV === 'production',
			path: '/'
		}
	},
	plugins: [sveltekitCookies(getRequestEvent)] // make sure this is the last plugin in the array
});
