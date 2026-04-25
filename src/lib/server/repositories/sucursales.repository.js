import { db } from '$lib/server/db/index.js';
import { sucursales } from '$lib/server/db/schemas/sucursales.js';
import { eq, desc, and } from 'drizzle-orm';

export class SucursalesRepository {
    async findAll() {
        return await db.select().from(sucursales).orderBy(desc(sucursales.es_matriz), desc(sucursales.created_at));
    }

    async findAllActive() {
        return await db.select().from(sucursales)
            .where(eq(sucursales.estado, true))
            .orderBy(desc(sucursales.es_matriz), desc(sucursales.created_at));
    }

    async findById(id) {
        const result = await db.select().from(sucursales).where(eq(sucursales.id_sucursal, id));
        return result[0];
    }

    /**
     * Before creating/updating a branch as "matriz", 
     * remove the flag from any other branch so there's always only one.
     */
    async _ensureUniqueMatriz(excludeId = null) {
        if (excludeId) {
            await db.update(sucursales)
                .set({ es_matriz: false })
                .where(and(eq(sucursales.es_matriz, true), eq(sucursales.id_sucursal, excludeId) === false ? undefined : undefined));
        }
        // Simpler: just unset all, then set the one we want
        await db.update(sucursales).set({ es_matriz: false }).where(eq(sucursales.es_matriz, true));
    }

    async create(data) {
        if (data.es_matriz) {
            await this._ensureUniqueMatriz();
        }
        const result = await db.insert(sucursales).values(data).returning();
        return result[0];
    }

    async update(id, data) {
        if (data.es_matriz) {
            await this._ensureUniqueMatriz();
        }
        const result = await db.update(sucursales)
            .set({ ...data, updated_at: new Date() })
            .where(eq(sucursales.id_sucursal, id))
            .returning();
        return result[0];
    }

    async delete(id) {
        const result = await db.delete(sucursales).where(eq(sucursales.id_sucursal, id)).returning();
        return result[0];
    }
}

export const sucursalesRepository = new SucursalesRepository();
