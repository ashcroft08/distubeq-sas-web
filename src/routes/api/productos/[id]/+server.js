import { json } from '@sveltejs/kit';
import { productRepository } from '$lib/server/repositories/product.repository';

export async function GET({ params }) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) return json({ error: 'Invalid ID' }, { status: 400 });

        const product = await productRepository.findById(id);
        if (!product) return json({ error: 'Not found' }, { status: 404 });

        return json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}
