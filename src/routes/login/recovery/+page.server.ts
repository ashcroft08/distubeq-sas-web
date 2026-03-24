import { recoveryService } from '$lib/server/services/recovery.service';
import { fail } from '@sveltejs/kit';

export const actions = {
	requestRecovery: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');

		if (!email || typeof email !== 'string') {
			return fail(400, { message: 'El correo electrónico es obligatorio.', success: false });
		}

		try {
			const result = await recoveryService.requestRecovery(email);
			return { success: result.success, message: result.message, email };
		} catch (error) {
			console.error('Error en recovery action:', error);
			return fail(500, { message: 'Ocurrió un error en el servidor. Intente más tarde.', success: false });
		}
	}
};
