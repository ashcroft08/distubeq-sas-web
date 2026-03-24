import { authService } from '$lib/server/services/auth.service';
import { fail, redirect } from '@sveltejs/kit';
// Importamos isRedirect para un manejo de errores más limpio
import { isRedirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	// Si ya hay sesión, no tiene sentido mostrar el login
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

		// Validación 1: Que existan y sean strings (evita que envíen archivos)
		if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, { message: 'El correo y la contraseña son obligatorios.' });
		}

		try {
			// Nota: Dependiendo de tu authService, puede que necesites pasarle 
			// todo el objeto `event` o el objeto `cookies` para que setee la sesión correctamente.
			const response = await authService.login(email, password, request);

			if (response.status === 200) {
				// Login exitoso
				throw redirect(303, '/admin');
			} else {
				// Parseamos el error del backend
				const error = await response.json();
				return fail(400, { message: error.message || 'Credenciales incorrectas. Verifique sus datos.' });
			}
		} catch (error) {
			// SvelteKit maneja los redirects lanzándolos como errores.
			// Usamos isRedirect() para dejarlo pasar y que haga la redirección.
			if (isRedirect(error)) {
				throw error;
			}

			// Si es un error real (ej. se cayó la base de datos)
			console.error('Error en action de login:', error);
			return fail(500, { message: 'Ocurrió un error en el servidor. Intente más tarde.' });
		}
	}
};