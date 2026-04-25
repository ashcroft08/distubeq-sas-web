import { empresaService } from '$lib/server/services/empresa.service.js';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const config = await empresaService.getConfig();
    const horarios = await empresaService.getAllHorarios();
    return {
        config,
        horarios
    };
};

export const actions = {
    updateConfig: async ({ request }) => {
        const data = await request.formData();
        const correo_corporativo = data.get('correo_corporativo');

        try {
            await empresaService.updateConfig({ correo_corporativo });
            return { success: true, message: 'Configuración actualizada correctamente' };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Error al actualizar la configuración' });
        }
    },

    upsertHorario: async ({ request }) => {
        const data = await request.formData();
        const id_horario = data.get('id_horario');
        const dias_texto = data.get('dias_texto');
        const hora_apertura = data.get('hora_apertura');
        const hora_cierre = data.get('hora_cierre');
        const esta_cerrado = data.get('esta_cerrado') === 'true';
        const orden = parseInt(data.get('orden') || '0');

        if (!dias_texto) {
            return fail(400, { message: 'El texto de los días es obligatorio' });
        }

        try {
            const horarioData = {
                dias_texto,
                hora_apertura,
                hora_cierre,
                esta_cerrado,
                orden
            };
            if (id_horario) {
                horarioData.id_horario = parseInt(id_horario);
            }
            await empresaService.saveHorario(horarioData);
            return { success: true, message: id_horario ? 'Horario actualizado' : 'Horario creado' };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Error al guardar el horario' });
        }
    },

    deleteHorario: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');

        try {
            await empresaService.removeHorario(parseInt(id));
            return { success: true, message: 'Horario eliminado' };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Error al eliminar el horario' });
        }
    }
};
