import { db } from '$lib/server/db/index.js';
import { config_empresa, horarios } from '$lib/server/db/schemas/empresa.js';
import { eq, asc } from 'drizzle-orm';

export class EmpresaRepository {
    // Config Related
    async getConfig() {
        const result = await db.select().from(config_empresa).limit(1);
        if (result.length === 0) {
            // Initialize if not exists
            const [newConfig] = await db.insert(config_empresa).values({
                correo_corporativo: ''
            }).returning();
            return newConfig;
        }
        return result[0];
    }

    async updateConfig(data) {
        const config = await this.getConfig();
        const [updated] = await db.update(config_empresa)
            .set({ ...data, updated_at: new Date() })
            .where(eq(config_empresa.id_configuracion, config.id_configuracion))
            .returning();
        return updated;
    }

    // Horarios Related
    async findAllHorarios() {
        return await db.select().from(horarios).orderBy(asc(horarios.orden));
    }

    async findHorarioById(id) {
        const result = await db.select().from(horarios).where(eq(horarios.id_horario, id));
        return result[0];
    }

    async createHorario(data) {
        const [newHorario] = await db.insert(horarios).values(data).returning();
        return newHorario;
    }

    async updateHorario(id, data) {
        const [updated] = await db.update(horarios)
            .set({ ...data, updated_at: new Date() })
            .where(eq(horarios.id_horario, id))
            .returning();
        return updated;
    }

    async deleteHorario(id) {
        const [deleted] = await db.delete(horarios).where(eq(horarios.id_horario, id)).returning();
        return deleted;
    }
}

export const empresaRepository = new EmpresaRepository();
