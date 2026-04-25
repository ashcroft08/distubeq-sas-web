import { pgTable, serial, varchar, decimal, boolean, timestamp } from 'drizzle-orm/pg-core';

export const sucursales = pgTable('sucursales', {
    id_sucursal: serial('id_sucursal').primaryKey(),
    nombre: varchar('nombre', { length: 100 }).notNull(),
    direccion: varchar('direccion', { length: 250 }).notNull(),
    telefono: varchar('telefono', { length: 50 }),

    // Coordenadas para el mapa interactivo
    latitud: decimal('latitud', { precision: 10, scale: 8 }),
    longitud: decimal('longitud', { precision: 11, scale: 8 }),

    imagen_url: varchar('imagen_url', { length: 500 }),
    imagen_public_id: varchar('imagen_public_id', { length: 200 }),
    es_matriz: boolean('es_matriz').default(false).notNull(),
    estado: boolean('estado').default(true).notNull(),

    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});