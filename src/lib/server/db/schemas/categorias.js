import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { productos } from './productos.js';

export const categorias = pgTable('categorias', {
    id_categoria: serial('id_categoria').primaryKey(),
    nombre: varchar('nombre', { length: 150 }).notNull(),
    imagenUrl: varchar('imagen_url', { length: 500 }),
    imagenPublicId: varchar('imagen_public_id', { length: 200 }),

    // Fechas de auditoría
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Opcional pero recomendado: Definir las relaciones inversas
export const categoriasRelations = relations(categorias, ({ many }) => ({
    productos: many(productos), // Una categoría tiene muchos productos
}));