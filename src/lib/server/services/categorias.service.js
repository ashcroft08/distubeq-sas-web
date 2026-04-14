import { categoriasRepository } from '../repositories/categorias.repository.js';
import { uploadImage, deleteImage } from '../cloudinary.js';

export class CategoriasService {
    async getAllCategorias() {
        return await categoriasRepository.findAll();
    }

    async getCategoriaById(id) {
        return await categoriasRepository.findById(id);
    }

    async upsertCategoria(id, data, file) {
        let imageData = {};

        // Handle image upload if a new file is provided
        if (file && file.size > 0) {
            // Convert file to base64 for cloudinary utility
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
            
            // Delete old image if updating
            if (id) {
                const oldCategory = await categoriasRepository.findById(id);
                if (oldCategory?.imagenPublicId) {
                    await deleteImage(oldCategory.imagenPublicId);
                }
            }

            // Upload new image
            const uploadResult = await uploadImage(base64, 'distubeq/categories');
            imageData = {
                imagenUrl: uploadResult.url,
                imagenPublicId: uploadResult.public_id
            };
        }

        const categoryData = {
            nombre: data.nombre,
            ...imageData
        };

        if (id) {
            return await categoriasRepository.update(id, categoryData);
        } else {
            return await categoriasRepository.create(categoryData);
        }
    }

    async deleteCategoria(id) {
        const category = await categoriasRepository.findById(id);
        if (category?.imagenPublicId) {
            await deleteImage(category.imagenPublicId);
        }
        return await categoriasRepository.delete(id);
    }
}

export const categoriasService = new CategoriasService();
