import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const load = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/login');
	}
	return {
		user: {
			id: locals.user.id,
			name: locals.user.name,
			email: locals.user.email
		},
		origin: env.ORIGIN || '/'
	};
};
