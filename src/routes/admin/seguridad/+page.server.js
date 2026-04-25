import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { userRepository } from '$lib/server/repositories/user.repository';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	return {
		userEmail: locals.user.email
	};
};

export const actions = {
	updateEmail: async ({ request, locals }) => {
		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword');
		const newEmail = formData.get('newEmail');

		if (!currentPassword || !newEmail) {
			return fail(400, { message: 'Todos los campos son obligatorios' });
		}

		try {
			// Get current session
			const session = await auth.api.getSession({
				headers: request.headers
			});

			if (!session) return fail(401, { message: 'No autorizado' });

			// 1. Verify current password
			// In better-auth, we can verify by trying a sign-in or using internal verifyPassword if exposed
			// A simple way is to use signInEmail (internal) to check if it matches
			try {
				await auth.api.signInEmail({
					body: {
						email: session.user.email,
						password: String(currentPassword)
					}
				});
			} catch (e) {
				return fail(400, { message: 'Contraseña actual incorrecta', success: false });
			}

			// 2. Update email in DB using repository
			// Note: better-auth might have its own logic for email changes (verification etc)
			// but for this admin panel we'll do it directly if simpler
			await userRepository.update(session.user.id, { email: String(newEmail) });

			return { success: true, message: 'Email actualizado correctamente' };
		} catch (error) {
			console.error('Error updating email:', error);
			return fail(500, { message: 'Ocurrió un error al actualizar el email' });
		}
	},

	updatePassword: async ({ request, locals }) => {
		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword');
		const newPassword = formData.get('newPassword');
		const confirmPassword = formData.get('confirmPassword');

		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, { message: 'Todos los campos son obligatorios' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { message: 'Las contraseñas nuevas no coinciden' });
		}

		try {
			// Use better-auth changePassword API
			// This handles current password verification and hashed replacement
			const response = await auth.api.changePassword({
				body: {
					currentPassword: String(currentPassword),
					newPassword: String(newPassword),
					revokeOtherSessions: true
				},
				headers: request.headers,
				asResponse: true
			});

			if (response.status !== 200) {
				const error = await response.json();
				return fail(400, { 
					message: error.message || 'Error al cambiar la contraseña', 
					success: false 
				});
			}

			return { success: true, message: 'Contraseña actualizada correctamente' };
		} catch (error) {
			console.error('Error updating password:', error);
			return fail(500, { message: 'Ocurrió un error al actualizar la contraseña' });
		}
	}
};
