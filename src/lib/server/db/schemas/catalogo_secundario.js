import { pgTable, serial, varchar, numeric, timestamp, integer } from 'drizzle-orm/pg-core';
// Importaremos los subtipos para hacer las referencias de las FK correctamente
import { tuberias, linea_plastica, hierros_galvanizados, griferia, materiales_electricos, quimicos, herramientas } from './subtipos.js';

// ============================================================================
// 1. TUBERÍAS (Atributos y Pivotes)
// ============================================================================

export const tuberias_materiales = pgTable('tuberias_materiales', {
    id_tuberia_material: serial('id_tuberia_material').primaryKey(),
    nombre: varchar('nombre').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const diametros_tuberias = pgTable('diametros_tuberias', {
    id_diametro_tuberia: serial('id_diametro_tuberia').primaryKey(),
    medida: varchar('medida', { length: 20 }).notNull(),
    medida_decimal: numeric('medida_decimal', { precision: 5, scale: 2 }),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// La tabla pivote "Muchos a Muchos"
export const tuberias_diametros = pgTable('tuberias_diametros', {
    id_tuberia: integer('id_tuberia').references(() => tuberias.id_producto, { onDelete: 'cascade' }).notNull(),
    id_diametro_tuberia: integer('id_diametro_tuberia').references(() => diametros_tuberias.id_diametro_tuberia, { onDelete: 'cascade' }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// 2. LÍNEA PLÁSTICA (Atributos y Pivotes)
// ============================================================================

export const linea_plastica_materiales = pgTable('linea_plastica_materiales', {
    id_linea_plastica_material: serial('id_linea_plastica_material').primaryKey(),
    nombre: varchar('nombre', { length: 150 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const diametros_linea_plastica = pgTable('diametros_linea_plastica', {
    id_diametro_linea_plastica: serial('id_diametro_linea_plastica').primaryKey(),
    medida: varchar('medida', { length: 20 }).notNull(),
    medida_decimal: numeric('medida_decimal', { precision: 5, scale: 2 }),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const linea_plastica_diametros = pgTable('linea_plastica_diametros', {
    id_linea_plastica: integer('id_linea_plastica').references(() => linea_plastica.id_producto, { onDelete: 'cascade' }).notNull(),
    id_diametro_linea_plastica: integer('id_diametro_linea_plastica').references(() => diametros_linea_plastica.id_diametro_linea_plastica, { onDelete: 'cascade' }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});


// ============================================================================
// 3. HIERROS GALVANIZADOS (Atributos y Pivotes)
// ============================================================================

export const diametros_hierros_galvanizados = pgTable('diametros_hierros_galvanizados', {
    id_diametro_hierro_galvanizado: serial('id_diametro_hierro_galvanizado').primaryKey(),
    medida: varchar('medida', { length: 20 }).notNull(),
    medida_decimal: numeric('medida_decimal', { precision: 5, scale: 2 }),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const hierros_galvanizados_diametros = pgTable('hierros_galvanizados_diametros', {
    id_hierro_galvanizado: integer('id_hierro_galvanizado').references(() => hierros_galvanizados.id_producto, { onDelete: 'cascade' }).notNull(),
    id_diametro_hierro_galvanizado: integer('id_diametro_hierro_galvanizado').references(() => diametros_hierros_galvanizados.id_diametro_hierro_galvanizado, { onDelete: 'cascade' }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});


// ============================================================================
// 4. DESCRIPCIONES INDEPENDIENTES (Catálogos simples)
// ============================================================================

export const caracteristicas_griferia = pgTable('caracteristicas_griferia', {
    id_caracteristica_griferia: serial('id_caracteristica_griferia').primaryKey(),
    nombre: varchar('nombre', { length: 150 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const griferia_caracteristicas = pgTable('griferia_caracteristicas', {
    id_griferia: integer('id_griferia').references(() => griferia.id_producto, { onDelete: 'cascade' }).notNull(),
    id_caracteristica_griferia: integer('id_caracteristica_griferia').references(() => caracteristicas_griferia.id_caracteristica_griferia, { onDelete: 'cascade' }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const caracteristicas_materiales_electricos = pgTable('caracteristicas_materiales_electricos', {
    id_caracteristica_material_electrico: serial('id_caracteristica_material_electrico').primaryKey(),
    nombre: varchar('nombre', { length: 150 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const materiales_electricos_caracteristicas = pgTable('materiales_electricos_caracteristicas', {
    id_material_electrico: integer('id_material_electrico').references(() => materiales_electricos.id_producto, { onDelete: 'cascade' }).notNull(),
    id_caracteristica_material_electrico: integer('id_caracteristica_material_electrico').references(() => caracteristicas_materiales_electricos.id_caracteristica_material_electrico, { onDelete: 'cascade' }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// 6. QUÍMICOS
// ============================================================================
export const caracteristicas_quimicos = pgTable('caracteristicas_quimicos', {
    id_caracteristica_quimico: serial('id_caracteristica_quimico').primaryKey(),
    nombre: varchar('nombre', { length: 150 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const quimicos_caracteristicas = pgTable('quimicos_caracteristicas', {
    id_quimico: integer('id_quimico').references(() => quimicos.id_producto, { onDelete: 'cascade' }).notNull(),
    id_caracteristica_quimico: integer('id_caracteristica_quimico').references(() => caracteristicas_quimicos.id_caracteristica_quimico, { onDelete: 'cascade' }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// 7. HERRAMIENTAS
// ============================================================================
export const caracteristicas_herramientas = pgTable('caracteristicas_herramientas', {
    id_caracteristica_herramienta: serial('id_caracteristica_herramienta').primaryKey(),
    nombre: varchar('nombre', { length: 150 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const herramientas_caracteristicas = pgTable('herramientas_caracteristicas', {
    id_herramienta: integer('id_herramienta').references(() => herramientas.id_producto, { onDelete: 'cascade' }).notNull(),
    id_caracteristica_herramienta: integer('id_caracteristica_herramienta').references(() => caracteristicas_herramientas.id_caracteristica_herramienta, { onDelete: 'cascade' }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});