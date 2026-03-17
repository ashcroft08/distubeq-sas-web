<script>
    import ProductTable from '$lib/components/admin/ProductTable.svelte';

    const mockProducts = [
        {
            id: 1,
            name: 'Martillo de Garra 16oz',
            sku: 'HT-88219',
            category: 'Herramientas',
            categoryColor: 'bg-blue-100 text-blue-800',
            price: 24.90,
            active: true,
            image: 'https://images.unsplash.com/photo-1586864387917-f53bc2644343?auto=format&fit=crop&q=80&w=100&h=100'
        },
        {
            id: 2,
            name: 'Pintura Vinilo Blanco Galón',
            sku: 'PT-0043',
            category: 'Pinturas',
            categoryColor: 'bg-purple-100 text-purple-800',
            price: 85.00,
            active: false,
            image: 'https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&q=80&w=100&h=100'
        },
        {
            id: 3,
            name: 'Taladro Percutor 500W',
            sku: 'EP-1290',
            category: 'Eléctricos',
            categoryColor: 'bg-amber-100 text-amber-800',
            price: 189.90,
            active: true,
            image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=100&h=100'
        }
    ];
</script>

<div class="space-y-6">
    <!-- Filter Bar -->
    <section class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div class="flex flex-col md:flex-row gap-4 items-center">
            <div class="relative flex-1 w-full text-slate-400 focus-within:text-[#f97316] transition-colors">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                </span>
                <input class="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-0 focus:border-[#f97316] outline-none transition-all text-sm text-slate-600 bg-gray-50/50" placeholder="Buscar por nombre o SKU..." type="text"/>
            </div>
            <div class="flex flex-wrap gap-4 w-full md:w-auto">
                <select class="block w-full md:w-48 pl-3 pr-10 py-2.5 text-sm border-slate-200 focus:outline-none focus:border-[#f97316] rounded-lg bg-gray-50/50">
                    <option value="">Todas las categorías</option>
                    <option>Herramientas Manuales</option>
                    <option>Plomería</option>
                    <option>Construcción</option>
                    <option>Eléctricos</option>
                </select>
                <select class="block w-full md:w-40 pl-3 pr-10 py-2.5 text-sm border-slate-200 focus:outline-none focus:border-[#f97316] rounded-lg bg-gray-50/50">
                    <option value="">Estado</option>
                    <option>Activo</option>
                    <option>Inactivo</option>
                </select>
            </div>
        </div>
    </section>

    <ProductTable products={mockProducts} />
</div>
