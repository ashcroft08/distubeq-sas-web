<script>
    import { enhance } from '$app/forms';
    import { fade, scale, slide } from 'svelte/transition';

    let { data, form } = $props();

    let productos = $derived(data.productos || []);
    let categorias = $derived(data.categorias || []);
    
    // Mutable catalog state so we can push newly created inline items to it
    let catalogos = $state(JSON.parse(JSON.stringify(data.catalogos)));

    // Modal State
    let showModal = $state(false);
    let editingProduct = $state(null);
    let isDeleting = $state(null);
    let isSubmitting = $state(false);

    // Form fields
    let currentTab = $state(1); // 1 = Info Base, 2 = Atributos Específicos
    let nombre = $state('');
    let fabricante = $state('');
    let descripcion = $state('');
    let id_categoria = $state('');
    let estado = $state(true);
    let imagePreview = $state(null);
    
    let tipo_producto = $state('');
    let material_id = $state('');
    let descripcion_id = $state('');
    let diametros = $state([]); // multiselect array
    let caracteristicas = $state([]); // multiselect array for griferia

    // Inline CRUD state
    let showQuickAddModal = $state(false);
    let quickAddType = $state(''); // 'material', 'diametro', 'descripcion'
    let quickAddTargetSubtype = $state(''); // e.g. 'tuberias'
    let quickAddValue = $state('');
    let quickAddDecimal = $state('');
    let isQuickAdding = $state(false);
    
    // Catalog Admin Modal State
    let showAdminModal = $state(false);
    let adminModalType = $state('material'); // 'material' or 'diametro'
    let adminModalSubType = $state('tuberias');
    let editCatalogId = $state(null);
    let editCatalogValue = $state('');
    let editCatalogDecimal = $state('');
    let isAdminSubmitting = $state(false);

    function resetForm() {
        editingProduct = null;
        currentTab = 1;
        nombre = '';
        fabricante = '';
        descripcion = '';
        id_categoria = '';
        estado = true;
        imagePreview = null;
        
        tipo_producto = '';
        material_id = '';
        descripcion_id = '';
        diametros = [];
        caracteristicas = [];
        
        const fileInput = document.getElementById('imageInput');
        if (fileInput) fileInput.value = '';
    }

    function openAddModal() {
        resetForm();
        showModal = true;
    }

    function openEditModal(prod) {
        resetForm();
        editingProduct = prod;

        nombre = prod.nombre;
        fabricante = prod.fabricante || '';
        descripcion = prod.descripcion || '';
        id_categoria = prod.id_categoria;
        estado = prod.estado;
        imagePreview = prod.imagen_url;

        // Fetch complex details lazily or they should be in the DB response
        // Wait, the repository findById returns subtype details. We need to fetch it to edit.
        // It's better to fetch the product details via a small helper or embed them? 
        // For simplicity, let's load it from a server API.
        loadProductFullData(prod.id_producto);
    }

    async function loadProductFullData(id) {
        try {
            const res = await fetch(`/api/productos/${id}`);
            if (res.ok) {
                const detailedProd = await res.json();
                
                tipo_producto = detailedProd.tipo_producto || '';
                descripcion = detailedProd.descripcion || '';
                
                // Atributos específicos
                if (detailedProd.atributos_especificos) {
                    if (['tuberias', 'linea_plastica'].includes(tipo_producto)) {
                        material_id = detailedProd.atributos_especificos.id_tuberia_material || detailedProd.atributos_especificos.id_linea_plastica_material || '';
                    }
                }
                
                if (detailedProd.diametros && Array.isArray(detailedProd.diametros)) {
                    if (['griferia', 'materiales_electricos', 'quimicos', 'herramientas'].includes(tipo_producto)) {
                        caracteristicas = detailedProd.diametros;
                    } else {
                        diametros = detailedProd.diametros;
                    }
                } else {
                    diametros = [];
                    caracteristicas = [];
                }
                
                showModal = true;
            } else {
                alert("Error al cargar la información completa del producto.");
            }
        } catch (e) {
            console.error(e);
            alert("Error de conexión al cargar datos.");
        }
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => imagePreview = e.target.result;
            reader.readAsDataURL(file);
        }
    }

    // Inline CRUD Logic
    function triggerQuickAdd(type, fromAdmin = false) {
        if (fromAdmin) {
            showAdminModal = false;
            tipo_producto = adminModalSubType;
        }
        quickAddType = type;
        quickAddTargetSubtype = tipo_producto;
        quickAddValue = '';
        quickAddDecimal = '';
        showQuickAddModal = true;
    }

    function openCatalogAdminModal(type) {
        adminModalType = type;
        adminModalSubType = 'tuberias';
        editCatalogId = null;
        showAdminModal = true;
    }

