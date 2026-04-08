<script>
    import { enhance } from '$app/forms';

    let { materiales = [], onComplete } = $props();
    
    let currentMaterial = $state(null);
    let loading = $state(false);

    let isEditing = $derived(!!currentMaterial);

    function startEdit(material) {
        currentMaterial = material;
    }

    function cancelEdit() {
        currentMaterial = null;
    }
</script>

<div class="space-y-8">
    <!-- Form Section -->
    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">
            {isEditing ? 'Editar Material' : 'Nuevo Material'}
        </h4>
        <form 
            method="POST" 
            action={isEditing ? '?/updateMaterial' : '?/createMaterial'} 
            use:enhance={() => {
                loading = true;
                return async ({ result, update }) => {
                    await update({ reset: !isEditing });
                    loading = false;
                    if (result.type === 'success') {
                        currentMaterial = null;
                        onComplete?.();
                    }
                };
            }}
            class="space-y-4"
        >
            {#if isEditing}
                <input type="hidden" name="idMaterial" value={currentMaterial.idMaterial} />
            {/if}

            <div class="space-y-1.5">
                <input 
                    type="text" 
                    id="nombre" 
                    name="nombre" 
                    value={currentMaterial?.nombre || ''} 
                    required
                    placeholder="Ej: ACERO INOXIDABLE..."
                    oninput={(e) => { const t = /** @type {HTMLInputElement} */ (e.target); t.value = t.value.toUpperCase(); }}
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#475569]/20 focus:border-[#475569] outline-none transition-all placeholder:text-slate-400 text-sm uppercase bg-white"
                />
            </div>

            <div class="flex gap-2">
                <button 
                    type="submit" 
                    disabled={loading}
                    class="flex-1 bg-[#475569] hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                    {#if loading}
                        <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {/if}
                    <span>{isEditing ? 'Actualizar' : 'Guardar'}</span>
                </button>
                {#if isEditing}
                    <button 
                        type="button"
                        onclick={cancelEdit}
                        class="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        Cancelar
                    </button>
                {/if}
            </div>
        </form>
    </div>

    <!-- List Section -->
    <div class="space-y-3">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Materiales Existentes</h4>
        <div class="max-h-[300px] overflow-y-auto pr-1 space-y-2 sidebar-scroll">
            {#each materiales as m (m.idMaterial)}
                <div class="group flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all">
                    <span class="text-sm font-medium text-slate-700">{m.nombre}</span>
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onclick={() => startEdit(m)}
                            class="p-1.5 text-slate-400 hover:text-[#475569] hover:bg-slate-100 rounded-lg transition-all"
                            title="Editar"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <form 
                            method="POST" 
                            action="?/deleteMaterial" 
                            use:enhance={() => {
                                if (!confirm('¿Eliminar este material?')) return;
                                return async ({ update }) => await update();
                            }}
                        >
                            <input type="hidden" name="id" value={m.idMaterial} />
                            <button 
                                type="submit"
                                class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Eliminar"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            {:else}
                <div class="text-center py-8 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p class="text-sm">No hay materiales registrados</p>
                </div>
            {/each}
        </div>
    </div>
</div>
