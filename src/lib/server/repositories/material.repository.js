import { db } from '$lib/server/db';
import { materiales } from '$lib/server/db/schemas';
import { eq } from 'drizzle-orm';

export class MaterialRepository {
	async findAll() {
		return await db.select().from(materiales);
	}

	async findById(id) {
		const result = await db.select().from(materiales).where(eq(materiales.idMaterial, id)).limit(1);
		return result[0];
	}

	async create(data) {
		const result = await db.insert(materiales).values(data).returning();
		return result[0];
	}

	async update(id, data) {
		const result = await db.update(materiales).set(data).where(eq(materiales.idMaterial, id)).returning();
		return result[0];
	}

	async delete(id) {
		const result = await db.delete(materiales).where(eq(materiales.idMaterial, id)).returning();
		return result[0];
	}
}

export const materialRepository = new MaterialRepository();