</script>

<div class="space-y-8 pb-12">
    <!-- Action Toolbar -->
    <div class="flex flex-col sm:flex-row items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm gap-4">
        <div class="flex items-center gap-4 w-full sm:w-auto">
            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-slate-500">Total Productos</p>
                <p class="text-2xl font-bold text-slate-900 leading-none">{productos.length}</p>
            </div>
        </div>
        <div class="flex gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <button type="button" onclick={() => openCatalogAdminModal('material')} class="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3.5 rounded-xl font-bold transition-all whitespace-nowrap">
                Materiales
            </button>
            <button type="button" onclick={() => openCatalogAdminModal('diametro')} class="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3.5 rounded-xl font-bold transition-all whitespace-nowrap">
                Diámetros
            </button>
            <button 
                onclick={openAddModal}
                class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95 whitespace-nowrap group"
            >
                <svg class="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /></svg>
                Nuevo Producto
            </button>
        </div>
    </div>

    <!-- Products Grid/Table -->
    {#if productos.length === 0}
        <div class="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center" in:fade>
            <h3 class="text-xl font-bold text-slate-900">No hay productos</h3>
            <p class="text-slate-500 mt-2">Agrega productos para armar tu catálogo.</p>
        </div>
    {:else}
        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th class="px-6 py-4">Imagen</th>
                            <th class="px-6 py-4">Nombre</th>
                            <th class="px-6 py-4">Fabricante</th>
                            <th class="px-6 py-4">Categoría</th>
                            <th class="px-6 py-4">Material</th>
                            <th class="px-6 py-4">Variantes</th>
                            <th class="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        {#each productos as prod}
                            <tr class="hover:bg-slate-50/80 transition-colors group">
                                <td class="px-6 py-4 w-24">
                                    <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                                        {#if prod.imagen_url}
                                            <img src={prod.imagen_url} alt={prod.nombre} class="w-full h-full object-cover">
                                        {:else}
                                            <span class="text-[10px] text-slate-400 font-bold uppercase">Sin foto</span>
                                        {/if}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <h3 class="font-bold text-slate-900 text-base" title={prod.nombre}>{prod.nombre}</h3>
                                </td>
                                <td class="px-6 py-4 text-slate-600 text-sm font-medium">
                                    {prod.fabricante || '---'}
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide rounded-lg">
                                        {prod.categoria}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    {#if prod.material}
                                        <span class="px-2 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">{prod.material}</span>
                                    {:else}
                                        <span class="text-slate-300">---</span>
                                    {/if}
                                </td>
                                <td class="px-6 py-4 text-xs font-medium text-slate-600 max-w-[150px]">
                                    {#if prod.diametros_text}
                                        <div class="line-clamp-2" title={prod.diametros_text}>{prod.diametros_text}</div>
                                    {:else}
                                        <span class="text-slate-300">---</span>
                                    {/if}
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button type="button" onclick={() => openEditModal(prod)} class="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors" title="Editar">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <form action="?/delete" method="POST" use:enhance onsubmit={(e) => { if (!confirm('¿Seguro que deseas eliminar este producto?')) e.preventDefault(); }}>
                                            <input type="hidden" name="id" value={prod.id_producto}>
                                            <button type="submit" class="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors" title="Eliminar">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</div>

<!-- Modal Form -->
{#if showModal}
    <div class="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" style="z-index: 100;" in:fade={{ duration: 200 }}>
        <div class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 class="text-2xl font-bold text-slate-900">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                <button onclick={() => showModal = false} class="p-2 hover:bg-slate-100 rounded-full text-slate-500 font-bold w-10 h-10 flex items-center justify-center">X</button>
            </div>

            <!-- Custom Tabs -->
            <div class="flex border-b border-slate-100 px-8 shrink-0">
                <button 
                    onclick={() => currentTab = 1} 
                    class="px-4 py-3 font-bold border-b-2 {currentTab === 1 ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}"
                >Información Base</button>
                <button 
                    onclick={() => currentTab = 2} 
                    class="px-4 py-3 font-bold border-b-2 {currentTab === 2 ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}"
                >Atributos y Tipo</button>
            </div>

            <form action="?/upsert" method="POST" enctype="multipart/form-data" use:enhance={() => {
                isSubmitting = true;
                return async ({ result, update }) => { 
                    isSubmitting = false; 
                    if (result.type === 'failure') {
                        alert(result.data?.message || 'Error de validación al guardar.');
                    } else if (result.type === 'error') {
                        alert('Error interno en el servidor.');
                    } else if (result.type === 'success') {
                        showModal = false; 
                        resetForm();
                    }
                    await update(); 
                };
            }} class="overflow-y-auto p-8 space-y-6 flex-1">
                <input type="hidden" name="id_producto" value={editingProduct?.id_producto || ''}>

                <div class="{currentTab === 1 ? 'grid' : 'hidden'} grid-cols-1 gap-6" in:fade>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-700 uppercase">Nombre</label>
                            <input type="text" name="nombre" bind:value={nombre} class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" required>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-slate-700 uppercase">Categoría</label>
                                <select name="id_categoria" bind:value={id_categoria} class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" required>
                                    <option value="" disabled>Seleccione...</option>
                                    {#each categorias as cat}
                                        <option value={cat.id_categoria}>{cat.nombre}</option>
                                    {/each}
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-slate-700 uppercase">Fabricante</label>
                                <input type="text" name="fabricante" bind:value={fabricante} class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-700 uppercase">Descripción / Detalles</label>
                            <textarea name="descripcion" bind:value={descripcion} rows="3" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"></textarea>
                        </div>

                        <!-- Imagen -->
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-700 uppercase">Imagen</label>
                            <input type="file" id="imageInput" name="image" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onchange={handleImageChange}>
                            {#if imagePreview}
                                <img src={imagePreview} class="mt-4 h-32 w-32 object-cover rounded-2xl shadow-sm border border-slate-200" alt="Preview">
                            {/if}
                        </div>
                    </div>

                <div class="{currentTab === 2 ? 'block' : 'hidden'} space-y-6" in:fade>
                        <div class="space-y-2 bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <label class="text-sm font-bold text-blue-900 uppercase tracking-wide">Clase de Producto (Subtipo)</label>
                            <select name="tipo_producto" bind:value={tipo_producto} class="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl font-medium" required>
                                <option value="" disabled>Seleccione un tipo...</option>
                                <option value="tuberias">Tuberías</option>
                                <option value="linea_plastica">Línea Plástica</option>
                                <option value="hierros_galvanizados">Hierros Galvanizados</option>
                                <option value="griferia">Grifería</option>
                                <option value="materiales_electricos">Materiales Eléctricos</option>
                                <option value="quimicos">Químicos</option>
                                <option value="herramientas">Herramientas</option>
                            </select>
                            <p class="text-xs text-blue-600 mt-2">Dependiendo del tipo, aparecerán campos específicos requeridos.</p>
                        </div>

                        <!-- CAMPOS DINÁMICOS DEPENDIENDO DEL TIPO -->
                        
                        <!-- 1. TUBERIAS / LINEA PLASTICA -->
                        {#if ['tuberias', 'linea_plastica'].includes(tipo_producto)}
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-slate-100 rounded-2xl bg-slate-50">
                                
                                <div class="space-y-2">
                                    <label class="text-sm font-bold text-slate-700 uppercase flex items-center justify-between">
                                        Material
                                        <button type="button" onclick={() => triggerQuickAdd('material')} class="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1">+ Nuevo</button>
                                    </label>
                                    <select name="material_id" bind:value={material_id} class="w-full px-4 py-2 border rounded-xl" required>
                                        <option value="">Seleccione...</option>
                                        {#if catalogos[tipo_producto]?.materiales}
                                            {#each catalogos[tipo_producto].materiales as mat}
                                                <option value={mat.id_tuberia_material || mat.id_linea_plastica_material}>{mat.nombre}</option>
                                            {/each}
                                        {/if}
                                    </select>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-sm font-bold text-slate-700 uppercase flex items-center justify-between">
                                        Diámetros Disponibles
                                        <button type="button" onclick={() => triggerQuickAdd('diametro')} class="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1">+ Nuevo</button>
                                    </label>
                                    <div class="grid grid-cols-2 gap-3 bg-white p-4 border rounded-xl max-h-48 overflow-y-auto">
                                        {#if catalogos[tipo_producto]?.diametros}
                                            {#each catalogos[tipo_producto].diametros as diam}
                                                <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-blue-50 border border-transparent has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-colors">
                                                    <input type="checkbox" name="diametros" value={diam.id_diametro_tuberia || diam.id_diametro_linea_plastica} bind:group={diametros} class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500">
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-bold text-slate-700">{diam.medida}"</span>
                                                        {#if diam.medida_decimal}
                                                            <span class="text-[10px] text-slate-500 font-medium">({diam.medida_decimal} cm)</span>
                                                        {/if}
                                                    </div>
                                                </label>
                                            {/each}
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        {/if}

                        <!-- 2. HIERROS GALVANIZADOS -->
                        {#if tipo_producto === 'hierros_galvanizados'}
                            <div class="p-6 border border-slate-100 rounded-2xl bg-slate-50 space-y-2">
                                <label class="text-sm font-bold text-slate-700 uppercase flex items-center justify-between">
                                    Diámetros Disponibles
                                    <button type="button" onclick={() => triggerQuickAdd('diametro')} class="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1">+ Nuevo</button>
                                </label>
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-3 bg-white p-4 border rounded-xl max-h-48 overflow-y-auto">
                                    {#if catalogos.hierros_galvanizados?.diametros}
                                        {#each catalogos.hierros_galvanizados.diametros as diam}
                                            <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-blue-50 border border-transparent has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-colors">
                                                <input type="checkbox" name="diametros" value={diam.id_diametro_hierro_galvanizado} bind:group={diametros} class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500">
                                                <div class="flex flex-col">
                                                        <span class="text-sm font-bold text-slate-700">{diam.medida}"</span>
                                                        {#if diam.medida_decimal}
                                                            <span class="text-[10px] text-slate-500 font-medium">({diam.medida_decimal} cm)</span>
                                                        {/if}
                                                </div>
                                            </label>
                                        {/each}
                                    {/if}
                                </div>
                            </div>
                        {/if}

                        <!-- 3. GRIFERIA / ELECTRICOS / QUIMICOS / HERRAMIENTAS -->
                        {#if ['griferia', 'materiales_electricos', 'quimicos', 'herramientas'].includes(tipo_producto)}
                            <div class="p-6 border border-slate-100 rounded-2xl bg-slate-50 space-y-2">
                                <label class="text-sm font-bold text-slate-700 uppercase flex items-center justify-between">
                                    Características / Atributos
                                    <button type="button" onclick={() => triggerQuickAdd('material')} class="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1">+ Nuevo</button>
                                </label>
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-3 bg-white p-4 border rounded-xl max-h-48 overflow-y-auto">
                                    {#if catalogos[tipo_producto]?.caracteristicas}
                                        {#each catalogos[tipo_producto].caracteristicas as car}
                                            <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-blue-50 border border-transparent has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-colors">
                                                <input type="checkbox" name="caracteristicas" value={car.id_caracteristica_griferia || car.id_caracteristica_material_electrico || car.id_caracteristica_quimico || car.id_caracteristica_herramienta} bind:group={caracteristicas} class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500">
                                                <span class="text-sm font-bold text-slate-700">{car.nombre}</span>
                                            </label>
                                        {/each}
                                    {/if}
                                </div>
                            </div>
                        {/if}
                    </div>

                <!-- Tabs Footer Actions -->
                <div class="pt-6 flex justify-between border-t border-slate-100 shrink-0">
                    {#if currentTab === 2}
                        <button type="button" onclick={() => currentTab = 1} class="px-6 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Atrás</button>
                        <button type="submit" disabled={isSubmitting} class="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50">
                            {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
                        </button>
                    {:else}
                        <div></div> <!-- spacing element -->
                        <button type="button" onclick={() => currentTab = 2} class="px-6 py-3 font-bold bg-slate-800 text-white hover:bg-slate-900 rounded-xl shadow-md transition-colors">Siguiente &rarr;</button>
                    {/if}
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- QUICK ADD MODAL (AJAX Inline Creation) -->
{#if showQuickAddModal}
    <div class="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md" style="z-index: 9999;" in:fade={{ duration: 150 }}>
        <form 
            action={quickAddType === 'diametro' ? '?/createDiametro' : '?/createMaterial'} 
            method="POST" 
            class="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl relative" 
            in:scale={{ duration: 150 }}
            use:enhance={() => {
                isQuickAdding = true;
                return async ({ result }) => {
                    isQuickAdding = false;
                    if (result.type === 'success') {
                        const { created, type, subType } = result.data;
                        
                        if (!catalogos[subType]) {
                            catalogos[subType] = { materiales: [], diametros: [], caracteristicas: [] };
                        }
                        
                        if (type === 'material') {
                            if (catalogos[subType].materiales) catalogos[subType].materiales.push(created);
                            if (catalogos[subType].caracteristicas) catalogos[subType].caracteristicas.push(created);
                            
                            // Autoselect it
                            if (['griferia', 'materiales_electricos', 'quimicos', 'herramientas'].includes(subType)) {
                                caracteristicas = [...caracteristicas, created.id_caracteristica_griferia || created.id_caracteristica_material_electrico || created.id_caracteristica_quimico || created.id_caracteristica_herramienta];
                            } else {
                                material_id = created.id_tuberia_material || created.id_linea_plastica_material;
                            }
                        } else if (type === 'diametro') {
                            if (!catalogos[subType].diametros) catalogos[subType].diametros = [];
                            catalogos[subType].diametros.push(created);
                            
                            // Autoselect it
                            const newId = created.id_diametro_tuberia || created.id_diametro_linea_plastica || created.id_diametro_hierro_galvanizado;
                            diametros = [...diametros, newId];
                        }
                        
                        showQuickAddModal = false;
                    } else {
                        alert(result.data?.message || 'Error al guardar');
                    }
                };
            }}
        >
            <h4 class="text-xl font-bold mb-4">
                Añadir Nuevo {quickAddType === 'diametro' ? 'Diámetro' : 'Item'}
            </h4>
            <p class="text-sm text-slate-500 mb-6 uppercase tracking-wider">{quickAddTargetSubtype.replace('_', ' ')}</p>
            
            <input type="hidden" name="tipo" value={quickAddTargetSubtype}>
            
            <input 
                type="text" 
                name={quickAddType === 'diametro' ? 'medida' : 'nombre'}
                bind:value={quickAddValue} 
                class="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl mb-6 font-medium text-slate-900" 
                placeholder={quickAddType === 'diametro' ? 'Ej. 1/2 Pulgada' : 'Nombre descriptivo'} 
                required
                autofocus
            >

            {#if quickAddType === 'diametro'}
                <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Medida Decimal (Opcional)</label>
                <input 
                    type="number" 
                    step="0.01"
                    name="medida_decimal"
                    bind:value={quickAddDecimal}
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl mb-6 font-medium text-slate-900" 
                    placeholder="Ej. 12.70"
                >
            {/if}
            
            <div class="flex gap-3">
                <button type="button" onclick={() => showQuickAddModal = false} class="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancelar</button>
                <button type="submit" disabled={isQuickAdding} class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 disabled:opacity-50">
                    {isQuickAdding ? 'Guardando...' : 'Añadir'}
                </button>
            </div>
        </form>
    </div>
{/if}

<!-- ADMIN CATALOG MODAL -->
{#if showAdminModal}
    <div class="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md" style="z-index: 1000;" in:fade={{ duration: 150 }}>
        <div class="bg-white p-6 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]">
            <div class="flex items-center justify-between border-b pb-4 mb-4">
                <h4 class="text-xl font-bold text-slate-900">
                    Administrar {adminModalType === 'material' ? 'Materiales / Textos' : 'Diámetros'}
                </h4>
                <button onclick={() => showAdminModal = false} class="p-2 bg-slate-100 hover:bg-slate-200 rounded-full font-bold">X</button>
            </div>
            
            <div class="mb-4">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Seleccionar Sub-Tipo (Clase)</label>
                <select bind:value={adminModalSubType} class="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 bg-slate-50 focus:ring-blue-500">
                    <option value="tuberias">Tuberías</option>
                    <option value="linea_plastica">Línea Plástica</option>
                    <option value="hierros_galvanizados">Hierros Galvanizados</option>
                    {#if adminModalType === 'material'}
                        <option value="griferia">Grifería</option>
                        <option value="materiales_electricos">Materiales Eléctricos</option>
                        <option value="quimicos">Químicos</option>
                        <option value="herramientas">Herramientas</option>
                    {/if}
                </select>
            </div>

            <div class="flex-1 overflow-y-auto pr-2 space-y-2">
                {#if catalogos[adminModalSubType]}
                    {@const renderList = adminModalType === 'material' ? (catalogos[adminModalSubType].materiales || catalogos[adminModalSubType].caracteristicas) : catalogos[adminModalSubType].diametros}
                    
                    {#if renderList && renderList.length > 0}
                        {#each renderList as item}
                            {@const itemId = item.id_tuberia_material || item.id_linea_plastica_material || item.id_caracteristica_griferia || item.id_caracteristica_material_electrico || item.id_caracteristica_quimico || item.id_caracteristica_herramienta || item.id_diametro_tuberia || item.id_diametro_linea_plastica || item.id_diametro_hierro_galvanizado}
                            
                            <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl group transition-all hover:bg-blue-50/50">
                                {#if editCatalogId === itemId}
                                    <form action="?/updateCatalogItem" method="POST" class="flex flex-col sm:flex-row gap-2 w-full" use:enhance={() => {
                                        isAdminSubmitting = true;
                                        return async ({ result }) => {
                                            isAdminSubmitting = false;
                                            if (result.type === 'success') {
                                                editCatalogId = null;
                                                window.location.reload(); // Simple reload to refresh the cached load data instead of complex mutation
                                            } else {
                                                alert(result.data?.message || 'Error updating');
                                            }
                                        }
                                    }}>
                                        <input type="hidden" name="catalogType" value={adminModalType}>
                                        <input type="hidden" name="subType" value={adminModalSubType}>
                                        <input type="hidden" name="id" value={itemId}>
                                        
                                        <div class="flex flex-1 gap-2">
                                            <input type="text" name={adminModalType === 'material' ? 'nombre' : 'medida'} bind:value={editCatalogValue} class="flex-1 px-3 py-2 border rounded-lg text-sm" required autofocus>
                                            {#if adminModalType === 'diametro'}
                                                <input type="number" step="0.01" name="medida_decimal" bind:value={editCatalogDecimal} class="w-24 px-3 py-2 border rounded-lg text-sm" placeholder="Decimal">
                                            {/if}
                                        </div>
                                        <div class="flex gap-2">
                                            <button type="submit" disabled={isAdminSubmitting} class="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">Guardar</button>
                                            <button type="button" onclick={() => editCatalogId = null} class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold">Cancelar</button>
                                        </div>
                                    </form>
                                {:else}
                                    <div>
                                        <h5 class="font-bold text-slate-800">{adminModalType === 'material' ? item.nombre : item.medida + '"'}</h5>
                                        {#if adminModalType === 'diametro' && item.medida_decimal}
                                            <p class="text-xs text-slate-500">{item.medida_decimal} cm</p>
                                        {/if}
                                    </div>
                                    
                                    <div class="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <button onclick={() => { editCatalogId = itemId; editCatalogValue = adminModalType === 'material' ? item.nombre : item.medida; editCatalogDecimal = adminModalType === 'diametro' ? item.medida_decimal : ''; }} class="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                        <form action="?/deleteCatalogItem" method="POST" use:enhance={() => {
                                            return async ({ result }) => {
                                                if(result.type === 'failure') alert(result.data?.message);
                                                else if(result.type === 'success') window.location.reload();
                                            }
                                        }}>
                                            <input type="hidden" name="catalogType" value={adminModalType}>
                                            <input type="hidden" name="subType" value={adminModalSubType}>
                                            <input type="hidden" name="id" value={itemId}>
                                            <button type="submit" onclick={(e) => { if(!confirm('¿Eliminar registro?')) e.preventDefault(); }} class="p-2 text-red-600 hover:bg-red-50 rounded-lg"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                        </form>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    {:else}
                        <p class="text-sm text-slate-400 p-4 text-center border-2 border-dashed rounded-xl">No hay registros de {adminModalType} creados en {adminModalSubType.replace('_', ' ')}.</p>
                    {/if}
                {:else}
                    <p class="text-sm text-slate-400 p-4 text-center border-2 border-dashed rounded-xl">No hay registros creados aún.</p>
                {/if}
            </div>
            
            <button onclick={() => triggerQuickAdd(adminModalType, true)} class="mt-6 py-3 w-full border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                Añadir Nuevo
            </button>
        </div>
    </div>
{/if}
