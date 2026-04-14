import { db } from '$lib/server/db';
import { eq, inArray } from 'drizzle-orm';
import { 
    productos, categorias,
    tuberias, linea_plastica, hierros_galvanizados, griferia, materiales_electricos,
    tuberias_diametros, linea_plastica_diametros, hierros_galvanizados_diametros,
    tuberias_materiales, diametros_tuberias,
    linea_plastica_materiales, diametros_linea_plastica,
    diametros_hierros_galvanizados,
    descripcion_griferia, descripcion_materiales_electricos
} from '$lib/server/db/schemas';

export class ProductRepository {
    async findAll() {
        const results = await db.select({
            id_producto: productos.id_producto,
            id_categoria: productos.id_categoria,
            nombre: productos.nombre,
            fabricante: productos.fabricante,
            estado: productos.estado,
            imagen_url: productos.imagen_url,
            categoria_nombre: categorias.nombre,
            is_tuberia: tuberias.id_producto,
            mat_tuberia: tuberias_materiales.nombre,
            is_linea_plastica: linea_plastica.id_producto,
            mat_lp: linea_plastica_materiales.nombre,
            is_hierro: hierros_galvanizados.id_producto,
            is_griferia: griferia.id_producto,
            is_electrico: materiales_electricos.id_producto
        })
        .from(productos)
        .leftJoin(categorias, eq(productos.id_categoria, categorias.id_categoria))
        .leftJoin(tuberias, eq(productos.id_producto, tuberias.id_producto))
        .leftJoin(tuberias_materiales, eq(tuberias.id_tuberia_material, tuberias_materiales.id_tuberia_material))
        .leftJoin(linea_plastica, eq(productos.id_producto, linea_plastica.id_producto))
        .leftJoin(linea_plastica_materiales, eq(linea_plastica.id_linea_plastica_material, linea_plastica_materiales.id_linea_plastica_material))
        .leftJoin(hierros_galvanizados, eq(productos.id_producto, hierros_galvanizados.id_producto))
        .leftJoin(griferia, eq(productos.id_producto, griferia.id_producto))
        .leftJoin(materiales_electricos, eq(productos.id_producto, materiales_electricos.id_producto));

        // Fetch diametros mappings efficiently
        const [tubDiams, lpDiams, hgDiams] = await Promise.all([
            db.select({ id: tuberias_diametros.id_tuberia, medida: diametros_tuberias.medida, decimal: diametros_tuberias.medida_decimal })
              .from(tuberias_diametros).innerJoin(diametros_tuberias, eq(tuberias_diametros.id_diametro_tuberia, diametros_tuberias.id_diametro_tuberia)),
            db.select({ id: linea_plastica_diametros.id_linea_plastica, medida: diametros_linea_plastica.medida, decimal: diametros_linea_plastica.medida_decimal })
              .from(linea_plastica_diametros).innerJoin(diametros_linea_plastica, eq(linea_plastica_diametros.id_diametro_linea_plastica, diametros_linea_plastica.id_diametro_linea_plastica)),
            db.select({ id: hierros_galvanizados_diametros.id_hierro_galvanizado, medida: diametros_hierros_galvanizados.medida, decimal: diametros_hierros_galvanizados.medida_decimal })
              .from(hierros_galvanizados_diametros).innerJoin(diametros_hierros_galvanizados, eq(hierros_galvanizados_diametros.id_diametro_hierro_galvanizado, diametros_hierros_galvanizados.id_diametro_hierro_galvanizado)),
        ]);

        const diamsMap = {};
        for (const row of [...tubDiams, ...lpDiams, ...hgDiams]) {
            if (!diamsMap[row.id]) diamsMap[row.id] = [];
            let str = row.medida + '"';
            if (row.decimal) str += ` (${row.decimal} cm)`;
            diamsMap[row.id].push(str);
        }

        return results.map(r => {
            let tipo = 'Desconocido';
            let material = null;
            if (r.is_tuberia) { tipo = 'tuberias'; material = r.mat_tuberia; }
            else if (r.is_linea_plastica) { tipo = 'linea_plastica'; material = r.mat_lp; }
            else if (r.is_hierro) { tipo = 'hierros_galvanizados'; }
            else if (r.is_griferia) { tipo = 'griferia'; }
            else if (r.is_electrico) { tipo = 'materiales_electricos'; }

            return {
                id_producto: r.id_producto,
                nombre: r.nombre,
                fabricante: r.fabricante,
                estado: r.estado,
                imagen_url: r.imagen_url,
                id_categoria: r.id_categoria,
                categoria: r.categoria_nombre,
                tipo_producto: tipo,
                material: material,
                diametros_text: diamsMap[r.id_producto] ? diamsMap[r.id_producto].join(', ') : ''
            };
        });
    }

