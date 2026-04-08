import { pgTable, integer } from 'drizzle-orm/pg-core';
import { productos } from './productos.js';
// Importamos los catálogos secundarios para poder referenciarlos
import {
    tuberias_materiales,
    descripcion_griferia,
    descripcion_materiales_electricos,
    linea_plastica_materiales
} from './catalogo_secundario.js';

export const tuberias = pgTable('tuberias', {
    id_producto: integer('id_producto').primaryKey().references(() => productos.id_producto, { onDelete: 'cascade' }),

    id_tuberia_material: integer('id_tuberia_material').references(() => tuberias_materiales.id_tuberia_material).notNull(),
});

export const griferia = pgTable('griferia', {
    id_producto: integer('id_producto').primaryKey().references(() => productos.id_producto, { onDelete: 'cascade' }),

    id_descripcion_griferia: integer('id_descripcion_griferia').references(() => descripcion_griferia.id_descripcion_griferia).notNull(),
});

export const hierros_galvanizados = pgTable('hierros_galvanizados', {
    id_producto: integer('id_producto').primaryKey().references(() => productos.id_producto, { onDelete: 'cascade' }),
});

export const materiales_electricos = pgTable('materiales_electricos', {
    id_producto: integer('id_producto').primaryKey().references(() => productos.id_producto, { onDelete: 'cascade' }),

    id_descripcion_material_electrico: integer('id_descripcion_material_electrico').references(() => descripcion_materiales_electricos.id_descripcion_material_electrico).notNull(),
});

export const linea_plastica = pgTable('linea_plastica', {
    id_producto: integer('id_producto').primaryKey().references(() => productos.id_producto, { onDelete: 'cascade' }),

    id_linea_plastica_material: integer('id_linea_plastica_material').references(() => linea_plastica_materiales.id_linea_plastica_material).notNull(),
});