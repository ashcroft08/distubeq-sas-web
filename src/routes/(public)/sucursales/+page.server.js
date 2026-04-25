import { sucursalesService } from '$lib/server/services/sucursales.service.js';

export const load = async () => {
    const sucursales = await sucursalesService.getActiveSucursales();
    return { sucursales };
};