    async findById(id) {
        // Base product
        const [baseData] = await db.select()
            .from(productos)
            .where(eq(productos.id_producto, id));

        if (!baseData) return null;

        let subtipoData = null;
        let tipo = null;
        let diametrosIdLista = [];

        // Try to fetch subtype data
        const [tubData] = await db.select().from(tuberias).where(eq(tuberias.id_producto, id));
        if (tubData) {
            tipo = 'tuberias';
            subtipoData = tubData;
            const diams = await db.select({ id: tuberias_diametros.id_diametro_tuberia })
                                  .from(tuberias_diametros)
                                  .where(eq(tuberias_diametros.id_tuberia, id));
            diametrosIdLista = diams.map(d => d.id);
        } else {
            const [lpData] = await db.select().from(linea_plastica).where(eq(linea_plastica.id_producto, id));
            if (lpData) {
                tipo = 'linea_plastica';
                subtipoData = lpData;
                const diams = await db.select({ id: linea_plastica_diametros.id_diametro_linea_plastica })
                                      .from(linea_plastica_diametros)
                                      .where(eq(linea_plastica_diametros.id_linea_plastica, id));
                diametrosIdLista = diams.map(d => d.id);
            } else {
                const [hgData] = await db.select().from(hierros_galvanizados).where(eq(hierros_galvanizados.id_producto, id));
                if (hgData) {
                    tipo = 'hierros_galvanizados';
                    subtipoData = hgData;
                    const diams = await db.select({ id: hierros_galvanizados_diametros.id_diametro_hierro_galvanizado })
                                          .from(hierros_galvanizados_diametros)
                                          .where(eq(hierros_galvanizados_diametros.id_hierro_galvanizado, id));
                    diametrosIdLista = diams.map(d => d.id);
                } else {
                    const [grData] = await db.select().from(griferia).where(eq(griferia.id_producto, id));
                    if (grData) {
                        tipo = 'griferia';
                        subtipoData = grData;
                    } else {
                        const [elData] = await db.select().from(materiales_electricos).where(eq(materiales_electricos.id_producto, id));
                        if (elData) {
                            tipo = 'materiales_electricos';
                            subtipoData = elData;
                        }
                    }
                }
            }
        }

        return {
            ...baseData,
            tipo_producto: tipo,
            atributos_especificos: subtipoData,
            diametros: diametrosIdLista
        };
    }

    async create(baseData, tipo_producto, specificData, diametrosList = []) {
        return await db.transaction(async (tx) => {
            const [newProduct] = await tx.insert(productos).values(baseData).returning();
            const id = newProduct.id_producto;

            await this._insertSubtype(tx, id, tipo_producto, specificData, diametrosList);
            return newProduct;
        });
    }

    async update(id, baseData, tipo_producto, specificData, diametrosList = []) {
        return await db.transaction(async (tx) => {
            const [updatedProduct] = await tx.update(productos)
                .set({ ...baseData, updated_at: new Date() })
                .where(eq(productos.id_producto, id))
                .returning();

            // Clear existing subtypes completely
            await tx.delete(tuberias).where(eq(tuberias.id_producto, id));
            await tx.delete(linea_plastica).where(eq(linea_plastica.id_producto, id));
            await tx.delete(hierros_galvanizados).where(eq(hierros_galvanizados.id_producto, id));
            await tx.delete(griferia).where(eq(griferia.id_producto, id));
            await tx.delete(materiales_electricos).where(eq(materiales_electricos.id_producto, id));

            // Clean existing M-N are cascaded if configured, but let's be safe
            await tx.delete(tuberias_diametros).where(eq(tuberias_diametros.id_tuberia, id));
            await tx.delete(linea_plastica_diametros).where(eq(linea_plastica_diametros.id_linea_plastica, id));
            await tx.delete(hierros_galvanizados_diametros).where(eq(hierros_galvanizados_diametros.id_hierro_galvanizado, id));

            await this._insertSubtype(tx, id, tipo_producto, specificData, diametrosList);

            return updatedProduct;
        });
    }

