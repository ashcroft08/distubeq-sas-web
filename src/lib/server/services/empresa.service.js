import { empresaRepository } from '../repositories/empresa.repository.js';

export class EmpresaService {
    async getConfig() {
        return await empresaRepository.getConfig();
    }

    async updateConfig(data) {
        return await empresaRepository.updateConfig(data);
    }

    async getAllHorarios() {
        return await empresaRepository.findAllHorarios();
    }

    async getHorarioById(id) {
        return await empresaRepository.findHorarioById(id);
    }

    async saveHorario(data) {
        if (data.id_horario) {
            const id = data.id_horario;
            delete data.id_horario;
            return await empresaRepository.updateHorario(id, data);
        }
        return await empresaRepository.createHorario(data);
    }

    async removeHorario(id) {
        return await empresaRepository.deleteHorario(id);
    }
}

export const empresaService = new EmpresaService();
