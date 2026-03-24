import { recoveryRepository } from '$lib/server/repositories/recovery.repository';
import { userRepository } from '$lib/server/repositories/user.repository';
import { emailService } from '$lib/server/services/email.service';
import { db } from '$lib/server/db';
import { account } from '$lib/server/db/schemas';
import { eq, and } from 'drizzle-orm';

export class RecoveryService {
	/**
	 * Request a password recovery — generates token, saves it, and sends email
	 * @param {string} email
	 * @returns {Promise<{success: boolean, message: string}>}
	 */
	async requestRecovery(email) {
		try {
			// Check if user exists
			const user = await userRepository.findByEmail(email);
			if (!user) {
				// Don't reveal whether the email exists for security
				return {
					success: true,
					message: 'Si el correo existe en nuestro sistema, recibirás un código de recuperación.'
				};
			}

			// Generate 6-digit token
			const token = Math.floor(100000 + Math.random() * 900000).toString();

			// Token expires in 15 minutes
			const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

			// Save token
			await recoveryRepository.createToken(email, token, expiresAt);

			// Send email
			await emailService.sendRecoveryEmail(email, token);

			return {
				success: true,
				message: 'Si el correo existe en nuestro sistema, recibirás un código de recuperación.'
			};
		} catch (error) {
			console.error('RecoveryService.requestRecovery error:', error);
			throw error;
		}
	}

	/**
	 * Verify a recovery token
	 * @param {string} email
	 * @param {string} token
	 * @returns {Promise<{valid: boolean, message: string}>}
	 */
	async verifyToken(email, token) {
		try {
			const record = await recoveryRepository.findToken(email);

			if (!record) {
				return { valid: false, message: 'No se encontró un código de recuperación para este correo.' };
			}

			if (new Date() > new Date(record.expiresAt)) {
				await recoveryRepository.deleteToken(email);
				return { valid: false, message: 'El código ha expirado. Solicita uno nuevo.' };
			}

			if (record.value !== token) {
				return { valid: false, message: 'El código ingresado es incorrecto.' };
			}

			return { valid: true, message: 'Código verificado correctamente.' };
		} catch (error) {
			console.error('RecoveryService.verifyToken error:', error);
			throw error;
		}
	}

	/**
	 * Reset a user's password after token verification
	 * @param {string} email
	 * @param {string} token
	 * @param {string} newPassword
	 * @returns {Promise<{success: boolean, message: string}>}
	 */
	async resetPassword(email, token, newPassword) {
		try {
			// Verify token first
			const verificationResult = await this.verifyToken(email, token);
			if (!verificationResult.valid) {
				return { success: false, message: verificationResult.message };
			}

			// Find user
			const user = await userRepository.findByEmail(email);
			if (!user) {
				return { success: false, message: 'Usuario no encontrado.' };
			}

			// Hash the new password using better-auth's crypto utility
			const { hashPassword } = await import('better-auth/crypto');
			const hashedPassword = await hashPassword(newPassword);

			// Update password in the account table (credential provider)
			await db
				.update(account)
				.set({
					password: hashedPassword,
					updatedAt: new Date()
				})
				.where(
					and(
						eq(account.userId, user.id),
						eq(account.providerId, 'credential')
					)
				);

			// Delete the used token
			await recoveryRepository.deleteToken(email);

			return { success: true, message: 'Contraseña actualizada exitosamente.' };
		} catch (error) {
			console.error('RecoveryService.resetPassword error:', error);
			throw error;
		}
	}
}

export const recoveryService = new RecoveryService();
