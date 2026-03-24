import { db } from '$lib/server/db';
import { verification } from '$lib/server/db/schemas';
import { eq } from 'drizzle-orm';

export class RecoveryRepository {
	/**
	 * Create a recovery token for a given email
	 * @param {string} email - The user's email (used as identifier)
	 * @param {string} token - The 6-digit recovery code
	 * @param {Date} expiresAt - When the token expires
	 * @returns {Promise<any>}
	 */
	async createToken(email, token, expiresAt) {
		// Delete any existing tokens for this email first
		await this.deleteToken(email);

		const result = await db
			.insert(verification)
			.values({
				id: crypto.randomUUID(),
				identifier: email,
				value: token,
				expiresAt,
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.returning();
		return result[0];
	}

	/**
	 * Find the latest valid token for an email
	 * @param {string} email
	 * @returns {Promise<any>}
	 */
	async findToken(email) {
		const result = await db
			.select()
			.from(verification)
			.where(eq(verification.identifier, email))
			.limit(1);
		return result[0];
	}

	/**
	 * Delete all tokens for a given email
	 * @param {string} email
	 * @returns {Promise<void>}
	 */
	async deleteToken(email) {
		await db.delete(verification).where(eq(verification.identifier, email));
	}
}

export const recoveryRepository = new RecoveryRepository();
