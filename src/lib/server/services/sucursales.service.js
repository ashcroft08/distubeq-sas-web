import { sucursalesRepository } from '../repositories/sucursales.repository.js';
import { uploadImage, deleteImage } from '../cloudinary.js';

export class SucursalesService {
    async getAllSucursales() {
        return await sucursalesRepository.findAll();
    }

    async getActiveSucursales() {
        return await sucursalesRepository.findAllActive();
    }

    async getSucursalById(id) {
        return await sucursalesRepository.findById(id);
    }

    async upsertSucursal(id, data, file) {
        let imageData = {};

        if (file && file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
            
            if (id) {
                const oldSucursal = await sucursalesRepository.findById(id);
                if (oldSucursal?.imagen_public_id) {
                    await deleteImage(oldSucursal.imagen_public_id);
                }
            }

            const uploadResult = await uploadImage(base64, 'distubeq/sucursales');
            imageData = {
                imagen_url: uploadResult.url,
                imagen_public_id: uploadResult.public_id
            };
        }

        const sucursalData = {
            nombre: data.nombre,
            direccion: data.direccion,
            telefono: data.telefono || null,
            latitud: data.latitud ? parseFloat(data.latitud) : null,
            longitud: data.longitud ? parseFloat(data.longitud) : null,
            es_matriz: data.es_matriz ?? false,
            estado: data.estado,
            ...imageData
        };

        if (id) {
            return await sucursalesRepository.update(id, sucursalData);
        } else {
            return await sucursalesRepository.create(sucursalData);
        }
    }

    async deleteSucursal(id) {
        const sucursal = await sucursalesRepository.findById(id);
        if (sucursal?.imagen_public_id) {
            await deleteImage(sucursal.imagen_public_id);
        }
        return await sucursalesRepository.delete(id);
    }
}

export const sucursalesService = new SucursalesService();
