import { db } from '$lib/server/db';
import { diametros } from '$lib/server/db/schemas';
import { eq } from 'drizzle-orm';

export class DiameterRepository {
	async findAll() {
		return await db.select().from(diametros);
	}

	async findById(id) {
		const result = await db.select().from(diametros).where(eq(diametros.idDiametro, id)).limit(1);
		return result[0];
	}

	async create(data) {
		const result = await db.insert(diametros).values(data).returning();
		return result[0];
	}

	async update(id, data) {
		const result = await db.update(diametros).set(data).where(eq(diametros.idDiametro, id)).returning();
		return result[0];
	}

	async delete(id) {
		const result = await db.delete(diametros).where(eq(diametros.idDiametro, id)).returning();
		return result[0];
	}
}

export const diameterRepository = new DiameterRepository();
