<script>
    import { enhance } from '$app/forms';
    import { fade, slide, scale } from 'svelte/transition';

    let { data } = $props();
    let categorias = $derived(data.categorias || []);

    // State for modal
    let showModal = $state(false);
    let editingCategory = $state(null);
    let isDeleting = $state(null);
    let isSubmitting = $state(false);

    // Form fields
    let nombre = $state('');
    let imagePreview = $state(null);
    let imageFile = $state(null);

    function openAddModal() {
        editingCategory = null;
        nombre = '';
        imagePreview = null;
        imageFile = null;
        showModal = true;
    }

    function openEditModal(categoria) {
        editingCategory = categoria;
        nombre = categoria.nombre;
        imagePreview = categoria.imagenUrl;
        imageFile = null;
        showModal = true;
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            imageFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    function closeModal() {
        showModal = false;
        editingCategory = null;
    }
</script>

<div class="space-y-8 pb-12">
    <!-- Action Toolbar -->
    <div class="flex flex-col sm:flex-row items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm gap-4">
        <div class="flex items-center gap-4 w-full sm:w-auto">
            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-slate-500">Total Categorías</p>
                <p class="text-2xl font-bold text-slate-900 leading-none">{categorias.length}</p>
            </div>
        </div>
        <button 
            onclick={openAddModal}
            class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95 whitespace-nowrap group"
        >
            <svg class="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Categoría
        </button>
    </div>

    <!-- Categories Grid -->
    {#if categorias.length === 0}
        <div class="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center" in:fade>
            <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900">No hay categorías</h3>
            <p class="text-slate-500 mt-2 max-w-sm mx-auto">Comienza agregando tu primera categoría para organizar tus productos.</p>
            <button onclick={openAddModal} class="mt-8 text-blue-600 font-bold hover:underline">Agregar ahora &rarr;</button>
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {#each categorias as categoria (categoria.id_categoria)}
                <div 
                    class="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative flex flex-col"
                    in:scale={{ duration: 400, start: 0.95 }}
                >
                    <!-- Image Container (Square) -->
                    <div class="aspect-square w-full relative overflow-hidden bg-slate-50">
                        {#if categoria.imagenUrl}
                            <img 
                                src={categoria.imagenUrl} 
                                alt={categoria.nombre} 
                                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        {:else}
                            <div class="w-full h-full flex items-center justify-center text-slate-300">
                                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                            </div>
                        {/if}
                        
                        <!-- Overlay Actions -->
                        <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                            <button 
                                onclick={() => openEditModal(categoria)}
                                class="p-3 bg-white text-slate-900 rounded-full hover:bg-blue-600 hover:text-white transition-colors shadow-lg shadow-black/20"
                                title="Editar"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <form method="POST" action="?/delete" use:enhance={() => {
                                isDeleting = categoria.id_categoria;
                                return async ({ update }) => {
                                    isDeleting = null;
                                    await update();
                                };
                            }}>
                                <input type="hidden" name="id" value={categoria.id_categoria} />
                                <button 
                                    class="p-3 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-lg shadow-black/20"
                                    title="Eliminar"
                                    disabled={isDeleting === categoria.id_categoria}
                                >
                                    {#if isDeleting === categoria.id_categoria}
                                        <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 4V2m0 20v-2m8-8h2M2 12h2m15.364 7.364l-1.414-1.414M6.05 6.05L4.636 4.636m13.314 0l-1.414 1.414M6.05 17.95l-1.414 1.414" stroke-width="2" stroke-linecap="round"/></svg>
                                    {:else}
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    {/if}
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-5 flex-1 flex flex-col">
                        <h3 class="text-xl font-bold text-slate-800 uppercase tracking-wide truncate">{categoria.nombre}</h3>
                        <div class="mt-auto pt-4 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>ID: {categoria.id_categoria}</span>
                            <span>{new Date(categoria.updated_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<!-- Modal -->
{#if showModal}
    <div 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        in:fade={{ duration: 200 }}
        onclick={(e) => e.target === e.currentTarget && closeModal()}
    >
        <div 
            class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            in:scale={{ duration: 300, start: 0.9 }}
        >
            <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 class="text-2xl font-bold text-slate-900">
                    {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                </h3>
                <button onclick={closeModal} class="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <form 
                method="POST" 
                action="?/upsert" 
                use:enhance={() => {
                    isSubmitting = true;
                    return async ({ update }) => {
                        isSubmitting = false;
                        showModal = false;
                        await update();
                    };
                }}
                class="p-8 space-y-6"
                enctype="multipart/form-data"
            >
                <input type="hidden" name="id_categoria" value={editingCategory?.id_categoria || ''} />

                <!-- Name Field -->
                <div class="space-y-2">
                    <label for="nombre" class="text-sm font-bold text-slate-700 uppercase tracking-wider">Nombre de la Categoría</label>
                    <input 
                        type="text" 
                        name="nombre" 
                        id="nombre"
                        bind:value={nombre}
                        placeholder="Ej. Tuberías, Válvulas..."
                        class="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg"
                        required
                    />
                </div>

                <!-- Image Field -->
                <div class="space-y-4">
                    <label class="text-sm font-bold text-slate-700 uppercase tracking-wider block">Imagen Representativa (Cuadrada)</label>
                    
                    <div class="flex flex-col items-center justify-center gap-6">
                        <!-- Input always in DOM to ensure formData submission -->
                        <input type="file" id="imageInput" name="image" accept="image/*" class="hidden" onchange={handleImageChange} />

                        {#if imagePreview}
                            <div class="relative group w-48 h-48 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white">
                                <img src={imagePreview} alt="Preview" class="w-full h-full object-cover" />
                                <button 
                                    type="button" 
                                    onclick={() => { 
                                        imagePreview = null; 
                                        imageFile = null; 
                                        const input = document.getElementById('imageInput');
                                        if (input) input.value = '';
                                    }}
                                    class="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold"
                                >
                                    Quitar Imagen
                                </button>
                            </div>
                        {:else}
                            <label for="imageInput" class="w-full h-48 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
                                <svg class="w-12 h-12 text-slate-400 group-hover:text-blue-500 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                                <span class="text-slate-500 font-medium">Click para subir imagen</span>
                                <span class="text-slate-400 text-xs mt-1">Sugerido: 800x800px</span>
                            </label>
                        {/if}
                    </div>
                </div>

                <!-- Actions -->
                <div class="pt-6 flex gap-3">
                    <button 
                        type="button" 
                        onclick={closeModal}
                        class="flex-1 px-6 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        class="flex-[2] px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {#if isSubmitting}
                            <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 4V2m0 20v-2m8-8h2M2 12h2m15.364 7.364l-1.414-1.414M6.05 6.05L4.636 4.636m13.314 0l-1.414 1.414M6.05 17.95l-1.414 1.414" stroke-width="2" stroke-linecap="round"/></svg>
                            Guardando...
                        {:else}
                            {editingCategory ? 'Actualizar Categoría' : 'Crear Categoría'}
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    /* Premium glassmorphism effects and animations already handled via Tailwind and Svelte transitions */
</style>
