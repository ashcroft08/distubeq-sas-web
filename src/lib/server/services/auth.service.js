import { auth } from '$lib/server/auth';
import { userRepository } from '$lib/server/repositories/user.repository';
import { env } from '$env/dynamic/private';

export class AuthService {
	/**
	 * Login a user using better-auth
	 * @param {string} email
	 * @param {string} password
	 * @param {any} request
	 * @returns {Promise<any>}
	 */
	async login(email, password, request) {
		try {
			// Check if it's the admin from .env
			if (email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD) {
				let user = await userRepository.findByEmail(email);
				if (!user) {
					// Register admin via better-auth API to ensure account record is created
					await auth.api.signUpEmail({
						body: {
							email: env.ADMIN_EMAIL,
							password: env.ADMIN_PASSWORD,
							name: env.ADMIN_NAME || 'Administrador'
						}
					});
				}
			}

			// Use better-auth signIn
			const response = await auth.api.signInEmail({
				body: {
					email,
					password
				},
				asResponse: true
			});

			if (response.status !== 200) {
				// Parse the error body from better-auth
				let errorCode = 'UNKNOWN_ERROR';
				try {
					const errorBody = await response.json();
					errorCode = errorBody?.code || errorBody?.message || 'UNKNOWN_ERROR';
				} catch {
					// Could not parse JSON — treat as unknown
				}

				const err = new Error(errorCode);
				// @ts-ignore
				err.code = errorCode;
				// @ts-ignore
				err.statusCode = response.status;
				throw err;
			}

			return response;
		} catch (error) {
			console.error('AuthService.login error:', error);
			throw error;
		}
	}

	/**
	 * Logout a user
	 * @param {any} request
	 * @returns {Promise<any>}
	 */
	async logout(request) {
		return await auth.api.signOut({
			headers: request.headers
		});
	}
}

export const authService = new AuthService();
