import { pgTable, serial, integer, varchar, numeric, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { productos } from './productos.js';

export const promociones = pgTable('promociones', {
    id_promocion: serial('id_promocion').primaryKey(),
    nombre: varchar('nombre', { length: 100 }).notNull(),
    descripcion: varchar('descripcion', { length: 250 }),
    fecha_inicio: timestamp('fecha_inicio'),
    fecha_fin: timestamp('fecha_fin'),
    estado: boolean('estado').default(true).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const promocion_detalle = pgTable('promocion_detalle', {
    id_promocion_detalle: serial('id_promocion_detalle').primaryKey(),
    id_promocion: integer('id_promocion').references(() => promociones.id_promocion, { onDelete: 'cascade' }).notNull(),
    id_producto: integer('id_producto').references(() => productos.id_producto, { onDelete: 'cascade' }).notNull(),
    precio_promocional: numeric('precio_promocional', { precision: 10, scale: 2 }).notNull(),
    descuento: varchar('descuento', { length: 5 }), // ej. "20%"
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relaciones para consultas fáciles (ej. Traer una promoción con todos sus productos)
export const promocionesRelations = relations(promociones, ({ many }) => ({
    detalles: many(promocion_detalle),
}));

export const promocionDetalleRelations = relations(promocion_detalle, ({ one }) => ({
    promocion: one(promociones, {
        fields: [promocion_detalle.id_promocion],
        references: [promociones.id_promocion],
    }),
    producto: one(productos, {
        fields: [promocion_detalle.id_producto],
        references: [productos.id_producto],
    }),
}));