import { pgTable, integer } from 'drizzle-orm/pg-core';
import { productos } from './productos.js';
// Importamos los catálogos secundarios para poder referenciarlos
import {
    tuberias_materiales,
    linea_plastica_materiales
} from './catalogo_secundario.js';

export const tuberias = pgTable('tuberias', {
    id_producto: integer('id_producto').primaryKey().references(() => productos.id_producto, { onDelete: 'cascade' }),

    id_tuberia_material: integer('id_tuberia_material').references(() => tuberias_materiales.id_tuberia_material).notNull(),
});

export const griferia = pgTable('griferia', {
    id_producto: integer('id_producto').primaryKey().references(() => productos.id_producto, { onDelete: 'cascade' }),
});

export const hierros_galvanizados = pgTable('hierros_galvanizados', {
    id_producto: integer('id_producto').primaryKey().references(() => productos.id_producto, { onDelete: 'cascade' }),
});

export const materiales_electricos = pgTable('materiales_electricos', {
    id_producto: integer('id_producto').primaryKey().references(() => productos.id_producto, { onDelete: 'cascade' }),
});

export const quimicos = pgTable('quimicos', {
    id_producto: integer('id_producto').primaryKey().references(() => productos.id_producto, { onDelete: 'cascade' }),
});

export const herramientas = pgTable('herramientas', {
    id_producto: integer('id_producto').primaryKey().references(() => productos.id_producto, { onDelete: 'cascade' }),
});

export const linea_plastica = pgTable('linea_plastica', {
    id_producto: integer('id_producto').primaryKey().references(() => productos.id_producto, { onDelete: 'cascade' }),

    id_linea_plastica_material: integer('id_linea_plastica_material').references(() => linea_plastica_materiales.id_linea_plastica_material).notNull(),
});