import { db } from '$lib/server/db';
import { productos, materiales, diametros, productosDiametros } from '$lib/server/db/schemas';
import { eq, sql } from 'drizzle-orm';

export class ProductRepository {
	async findAll() {
		return await db.query.productos.findMany({
			with: {
				material: true,
				diametros: {
					with: {
						diametro: true
					}
				}
			}
		});
	}

	async findById(id) {
		const result = await db.query.productos.findFirst({
			where: eq(productos.idProducto, id),
			with: {
				material: true,
				diametros: {
					with: {
						diametro: true
					}
				}
			}
		});
		return result;
	}

	async create(data, idDiametros = []) {
		const result = await db.transaction(async (tx) => {
			const [newProduct] = await tx.insert(productos).values(data).returning();
			
			if (idDiametros.length > 0) {
				await tx.insert(productosDiametros).values(
					idDiametros.map(idDiametro => ({
						idProducto: newProduct.idProducto,
						idDiametro
					}))
				);
			}
			
			return newProduct;
		});
		return result;
	}

	async update(id, data, idDiametros = []) {
		const result = await db.transaction(async (tx) => {
			const [updatedProduct] = await tx.update(productos)
				.set(data)
				.where(eq(productos.idProducto, id))
				.returning();
			
			// Sync diameters
			await tx.delete(productosDiametros).where(eq(productosDiametros.idProducto, id));
			
			if (idDiametros.length > 0) {
				await tx.insert(productosDiametros).values(
					idDiametros.map(idDiametro => ({
						idProducto: id,
						idDiametro
					}))
				);
			}
			
			return updatedProduct;
		});
		return result;
	}

	async delete(id) {
		const result = await db.delete(productos).where(eq(productos.idProducto, id)).returning();
		return result[0];
	}
}

export const productRepository = new ProductRepository();
