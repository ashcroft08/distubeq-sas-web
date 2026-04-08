import { fail, redirect } from '@sveltejs/kit';
import { productRepository } from '$lib/server/repositories/product.repository';
import { materialRepository } from '$lib/server/repositories/material.repository';
import { diameterRepository } from '$lib/server/repositories/diameter.repository';
import { uploadImage, deleteImage } from '$lib/server/cloudinary';

export const load = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/login');
	}

	const [products, materiales, diametros] = await Promise.all([
		productRepository.findAll(),
		materialRepository.findAll(),
		diameterRepository.findAll()
	]);

	return {
		products,
		materiales,
		diametros
	};
};

export const actions = {
	// Product Actions
	createProduct: async ({ request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);
		const idDiametros = formData.getAll('idDiametros').map(id => parseInt(id.toString()));

		try {
			const productData = {
				nombreCompleto: data.nombreCompleto.toString(),
				idMaterial: parseInt(data.idMaterial.toString()),
				fabricante: data.fabricante?.toString() || null,
				estado: data.estado === 'on',
				imagenUrl: null,
				imagenPublicId: null
			};

			if (data.imageData) {
				const upload = await uploadImage(data.imageData.toString());
				productData.imagenUrl = upload.url;
				productData.imagenPublicId = upload.public_id;
			}

			await productRepository.create(productData, idDiametros);
			return { success: true, message: 'Producto creado correctamente' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Error al crear el producto' });
		}
	},

	updateProduct: async ({ request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);
		const idDiametros = formData.getAll('idDiametros').map(id => parseInt(id.toString()));

		try {
			const id = parseInt(data.idProducto.toString());
			const existingProduct = await productRepository.findById(id);
			
			const productData = {
				nombreCompleto: data.nombreCompleto.toString(),
				idMaterial: parseInt(data.idMaterial.toString()),
				fabricante: data.fabricante?.toString() || null,
				estado: data.estado === 'on',
				imagenUrl: existingProduct?.imagenUrl,
				imagenPublicId: existingProduct?.imagenPublicId
			};

			if (data.imageData) {
				// Delete old image if exists
				if (existingProduct?.imagenPublicId) {
					await deleteImage(existingProduct.imagenPublicId);
				}
				const upload = await uploadImage(data.imageData.toString());
				productData.imagenUrl = upload.url;
				productData.imagenPublicId = upload.public_id;
			}

			await productRepository.update(id, productData, idDiametros);
			return { success: true, message: 'Producto actualizado correctamente' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Error al actualizar el producto' });
		}
	},

	deleteProduct: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			const id = parseInt(data.id.toString());
			const product = await productRepository.findById(id);
			if (product?.imagenPublicId) {
				await deleteImage(product.imagenPublicId);
			}
			await productRepository.delete(id);
			return { success: true, message: 'Producto eliminado' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Error al eliminar el producto' });
		}
	},

    toggleProductStatus: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			const id = parseInt(data.id.toString());
			const currentState = data.estado === 'true';
			await productRepository.update(id, { estado: !currentState });
			return { success: true };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Error al cambiar estado' });
		}
	},

	// Material Actions
	createMaterial: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			await materialRepository.create({ nombre: data.nombre.toString().toUpperCase() });
			return { success: true, message: 'Material creado' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Error al crear material' });
		}
	},

	updateMaterial: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			const id = parseInt(data.idMaterial.toString());
			await materialRepository.update(id, { nombre: data.nombre.toString().toUpperCase() });
			return { success: true, message: 'Material actualizado' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Error al actualizar material' });
		}
	},

	deleteMaterial: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			const id = parseInt(data.id.toString());
			await materialRepository.delete(id);
			return { success: true, message: 'Material eliminado' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Error al eliminar material' });
		}
	},

	// Diameter Actions
	createDiameter: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			const diameterData = {
				medida: data.medida.toString().toUpperCase(),
				medidaDecimal: data.medidaDecimal ? parseFloat(data.medidaDecimal.toString()) : null
			};
			await diameterRepository.create(diameterData);
			return { success: true, message: 'Diámetro creado' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Error al crear diámetro' });
		}
	},

	updateDiameter: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			const id = parseInt(data.idDiametro.toString());
			const diameterData = {
				medida: data.medida.toString().toUpperCase(),
				medidaDecimal: data.medidaDecimal ? parseFloat(data.medidaDecimal.toString()) : null
			};
			await diameterRepository.update(id, diameterData);
			return { success: true, message: 'Diámetro actualizado' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Error al actualizar diámetro' });
		}
	},

	deleteDiameter: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			const id = parseInt(data.id.toString());
			await diameterRepository.delete(id);
			return { success: true, message: 'Diámetro eliminado' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Error al eliminar diámetro' });
		}
	},

	// Quick create diameter from ProductForm (inline)
	quickCreateDiameter: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			const medida = data.medida?.toString().toUpperCase().trim();
			if (!medida) {
				return fail(400, { message: 'La medida es obligatoria.' });
			}

			const diameterData = {
				medida,
				medidaDecimal: data.medidaDecimal ? parseFloat(data.medidaDecimal.toString()) : null
			};

			const newDiameter = await diameterRepository.create(diameterData);
			return { success: true, diameter: newDiameter };
		} catch (error) {
			console.error(error);
			// Check for duplicate
			if (error?.code === '23505' || error?.message?.includes('unique')) {
				return fail(400, { message: 'Esta medida ya existe.' });
			}
			return fail(500, { message: 'Error al crear la medida.' });
		}
	}
};
