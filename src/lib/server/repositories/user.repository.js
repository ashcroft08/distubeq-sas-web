import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schemas';
import { eq } from 'drizzle-orm';

export class UserRepository {
	/**
	 * Find a user by email
	 * @param {string} email
	 * @returns {Promise<any>}
	 */
	async findByEmail(email) {
		const result = await db.select().from(user).where(eq(user.email, email)).limit(1);
		return result[0];
	}

	/**
	 * Create a new user
	 * @param {any} data
	 * @returns {Promise<any>}
	 */
	async create(data) {
		const result = await db.insert(user).values(data).returning();
		return result[0];
	}

	/**
	 * Update a user
	 * @param {string} id
	 * @param {any} data
	 * @returns {Promise<any>}
	 */
	async update(id, data) {
		const result = await db.update(user).set(data).where(eq(user.id, id)).returning();
		return result[0];
	}
}

export const userRepository = new UserRepository();
