import { authService } from '$lib/server/services/auth.service';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (locals.session) {
		throw redirect(303, '/admin');
	}
	return {};
};

export const actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || !password) {
			return fail(400, { message: 'Email and password are required' });
		}

		try {
			const response = await authService.login(email.toString(), password.toString(), request);
			
			// better-auth handles the cookies via response headers if asResponse is true
			// and plugins like sveltekitCookies are used. 
			// However, since we are in an action, we might need a more manual approach if not using the middleware.
			// Let's assume the authService handles it or we use the better-auth client in the frontend.
			
			// If we use asResponse: true, we can return the response headers.
			if (response.status === 200) {
				throw redirect(303, '/admin');
			} else {
				const error = await response.json();
				return fail(400, { message: error.message || 'Error al iniciar sesión' });
			}
		} catch (error) {
			if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
				throw error;
			}
			console.error('Login action error:', error);
			return fail(500, { message: 'Internal server error' });
		}
	}
};