    async _insertSubtype(tx, id, tipo_producto, specificData, diametrosList) {
        if (tipo_producto === 'tuberias') {
            await tx.insert(tuberias).values({
                id_producto: id,
                id_tuberia_material: specificData.material_id
            });
            if (diametrosList.length > 0) {
                await tx.insert(tuberias_diametros).values(
                    diametrosList.map(d => ({ id_tuberia: id, id_diametro_tuberia: d }))
                );
            }
        } 
        else if (tipo_producto === 'linea_plastica') {
            await tx.insert(linea_plastica).values({
                id_producto: id,
                id_linea_plastica_material: specificData.material_id
            });
            if (diametrosList.length > 0) {
                await tx.insert(linea_plastica_diametros).values(
                    diametrosList.map(d => ({ id_linea_plastica: id, id_diametro_linea_plastica: d }))
                );
            }
        }
        else if (tipo_producto === 'hierros_galvanizados') {
            await tx.insert(hierros_galvanizados).values({ id_producto: id });
            if (diametrosList.length > 0) {
                await tx.insert(hierros_galvanizados_diametros).values(
                    diametrosList.map(d => ({ id_hierro_galvanizado: id, id_diametro_hierro_galvanizado: d }))
                );
            }
        }
        else if (tipo_producto === 'griferia') {
            await tx.insert(griferia).values({
                id_producto: id,
                id_descripcion_griferia: specificData.descripcion_id
            });
        }
        else if (tipo_producto === 'materiales_electricos') {
            await tx.insert(materiales_electricos).values({
                id_producto: id,
                id_descripcion_material_electrico: specificData.descripcion_id
            });
        }
    }

    async delete(id) {
        const [deleted] = await db.delete(productos).where(eq(productos.id_producto, id)).returning();
        return deleted;
    }

    // --- Inline CRUD for Secondary Catalogs ---
    async createMaterialInline(tipo, nombre) {
        if (tipo === 'tuberias') {
            const [row] = await db.insert(tuberias_materiales).values({ nombre }).returning();
            return { id: row.id_tuberia_material, nombre: row.nombre };
        } else if (tipo === 'linea_plastica') {
            const [row] = await db.insert(linea_plastica_materiales).values({ nombre }).returning();
            return { id: row.id_linea_plastica_material, nombre: row.nombre };
        } else if (tipo === 'griferia') {
            const [row] = await db.insert(descripcion_griferia).values({ nombre }).returning();
            return { id: row.id_descripcion_griferia, nombre: row.nombre };
        } else if (tipo === 'materiales_electricos') {
            const [row] = await db.insert(descripcion_materiales_electricos).values({ nombre }).returning();
            return { id: row.id_descripcion_material_electrico, nombre: row.nombre };
        }
        return null;
    }

    async createDiametroInline(tipo, medida, medida_decimal) {
        if (tipo === 'tuberias') {
            const [row] = await db.insert(diametros_tuberias).values({ medida, medida_decimal }).returning();
            return { id: row.id_diametro_tuberia, medida: row.medida, medida_decimal: row.medida_decimal };
        } else if (tipo === 'linea_plastica') {
            const [row] = await db.insert(diametros_linea_plastica).values({ medida, medida_decimal }).returning();
            return { id: row.id_diametro_linea_plastica, medida: row.medida, medida_decimal: row.medida_decimal };
        } else if (tipo === 'hierros_galvanizados') {
            const [row] = await db.insert(diametros_hierros_galvanizados).values({ medida, medida_decimal }).returning();
            return { id: row.id_diametro_hierro_galvanizado, medida: row.medida, medida_decimal: row.medida_decimal };
        }
        return null;
    }

