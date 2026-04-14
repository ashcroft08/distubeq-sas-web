import { productService } from '$lib/server/services/product.service.js';
import { categoriasService } from '$lib/server/services/categorias.service.js';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    // We run queries in parallel to speed up load time
    const [productos, categorias, catalogos] = await Promise.all([
        productService.getAllProducts(),
        categoriasService.getAllCategorias(),
        productService.getAllCatalogs()
    ]);

    return {
        productos,
        categorias,
        catalogos
    };
};

export const actions = {
    upsert: async ({ request }) => {
        const formData = await request.formData();
        
        // Base Data
        const id = formData.get('id_producto');
        const id_categoria = parseInt(formData.get('id_categoria'));
        const nombre = formData.get('nombre');
        const fabricante = formData.get('fabricante');
        const descripcion = formData.get('descripcion');
        const estado = formData.get('estado') === 'true';
        const image = formData.get('image');

        if (!nombre || !id_categoria) {
            return fail(400, { message: 'Nombre y categoría son requeridos' });
        }

        const baseData = {
            id_categoria,
            nombre,
            fabricante,
            descripcion,
            estado
        };

        // Polymorphic Data
        const tipo_producto = formData.get('tipo_producto');
        if (!tipo_producto) {
            return fail(400, { message: 'El tipo de producto es requerido' });
        }

        let specificData = {};
        let diametrosList = [];

        if (['tuberias', 'linea_plastica'].includes(tipo_producto)) {
            specificData.material_id = parseInt(formData.get('material_id'));
            const diams = formData.getAll('diametros');
            diametrosList = diams.map(d => parseInt(d));
            if (!specificData.material_id) return fail(400, { message: 'Material requerido' });
        } 
        else if (tipo_producto === 'hierros_galvanizados') {
            const diams = formData.getAll('diametros');
            diametrosList = diams.map(d => parseInt(d));
        }
        else if (['griferia', 'materiales_electricos'].includes(tipo_producto)) {
            specificData.descripcion_id = parseInt(formData.get('descripcion_id'));
            if (!specificData.descripcion_id) return fail(400, { message: 'Descripción / Subtipo requerido' });
        }

        try {
            await productService.upsertProduct(
                id ? parseInt(id) : null,
                baseData,
                tipo_producto,
                specificData,
                diametrosList,
                image
            );
            return { success: true };
        } catch (error) {
            console.error('Error in upsert action:', error);
            return fail(500, { message: 'Error al servidor intentando guardar el producto' });
        }
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) return fail(400, { message: 'ID no proporcionado' });

        try {
            await productService.deleteProduct(parseInt(id));
            return { success: true };
        } catch (error) {
            console.error('Error deleting product:', error);
            return fail(500, { message: 'Error al eliminar el producto' });
        }
    },

    createMaterial: async ({ request }) => {
        const formData = await request.formData();
        const tipo = formData.get('tipo');
        const nombre = formData.get('nombre');

        if (!tipo || !nombre) return fail(400, { message: 'Datos incompletos para crear material' });

        try {
            const newObj = await productService.createMaterialInline(tipo, nombre);
            return { success: true, created: newObj, type: 'material', subType: tipo };
        } catch (error) {
            console.error('Error createMaterial:', error);
            return fail(500, { message: 'Error creando material' });
        }
    },

    createDiametro: async ({ request }) => {
        const formData = await request.formData();
        const tipo = formData.get('tipo');
        const medida = formData.get('medida');
        const medida_decimal = formData.get('medida_decimal') ? parseFloat(formData.get('medida_decimal')) : null;

        if (!tipo || !medida) return fail(400, { message: 'Datos incompletos para crear diámetro' });

        try {
            const newObj = await productService.createDiametroInline(tipo, medida, medida_decimal);
            return { success: true, created: newObj, type: 'diametro', subType: tipo };
        } catch (error) {
            console.error('Error createDiametro:', error);
            return fail(500, { message: 'Error interno' });
        }
    },

    updateCatalogItem: async ({ request }) => {
        const formData = await request.formData();
        const catalogType = formData.get('catalogType');
        const subType = formData.get('subType');
        const id = parseInt(formData.get('id'));
        const nombre = formData.get('nombre');
        const medida = formData.get('medida');
        const medida_decimal = formData.get('medida_decimal') ? parseFloat(formData.get('medida_decimal')) : null;

        if (!catalogType || !subType || isNaN(id)) return fail(400, { message: 'Datos incompletos.' });

        try {
            const newData = catalogType === 'material' ? { nombre } : { medida, medida_decimal };
            const updated = await productService.updateCatalogInline(catalogType, subType, id, newData);
            return { success: true, updated };
        } catch (error) {
            console.error('Error actualizando catálogo:', error);
            return fail(500, { message: 'Error al actualizar.' });
        }
    },

    deleteCatalogItem: async ({ request }) => {
        const formData = await request.formData();
        const catalogType = formData.get('catalogType');
        const subType = formData.get('subType');
        const id = parseInt(formData.get('id'));

        if (!catalogType || !subType || isNaN(id)) return fail(400, { message: 'Faltan parámetros.' });

        try {
            await productService.deleteCatalogInline(catalogType, subType, id);
            return { success: true };
        } catch (error) {
            console.error('Error eliminando catálogo:', error);
            if (error.code === '23503') {
                return fail(400, { message: 'No se puede eliminar porque hay productos ligados a este registro.' });
            }
            return fail(500, { message: 'Error al eliminar el registro de catálogo.' });
        }
    }
};
