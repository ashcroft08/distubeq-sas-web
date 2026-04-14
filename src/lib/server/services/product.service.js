import { productRepository } from '../repositories/product.repository.js';
import { uploadImage, deleteImage } from '../cloudinary.js';

export class ProductService {
    async getAllProducts() {
        return await productRepository.findAll();
    }

    async getProductById(id) {
        return await productRepository.findById(id);
    }

    async upsertProduct(id, baseData, tipo_producto, specificData, diametrosList, file) {
        let imageData = {};

        if (file && file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
            
            if (id) {
                const oldProduct = await productRepository.findById(id);
                if (oldProduct?.imagen_public_id) {
                    await deleteImage(oldProduct.imagen_public_id);
                }
            }

            const uploadResult = await uploadImage(base64, 'distubeq/products');
            imageData = {
                imagen_url: uploadResult.url,
                imagen_public_id: uploadResult.public_id
            };
        }

        const finalBaseData = {
            ...baseData,
            ...imageData
        };

        if (id) {
            return await productRepository.update(id, finalBaseData, tipo_producto, specificData, diametrosList);
        } else {
            return await productRepository.create(finalBaseData, tipo_producto, specificData, diametrosList);
        }
    }

    async deleteProduct(id) {
        const product = await productRepository.findById(id);
        if (product?.imagen_public_id) {
            await deleteImage(product.imagen_public_id);
        }
        return await productRepository.delete(id);
    }

    async getAllCatalogs() {
        return await productRepository.getAllCatalogs();
    }

    async createMaterialInline(tipo, nombre) {
        return await productRepository.createMaterialInline(tipo, nombre);
    }

    async createDiametroInline(tipo, medida, medida_decimal) {
        return await productRepository.createDiametroInline(tipo, medida, medida_decimal);
    }

    async updateCatalogInline(catalogType, subType, id, newData) {
        return await productRepository.updateCatalogInline(catalogType, subType, id, newData);
    }

    async deleteCatalogInline(catalogType, subType, id) {
        return await productRepository.deleteCatalogInline(catalogType, subType, id);
    }
}

export const productService = new ProductService();
