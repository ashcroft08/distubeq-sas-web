import { sucursalesService } from '$lib/server/services/sucursales.service.js';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const sucursales = await sucursalesService.getAllSucursales();
    return { sucursales };
};

export const actions = {
    upsert: async ({ request }) => {
        const formData = await request.formData();
        
        const id = formData.get('id_sucursal');
        const nombre = formData.get('nombre');
        const direccion = formData.get('direccion');
        const telefono = formData.get('telefono');
        const latitud = formData.get('latitud');
        const longitud = formData.get('longitud');
        const es_matriz = formData.get('es_matriz') === 'true';
        const estado = formData.get('estado') === 'true';
        const image = formData.get('image');

        if (!nombre || !direccion) {
            return fail(400, { message: 'El nombre y la dirección son requeridos.' });
        }

        const data = {
            nombre,
            direccion,
            telefono,
            latitud,
            longitud,
            es_matriz,
            estado
        };

        try {
            await sucursalesService.upsertSucursal(id ? parseInt(id) : null, data, image);
            return { success: true };
        } catch (error) {
            console.error('Error upserting sucursal:', error);
            return fail(500, { message: 'Error interno al guardar la sucursal. Detalles: ' + error.message });
        }
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = parseInt(formData.get('id'));

        try {
            await sucursalesService.deleteSucursal(id);
            return { success: true };
        } catch (error) {
            console.error('Error eliminando sucursal:', error);
            return fail(500, { message: 'Error interno al eliminar la sucursal' });
        }
    }
};
