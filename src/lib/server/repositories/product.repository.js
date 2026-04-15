import { db } from '$lib/server/db';
import { eq, inArray } from 'drizzle-orm';
import { 
    productos, categorias,
    tuberias, linea_plastica, hierros_galvanizados, griferia, materiales_electricos, quimicos, herramientas,
    tuberias_diametros, linea_plastica_diametros, hierros_galvanizados_diametros,
    tuberias_materiales, diametros_tuberias,
    linea_plastica_materiales, diametros_linea_plastica,
    diametros_hierros_galvanizados,
    caracteristicas_griferia, caracteristicas_materiales_electricos, caracteristicas_quimicos, caracteristicas_herramientas,
    griferia_caracteristicas, materiales_electricos_caracteristicas, quimicos_caracteristicas, herramientas_caracteristicas
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
            is_electrico: materiales_electricos.id_producto,
            is_quimico: quimicos.id_producto,
            is_herramienta: herramientas.id_producto
        })
        .from(productos)
        .leftJoin(categorias, eq(productos.id_categoria, categorias.id_categoria))
        .leftJoin(tuberias, eq(productos.id_producto, tuberias.id_producto))
        .leftJoin(tuberias_materiales, eq(tuberias.id_tuberia_material, tuberias_materiales.id_tuberia_material))
        .leftJoin(linea_plastica, eq(productos.id_producto, linea_plastica.id_producto))
        .leftJoin(linea_plastica_materiales, eq(linea_plastica.id_linea_plastica_material, linea_plastica_materiales.id_linea_plastica_material))
        .leftJoin(hierros_galvanizados, eq(productos.id_producto, hierros_galvanizados.id_producto))
        .leftJoin(griferia, eq(productos.id_producto, griferia.id_producto))
        .leftJoin(materiales_electricos, eq(productos.id_producto, materiales_electricos.id_producto))
        .leftJoin(quimicos, eq(productos.id_producto, quimicos.id_producto))
        .leftJoin(herramientas, eq(productos.id_producto, herramientas.id_producto));

        // Fetch diametros mappings efficiently
        const [tubDiams, lpDiams, hgDiams, grfCars, elCars, quimCars, herrCars] = await Promise.all([
            db.select({ id: tuberias_diametros.id_tuberia, medida: diametros_tuberias.medida, decimal: diametros_tuberias.medida_decimal })
              .from(tuberias_diametros).innerJoin(diametros_tuberias, eq(tuberias_diametros.id_diametro_tuberia, diametros_tuberias.id_diametro_tuberia)),
            db.select({ id: linea_plastica_diametros.id_linea_plastica, medida: diametros_linea_plastica.medida, decimal: diametros_linea_plastica.medida_decimal })
              .from(linea_plastica_diametros).innerJoin(diametros_linea_plastica, eq(linea_plastica_diametros.id_diametro_linea_plastica, diametros_linea_plastica.id_diametro_linea_plastica)),
            db.select({ id: hierros_galvanizados_diametros.id_hierro_galvanizado, medida: diametros_hierros_galvanizados.medida, decimal: diametros_hierros_galvanizados.medida_decimal })
              .from(hierros_galvanizados_diametros).innerJoin(diametros_hierros_galvanizados, eq(hierros_galvanizados_diametros.id_diametro_hierro_galvanizado, diametros_hierros_galvanizados.id_diametro_hierro_galvanizado)),
            // Characteristics
            db.select({ id: griferia_caracteristicas.id_griferia, nombre: caracteristicas_griferia.nombre })
              .from(griferia_caracteristicas).innerJoin(caracteristicas_griferia, eq(griferia_caracteristicas.id_caracteristica_griferia, caracteristicas_griferia.id_caracteristica_griferia)),
            db.select({ id: materiales_electricos_caracteristicas.id_material_electrico, nombre: caracteristicas_materiales_electricos.nombre })
              .from(materiales_electricos_caracteristicas).innerJoin(caracteristicas_materiales_electricos, eq(materiales_electricos_caracteristicas.id_caracteristica_material_electrico, caracteristicas_materiales_electricos.id_caracteristica_material_electrico)),
             db.select({ id: quimicos_caracteristicas.id_quimico, nombre: caracteristicas_quimicos.nombre })
              .from(quimicos_caracteristicas).innerJoin(caracteristicas_quimicos, eq(quimicos_caracteristicas.id_caracteristica_quimico, caracteristicas_quimicos.id_caracteristica_quimico)),
             db.select({ id: herramientas_caracteristicas.id_herramienta, nombre: caracteristicas_herramientas.nombre })
              .from(herramientas_caracteristicas).innerJoin(caracteristicas_herramientas, eq(herramientas_caracteristicas.id_caracteristica_herramienta, caracteristicas_herramientas.id_caracteristica_herramienta)),
        ]);

        const diamsMap = {};
        for (const row of [...tubDiams, ...lpDiams, ...hgDiams]) {
            if (!diamsMap[row.id]) diamsMap[row.id] = [];
            let str = row.medida + '"';
            if (row.decimal) str += ` (${row.decimal} cm)`;
            diamsMap[row.id].push(str);
        }
        for (const row of [...grfCars, ...elCars, ...quimCars, ...herrCars]) {
            if (!diamsMap[row.id]) diamsMap[row.id] = [];
            diamsMap[row.id].push(row.nombre);
        }

        return results.map(r => {
            let tipo = 'Desconocido';
            let material = null;
            if (r.is_tuberia) { tipo = 'tuberias'; material = r.mat_tuberia; }
            else if (r.is_linea_plastica) { tipo = 'linea_plastica'; material = r.mat_lp; }
            else if (r.is_hierro) { tipo = 'hierros_galvanizados'; }
            else if (r.is_griferia) { tipo = 'griferia'; }
            else if (r.is_electrico) { tipo = 'materiales_electricos'; }
            else if (r.is_quimico) { tipo = 'quimicos'; }
            else if (r.is_herramienta) { tipo = 'herramientas'; }

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
                        const cars = await db.select({ id: griferia_caracteristicas.id_caracteristica_griferia })
                                             .from(griferia_caracteristicas)
                                             .where(eq(griferia_caracteristicas.id_griferia, id));
                        diametrosIdLista = cars.map(c => c.id);
                    } else {
                        const [elData] = await db.select().from(materiales_electricos).where(eq(materiales_electricos.id_producto, id));
                        if (elData) {
                            tipo = 'materiales_electricos';
                            subtipoData = elData;
                            const cars = await db.select({ id: materiales_electricos_caracteristicas.id_caracteristica_material_electrico })
                                                 .from(materiales_electricos_caracteristicas)
                                                 .where(eq(materiales_electricos_caracteristicas.id_material_electrico, id));
                            diametrosIdLista = cars.map(c => c.id);
                        } else {
                            const [quimData] = await db.select().from(quimicos).where(eq(quimicos.id_producto, id));
                            if (quimData) {
                                tipo = 'quimicos';
                                subtipoData = quimData;
                                const cars = await db.select({ id: quimicos_caracteristicas.id_caracteristica_quimico })
                                                     .from(quimicos_caracteristicas)
                                                     .where(eq(quimicos_caracteristicas.id_quimico, id));
                                diametrosIdLista = cars.map(c => c.id);
                            } else {
                                const [herrData] = await db.select().from(herramientas).where(eq(herramientas.id_producto, id));
                                if (herrData) {
                                    tipo = 'herramientas';
                                    subtipoData = herrData;
                                    const cars = await db.select({ id: herramientas_caracteristicas.id_caracteristica_herramienta })
                                                         .from(herramientas_caracteristicas)
                                                         .where(eq(herramientas_caracteristicas.id_herramienta, id));
                                    diametrosIdLista = cars.map(c => c.id);
                                }
                            }
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
            await tx.delete(griferia_caracteristicas).where(eq(griferia_caracteristicas.id_griferia, id));
            await tx.delete(griferia).where(eq(griferia.id_producto, id));
            await tx.delete(materiales_electricos_caracteristicas).where(eq(materiales_electricos_caracteristicas.id_material_electrico, id));
            await tx.delete(materiales_electricos).where(eq(materiales_electricos.id_producto, id));
            await tx.delete(quimicos_caracteristicas).where(eq(quimicos_caracteristicas.id_quimico, id));
            await tx.delete(quimicos).where(eq(quimicos.id_producto, id));
            await tx.delete(herramientas_caracteristicas).where(eq(herramientas_caracteristicas.id_herramienta, id));
            await tx.delete(herramientas).where(eq(herramientas.id_producto, id));

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
            await tx.insert(griferia).values({ id_producto: id });
            if (diametrosList.length > 0) {
                await tx.insert(griferia_caracteristicas).values(
                    diametrosList.map(c => ({ id_griferia: id, id_caracteristica_griferia: c }))
                );
            }
        }
        else if (tipo_producto === 'materiales_electricos') {
            await tx.insert(materiales_electricos).values({ id_producto: id });
            if (diametrosList.length > 0) {
                await tx.insert(materiales_electricos_caracteristicas).values(
                    diametrosList.map(c => ({ id_material_electrico: id, id_caracteristica_material_electrico: c }))
                );
            }
        }
        else if (tipo_producto === 'quimicos') {
            await tx.insert(quimicos).values({ id_producto: id });
            if (diametrosList.length > 0) {
                await tx.insert(quimicos_caracteristicas).values(
                    diametrosList.map(c => ({ id_quimico: id, id_caracteristica_quimico: c }))
                );
            }
        }
        else if (tipo_producto === 'herramientas') {
            await tx.insert(herramientas).values({ id_producto: id });
            if (diametrosList.length > 0) {
                await tx.insert(herramientas_caracteristicas).values(
                    diametrosList.map(c => ({ id_herramienta: id, id_caracteristica_herramienta: c }))
                );
            }
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
            return row;
        } else if (tipo === 'linea_plastica') {
            const [row] = await db.insert(linea_plastica_materiales).values({ nombre }).returning();
            return row;
        } else if (tipo === 'griferia') {
            const [row] = await db.insert(caracteristicas_griferia).values({ nombre }).returning();
            return row;
        } else if (tipo === 'materiales_electricos') {
            const [row] = await db.insert(caracteristicas_materiales_electricos).values({ nombre }).returning();
            return row;
        } else if (tipo === 'quimicos') {
            const [row] = await db.insert(caracteristicas_quimicos).values({ nombre }).returning();
            return row;
        } else if (tipo === 'herramientas') {
            const [row] = await db.insert(caracteristicas_herramientas).values({ nombre }).returning();
            return row;
        }
        return null;
    }

    async createDiametroInline(tipo, medida, medida_decimal) {
        if (tipo === 'tuberias') {
            const [row] = await db.insert(diametros_tuberias).values({ medida, medida_decimal }).returning();
            return row;
        } else if (tipo === 'linea_plastica') {
            const [row] = await db.insert(diametros_linea_plastica).values({ medida, medida_decimal }).returning();
            return row;
        } else if (tipo === 'hierros_galvanizados') {
            const [row] = await db.insert(diametros_hierros_galvanizados).values({ medida, medida_decimal }).returning();
            return row;
        }
        return null;
    }

    async updateCatalogInline(catalogType, subType, id, newData) {
        let row;
        if (catalogType === 'material') {
            if (subType === 'tuberias') row = await db.update(tuberias_materiales).set({ nombre: newData.nombre }).where(eq(tuberias_materiales.id_tuberia_material, id)).returning();
            else if (subType === 'linea_plastica') row = await db.update(linea_plastica_materiales).set({ nombre: newData.nombre }).where(eq(linea_plastica_materiales.id_linea_plastica_material, id)).returning();
            else if (subType === 'griferia') row = await db.update(caracteristicas_griferia).set({ nombre: newData.nombre }).where(eq(caracteristicas_griferia.id_caracteristica_griferia, id)).returning();
            else if (subType === 'materiales_electricos') row = await db.update(caracteristicas_materiales_electricos).set({ nombre: newData.nombre }).where(eq(caracteristicas_materiales_electricos.id_caracteristica_material_electrico, id)).returning();
            else if (subType === 'quimicos') row = await db.update(caracteristicas_quimicos).set({ nombre: newData.nombre }).where(eq(caracteristicas_quimicos.id_caracteristica_quimico, id)).returning();
            else if (subType === 'herramientas') row = await db.update(caracteristicas_herramientas).set({ nombre: newData.nombre }).where(eq(caracteristicas_herramientas.id_caracteristica_herramienta, id)).returning();
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
            else if (subType === 'griferia') return await db.delete(caracteristicas_griferia).where(eq(caracteristicas_griferia.id_caracteristica_griferia, id)).returning();
            else if (subType === 'materiales_electricos') return await db.delete(caracteristicas_materiales_electricos).where(eq(caracteristicas_materiales_electricos.id_caracteristica_material_electrico, id)).returning();
            else if (subType === 'quimicos') return await db.delete(caracteristicas_quimicos).where(eq(caracteristicas_quimicos.id_caracteristica_quimico, id)).returning();
            else if (subType === 'herramientas') return await db.delete(caracteristicas_herramientas).where(eq(caracteristicas_herramientas.id_caracteristica_herramienta, id)).returning();
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
            grfDesc, elDesc, quimDesc, herrDesc
        ] = await Promise.all([
            db.select().from(tuberias_materiales),
            db.select().from(diametros_tuberias),
            db.select().from(linea_plastica_materiales),
            db.select().from(diametros_linea_plastica),
            db.select().from(diametros_hierros_galvanizados),
            db.select().from(caracteristicas_griferia),
            db.select().from(caracteristicas_materiales_electricos),
            db.select().from(caracteristicas_quimicos),
            db.select().from(caracteristicas_herramientas)
        ]);

        return {
            tuberias: { materiales: tubMat, diametros: tubDiam },
            linea_plastica: { materiales: lpMat, diametros: lpDiam },
            hierros_galvanizados: { diametros: hgDiam },
            griferia: { caracteristicas: grfDesc },
            materiales_electricos: { caracteristicas: elDesc },
            quimicos: { caracteristicas: quimDesc },
            herramientas: { caracteristicas: herrDesc }
        };
    }
}

export const productRepository = new ProductRepository();
