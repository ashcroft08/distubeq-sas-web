import { relations } from "drizzle-orm";
import { pgTable, serial, varchar, decimal, integer, boolean } from "drizzle-orm/pg-core";

// Tabla: Materiales
export const materiales = pgTable('materiales', {
    idMaterial: serial('id_material').primaryKey(),
    nombre: varchar('nombre', { length: 50 }).notNull().unique(),
});

// Tabla: Diametros
export const diametros = pgTable('diametros', {
    idDiametro: serial('id_diametro').primaryKey(),
    medida: varchar('medida', { length: 20 }).notNull().unique(),
    medidaDecimal: decimal('medida_decimal', { precision: 5, scale: 2 }),
});

// Tabla: Productos
export const productos = pgTable('productos', {
    idProducto: serial('id_producto').primaryKey(),
    idMaterial: integer('id_material').notNull().references(() => materiales.idMaterial),
    nombreCompleto: varchar('nombre_completo', { length: 200 }).notNull(),
    fabricante: varchar('fabricante', { length: 100 }),
    imagenUrl: varchar('imagen_url', { length: 500 }),
    imagenPublicId: varchar('imagen_public_id', { length: 200 }),
    estado: boolean('estado').default(true).notNull()
});

// Tabla Intermedia: Productos <-> Diametros
export const productosDiametros = pgTable('productos_diametros', {
    idProducto: integer('id_producto').notNull().references(() => productos.idProducto, { onDelete: 'cascade' }),
    idDiametro: integer('id_diametro').notNull().references(() => diametros.idDiametro, { onDelete: 'cascade' }),
}, (t) => ({
    pk: [t.idProducto, t.idDiametro],
}));

// Relaciones
export const materialesRelations = relations(materiales, ({ many }) => ({
    productos: many(productos),
}));

export const diametrosRelations = relations(diametros, ({ many }) => ({
    productos: many(productosDiametros),
}));

export const productosRelations = relations(productos, ({ one, many }) => ({
    material: one(materiales, {
        fields: [productos.idMaterial],
        references: [materiales.idMaterial],
    }),
    diametros: many(productosDiametros),
}));

export const productosDiametrosRelations = relations(productosDiametros, ({ one }) => ({
    producto: one(productos, {
        fields: [productosDiametros.idProducto],
        references: [productos.idProducto],
    }),
    diametro: one(diametros, {
        fields: [productosDiametros.idDiametro],
        references: [diametros.idDiametro],
    }),
}));