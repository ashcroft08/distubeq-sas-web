<script>
    let { products = [] } = $props();

    function formatPrice(price) {
        return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(price);
    }
</script>

<div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Imagen</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Producto</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">SKU / Ref</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Categoría</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Precio</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
                {#each products as product}
                    <tr class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                <img alt={product.name} class="object-cover" src={product.image}/>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{product.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{product.sku}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium {product.categoryColor || 'bg-blue-100 text-blue-800'}">
                                {product.category}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{formatPrice(product.price)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <button 
                                class="relative inline-flex shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors duration-200 focus:outline-none {product.active ? 'bg-[#f97316]' : 'bg-slate-200'}" 
                                type="button"
                            >
                                <span class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 {product.active ? 'translate-x-5' : 'translate-x-0'}"></span>
                            </button>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                            <button class="text-slate-400 hover:text-slate-800 transition-colors" title="Editar">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                            </button>
                            <button class="text-slate-400 hover:text-red-600 transition-colors" title="Eliminar">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <div class="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
        <div class="text-sm text-slate-500">
            Mostrando <span class="font-medium text-slate-900">1</span> a <span class="font-medium text-slate-900">{products.length}</span> de <span class="font-medium text-slate-900">42</span> resultados
        </div>
        <div class="flex justify-end">
            <nav class="inline-flex rounded-md shadow-sm -space-x-px">
                <button class="px-2 py-2 rounded-l-md border border-slate-300 bg-white text-slate-500 hover:bg-slate-50"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" /></svg></button>
                <button class="px-4 py-2 border border-[#f97316] bg-[#f97316] text-white text-sm font-medium">1</button>
                <button class="px-4 py-2 border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 text-sm font-medium">2</button>
                <button class="px-2 py-2 rounded-r-md border border-slate-300 bg-white text-slate-500 hover:bg-slate-50"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" /></svg></button>
            </nav>
        </div>
    </div>
</div>
