import { authService } from '$lib/server/services/auth.service';
import { loginRateLimiter } from '$lib/server/security/login-rate-limiter';
import { fail, redirect } from '@sveltejs/kit';
import { isRedirect } from '@sveltejs/kit';

/**
 * Mapa de códigos de error de better-auth a mensajes amigables en español.
 */
const ERROR_MESSAGES: Record<string, { message: string; type: 'credentials' | 'server' }> = {
	INVALID_EMAIL_OR_PASSWORD: {
		message: 'El correo o la contraseña son incorrectos. Verifique sus datos e intente nuevamente.',
		type: 'credentials'
	},
	USER_NOT_FOUND: {
		message: 'No existe una cuenta registrada con este correo electrónico.',
		type: 'credentials'
	},
	INVALID_PASSWORD: {
		message: 'La contraseña ingresada es incorrecta. Intente nuevamente.',
		type: 'credentials'
	},
	INVALID_EMAIL: {
		message: 'El formato del correo electrónico no es válido.',
		type: 'credentials'
	},
	TOO_MANY_REQUESTS: {
		message: 'Demasiados intentos fallidos. Por favor, espere unos minutos antes de volver a intentar.',
		type: 'server'
	},
	ACCOUNT_LOCKED: {
		message: 'Su cuenta ha sido bloqueada temporalmente por seguridad. Intente más tarde.',
		type: 'server'
	}
};

export const load = async ({ locals, url }) => {
	// Si ya hay sesión, no tiene sentido mostrar el login
	if (locals.session) {
		throw redirect(303, '/admin');
	}

	return {
		expired: url.searchParams.get('expired') === 'true'
	};
};

export const actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		// Validación 1: Que existan y sean strings
		if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, {
				message: 'El correo y la contraseña son obligatorios.',
				errorType: 'credentials' as const
			});
		}

		// Validación 2: Formato de email básico
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, {
				message: 'Ingrese un correo electrónico válido.',
				errorType: 'credentials' as const
			});
		}

		// Validación 3: Rate limiting — verificar antes de intentar autenticación
		const rateCheck = loginRateLimiter.check(email);
		if (!rateCheck.allowed) {
			return fail(429, {
				message: rateCheck.message!,
				errorType: 'server' as const
			});
		}

		try {
			const response = await authService.login(email, password, request);

			if (response.status === 200) {
				// Login exitoso — resetear contador de intentos
				loginRateLimiter.resetAttempts(email);
				throw redirect(303, '/admin');
			} else {
				// Registrar intento fallido
				loginRateLimiter.recordFailedAttempt(email);
				const afterFail = loginRateLimiter.check(email);

				let message = 'Credenciales incorrectas. Verifique sus datos.';
				if (afterFail.message) {
					message += ` ${afterFail.message}`;
				}

				return fail(400, {
					message,
					errorType: 'credentials' as const
				});
			}
		} catch (error: any) {
			// SvelteKit maneja los redirects lanzándolos como errores.
			if (isRedirect(error)) {
				throw error;
			}

			// Error con código estructurado de auth.service
			if (error?.code && ERROR_MESSAGES[error.code]) {
				// Registrar intento fallido para errores de credenciales
				const mapped = ERROR_MESSAGES[error.code];
				if (mapped.type === 'credentials') {
					loginRateLimiter.recordFailedAttempt(email);
					const afterFail = loginRateLimiter.check(email);

					let message = mapped.message;
					if (afterFail.message) {
						message += ` ${afterFail.message}`;
					}

					return fail(error.statusCode || 400, {
						message,
						errorType: mapped.type
					});
				}

				return fail(error.statusCode || 400, {
					message: mapped.message,
					errorType: mapped.type
				});
			}

			// Error de red o conexión
			if (
				error?.code === 'ECONNREFUSED' ||
				error?.code === 'ENOTFOUND' ||
				error?.code === 'ETIMEDOUT' ||
				error?.message?.includes('fetch failed')
			) {
				return fail(503, {
					message: 'No se pudo conectar con el servidor. Verifique su conexión a Internet e intente nuevamente.',
					errorType: 'server' as const
				});
			}

			// Si es un error real desconocido (ej. se cayó la base de datos)
			console.error('Error en action de login:', error);
			return fail(500, {
				message: 'Ocurrió un error inesperado en el servidor. Por favor, intente nuevamente en unos minutos.',
				errorType: 'server' as const
			});
		}
	}
};