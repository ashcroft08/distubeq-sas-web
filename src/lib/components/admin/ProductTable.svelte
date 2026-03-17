<script>
    import { fade } from 'svelte/transition';

    let { products = [], onEdit, onDelete, onToggleStatus } = $props();

    let searchTerm = $state('');
    let sortColumn = $state('nombreCompleto');
    let sortDirection = $state('asc');

    // Derived filtered and sorted products
    let filteredProducts = $derived.by(() => {
        let result = products.filter(p => {
            const search = searchTerm.toLowerCase();
            return (
                p.nombreCompleto?.toLowerCase().includes(search) ||
                p.material?.nombre?.toLowerCase().includes(search) ||
                p.diametro?.medida?.toLowerCase().includes(search) ||
                p.fabricante?.toLowerCase().includes(search)
            );
        });

        result.sort((a, b) => {
            let valA, valB;

            if (sortColumn === 'material') {
                valA = a.material?.nombre || '';
                valB = b.material?.nombre || '';
            } else if (sortColumn === 'diametro') {
                valA = a.diametros?.map(d => d.diametro?.medida).sort().join(', ') || '';
                valB = b.diametros?.map(d => d.diametro?.medida).sort().join(', ') || '';
            } else {
                valA = a[sortColumn] || '';
                valB = b[sortColumn] || '';
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    });

    /** @param {string} column */
    function toggleSort(column) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }
    }

    const columns = [
        { key: 'imagen', label: 'Imagen', align: 'center' },
        { key: 'nombreCompleto', label: 'Producto' },
        { key: 'material', label: 'Material' },
        { key: 'diametro', label: 'Diámetro' },
        { key: 'fabricante', label: 'Fabricante' },
        { key: 'estado', label: 'Estado', align: 'center' }
    ];
</script>

<div class="space-y-4">
    <!-- Filters & Search Bar -->
    <div class="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div class="relative w-full md:w-96">
            <input 
                type="text" 
                placeholder="Buscar productos, materiales, diámetros..."
                bind:value={searchTerm}
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none transition-all text-sm"
            />
            <svg class="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
        
        <div class="text-sm text-slate-500">
            Total: <span class="font-bold text-slate-900">{filteredProducts.length}</span> productos
        </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto sidebar-scroll">
            <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                    <tr>
                        {#each columns as col (col.key)}
                            <th 
                                class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors {col.align === 'center' ? 'text-center' : ''}"
                                onclick={() => toggleSort(col.key)}
                            >
                                <div class="flex items-center gap-2 {col.align === 'center' ? 'justify-center' : ''}">
                                    {col.label}
                                    {#if sortColumn === col.key}
                                        <svg class="w-3 h-3 text-[#f97316]" fill="currentColor" viewBox="0 0 20 20">
                                            {#if sortDirection === 'asc'}
                                                <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                                            {:else}
                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            {/if}
                                        </svg>
                                    {:else}
                                        <svg class="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    {/if}
                                </div>
                            </th>
                        {/each}
                        <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-slate-200">
                    {#each filteredProducts as product (product.idProducto)}
                        <tr class="hover:bg-slate-50 transition-colors group" in:fade>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex justify-center">
                                    <div class="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                                        {#if product.imagenUrl}
                                            <img src={product.imagenUrl} alt={product.nombreCompleto} class="w-full h-full object-cover" />
                                        {:else}
                                            <div class="w-full h-full flex items-center justify-center bg-slate-100">
                                                <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-sm font-semibold text-slate-900 line-clamp-1">{product.nombreCompleto}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 italic">
                                    {product.material?.nombre || 'N/A'}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                                {product.diametros?.length > 0 
                                    ? product.diametros.map(d => d.diametro?.medida).join(', ') 
                                    : 'N/A'}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 italic">
                                {product.fabricante || 'Genérico'}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center">
                                <button 
                                    onclick={() => onToggleStatus?.(product)}
                                    aria-label={product.estado ? 'Desactivar producto' : 'Activar producto'}
                                    class="relative inline-flex shrink-0 h-5 w-10 border-2 border-transparent rounded-full cursor-pointer transition-colors duration-200 focus:outline-none {product.estado ? 'bg-green-500' : 'bg-slate-300'}" 
                                    type="button"
                                >
                                    <span class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition duration-200 {product.estado ? 'translate-x-5' : 'translate-x-0'}"></span>
                                </button>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button 
                                    onclick={() => onEdit?.(product)}
                                    class="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all" 
                                    title="Editar"
                                >
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                    </svg>
                                </button>
                                <button 
                                    onclick={() => onDelete?.(product)}
                                    class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                                    title="Eliminar"
                                >
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="6" class="px-6 py-12 text-center">
                                <div class="flex flex-col items-center justify-center space-y-3">
                                    <div class="p-3 bg-slate-50 rounded-full">
                                        <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <p class="text-slate-500 font-medium">No se encontraron productos registrados.</p>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
<style>
.sidebar-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
.sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
.sidebar-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
