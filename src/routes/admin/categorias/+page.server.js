import { categoriasService } from '$lib/server/services/categorias.service.js';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const categorias = await categoriasService.getAllCategorias();
    return {
        categorias
    };
};

export const actions = {
    upsert: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id_categoria');
        const nombre = formData.get('nombre');
        const image = formData.get('image');

        if (!nombre) {
            return fail(400, { message: 'El nombre es requerido' });
        }

        try {
            await categoriasService.upsertCategoria(
                id ? parseInt(id) : null,
                { nombre },
                image
            );
            return { success: true };
        } catch (error) {
            console.error('Error in upsert action:', error);
            return fail(500, { message: 'Error al guardar la categoría' });
        }
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) {
            return fail(400, { message: 'ID no proporcionado' });
        }

        try {
            await categoriasService.deleteCategoria(parseInt(id));
            return { success: true };
        } catch (error) {
            console.error('Error in delete action:', error);
            return fail(500, { message: 'Error al eliminar la categoría' });
        }
    }
};
