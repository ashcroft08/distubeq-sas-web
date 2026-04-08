import { pgTable, serial, integer, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { categorias } from './categorias.js';

export const productos = pgTable('productos', {
    id_producto: serial('id_producto').primaryKey(),

    // Llave foránea hacia categorías
    id_categoria: integer('id_categoria').references(() => categorias.id_categoria).notNull(),

    nombre: varchar('nombre', { length: 200 }).notNull(),
    fabricante: varchar('fabricante', { length: 100 }),
    descripcion: text('descripcion'), // Usamos text para descripciones largas
    imagen_url: varchar('imagen_url', { length: 500 }),
    imagen_public_id: varchar('imagen_public_id', { length: 200 }),
    estado: boolean('estado').default(true).notNull(),

    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Definimos la relación para que Drizzle sepa cómo hacer los JOINs
export const productosRelations = relations(productos, ({ one }) => ({
    categoria: one(categorias, {
        fields: [productos.id_categoria],
        references: [categorias.id_categoria],
    }),
}));