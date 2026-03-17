import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

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
    idDiametro: integer('id_diametro').notNull().references(() => diametros.idDiametro),
    tipo: varchar('tipo', { length: 20 }).notNull(),
    fabricante: varchar('fabricante', { length: 100 }),
    nombreCompleto: varchar('nombre_completo', { length: 200 }).notNull()
});

// Relaciones
export const materialesRelations = relations(materiales, ({ many }) => ({
    productos: many(productos),
}));

export const diametrosRelations = relations(diametros, ({ many }) => ({
    productos: many(productos),
}));

export const productosRelations = relations(productos, ({ one }) => ({
    material: one(materiales, {
        fields: [productos.idMaterial],
        references: [materiales.idMaterial],
    }),
    diametro: one(diametros, {
        fields: [productos.idDiametro],
        references: [diametros.idDiametro],
    }),
}));