    async updateCatalogInline(catalogType, subType, id, newData) {
        let row;
        if (catalogType === 'material') {
            if (subType === 'tuberias') row = await db.update(tuberias_materiales).set({ nombre: newData.nombre }).where(eq(tuberias_materiales.id_tuberia_material, id)).returning();
            else if (subType === 'linea_plastica') row = await db.update(linea_plastica_materiales).set({ nombre: newData.nombre }).where(eq(linea_plastica_materiales.id_linea_plastica_material, id)).returning();
            else if (subType === 'griferia') row = await db.update(descripcion_griferia).set({ nombre: newData.nombre }).where(eq(descripcion_griferia.id_descripcion_griferia, id)).returning();
            else if (subType === 'materiales_electricos') row = await db.update(descripcion_materiales_electricos).set({ nombre: newData.nombre }).where(eq(descripcion_materiales_electricos.id_descripcion_material_electrico, id)).returning();
            return row ? row[0] : null;
        } else if (catalogType === 'diametro') {
            if (subType === 'tuberias') row = await db.update(diametros_tuberias).set({ medida: newData.medida, medida_decimal: newData.medida_decimal }).where(eq(diametros_tuberias.id_diametro_tuberia, id)).returning();
            else if (subType === 'linea_plastica') row = await db.update(diametros_linea_plastica).set({ medida: newData.medida, medida_decimal: newData.medida_decimal }).where(eq(diametros_linea_plastica.id_diametro_linea_plastica, id)).returning();
            else if (subType === 'hierros_galvanizados') row = await db.update(diametros_hierros_galvanizados).set({ medida: newData.medida, medida_decimal: newData.medida_decimal }).where(eq(diametros_hierros_galvanizados.id_diametro_hierro_galvanizado, id)).returning();
            return row ? row[0] : null;
        }
        return null;
    }

    async deleteCatalogInline(catalogType, subType, id) {
        if (catalogType === 'material') {
            if (subType === 'tuberias') return await db.delete(tuberias_materiales).where(eq(tuberias_materiales.id_tuberia_material, id)).returning();
            else if (subType === 'linea_plastica') return await db.delete(linea_plastica_materiales).where(eq(linea_plastica_materiales.id_linea_plastica_material, id)).returning();
            else if (subType === 'griferia') return await db.delete(descripcion_griferia).where(eq(descripcion_griferia.id_descripcion_griferia, id)).returning();
            else if (subType === 'materiales_electricos') return await db.delete(descripcion_materiales_electricos).where(eq(descripcion_materiales_electricos.id_descripcion_material_electrico, id)).returning();
        } else if (catalogType === 'diametro') {
            if (subType === 'tuberias') return await db.delete(diametros_tuberias).where(eq(diametros_tuberias.id_diametro_tuberia, id)).returning();
            else if (subType === 'linea_plastica') return await db.delete(diametros_linea_plastica).where(eq(diametros_linea_plastica.id_diametro_linea_plastica, id)).returning();
            else if (subType === 'hierros_galvanizados') return await db.delete(diametros_hierros_galvanizados).where(eq(diametros_hierros_galvanizados.id_diametro_hierro_galvanizado, id)).returning();
        }
        return null;
    }

    // Fetch all catalogs for the UI dropdowns
    async getAllCatalogs() {
        const [
            tubMat, tubDiam,
            lpMat, lpDiam,
            hgDiam,
            grfDesc, elDesc
        ] = await Promise.all([
            db.select().from(tuberias_materiales),
            db.select().from(diametros_tuberias),
            db.select().from(linea_plastica_materiales),
            db.select().from(diametros_linea_plastica),
            db.select().from(diametros_hierros_galvanizados),
            db.select().from(descripcion_griferia),
            db.select().from(descripcion_materiales_electricos)
        ]);

        return {
            tuberias: { materiales: tubMat, diametros: tubDiam },
            linea_plastica: { materiales: lpMat, diametros: lpDiam },
            hierros_galvanizados: { diametros: hgDiam },
            griferia: { descripciones: grfDesc },
            materiales_electricos: { descripciones: elDesc }
        };
    }
}

export const productRepository = new ProductRepository();
