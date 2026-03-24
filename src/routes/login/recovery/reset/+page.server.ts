import { recoveryService } from '$lib/server/services/recovery.service';
import { fail, redirect } from '@sveltejs/kit';
import { isRedirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
	const email = url.searchParams.get('email') || '';
	return { email };
};

export const actions = {
	resetPassword: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const token = formData.get('token');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		if (!email || !token || !password || !confirmPassword) {
			return fail(400, {
				message: 'Todos los campos son obligatorios.',
				success: false,
				email: email?.toString() || ''
			});
		}

		if (typeof email !== 'string' || typeof token !== 'string' || typeof password !== 'string' || typeof confirmPassword !== 'string') {
			return fail(400, {
				message: 'Datos inválidos.',
				success: false,
				email: ''
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				message: 'Las contraseñas no coinciden.',
				success: false,
				email
			});
		}

		if (password.length < 6) {
			return fail(400, {
				message: 'La contraseña debe tener al menos 6 caracteres.',
				success: false,
				email
			});
		}

		try {
			const result = await recoveryService.resetPassword(email, token, password);

			if (result.success) {
				return { success: true, message: result.message };
			} else {
				return fail(400, { message: result.message, success: false, email });
			}
		} catch (error) {
			if (isRedirect(error)) {
				throw error;
			}
			console.error('Error en reset password action:', error);
			return fail(500, {
				message: 'Ocurrió un error en el servidor. Intente más tarde.',
				success: false,
				email: email?.toString() || ''
			});
		}
	}
};
