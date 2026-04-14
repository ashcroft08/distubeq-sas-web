import { db } from '$lib/server/db';
import { categorias } from '$lib/server/db/schemas';
import { eq } from 'drizzle-orm';

export class CategoriasRepository {
    async findAll() {
        return await db.query.categorias.findMany({
            orderBy: (categorias, { asc }) => [asc(categorias.nombre)]
        });
    }

    async findById(id) {
        return await db.query.categorias.findFirst({
            where: eq(categorias.id_categoria, id)
        });
    }

    async create(data) {
        const [newCategory] = await db.insert(categorias).values(data).returning();
        return newCategory;
    }

    async update(id, data) {
        const [updatedCategory] = await db.update(categorias)
            .set({ ...data, updated_at: new Date() })
            .where(eq(categorias.id_categoria, id))
            .returning();
        return updatedCategory;
    }

    async delete(id) {
        const [deletedCategory] = await db.delete(categorias)
            .where(eq(categorias.id_categoria, id))
            .returning();
        return deletedCategory;
    }
}

export const categoriasRepository = new CategoriasRepository();
