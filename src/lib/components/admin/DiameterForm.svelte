<script>
    import { enhance } from '$app/forms';

    let { diametros = [], onComplete } = $props();
    
    let currentDiameter = $state(null);
    let loading = $state(false);

    let isEditing = $derived(!!currentDiameter);

    /** @param {any} diameter */
    function startEdit(diameter) {
        currentDiameter = diameter;
    }

    function cancelEdit() {
        currentDiameter = null;
    }
</script>

<div class="space-y-8">
    <!-- Form Section -->
    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">
            {isEditing ? 'Editar Diámetro' : 'Nuevo Diámetro'}
        </h4>
        <form 
            method="POST" 
            action={isEditing ? '?/updateDiameter' : '?/createDiameter'} 
            use:enhance={() => {
                loading = true;
                return async ({ result, update }) => {
                    await update({ reset: !isEditing });
                    loading = false;
                    if (result.type === 'success') {
                        currentDiameter = null;
                        onComplete?.();
                    }
                };
            }}
            class="space-y-4"
        >
            {#if isEditing}
                <input type="hidden" name="idDiametro" value={currentDiameter.idDiametro} />
            {/if}

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5 flex-1">
                    <label for="medida" class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Medida (Texto)</label>
                    <input 
                        type="text" 
                        id="medida" 
                        name="medida" 
                        value={currentDiameter?.medida || ''} 
                        required
                        placeholder='Ej: 1/2", DN50...'
                        oninput={(e) => { const t = /** @type {HTMLInputElement} */ (e.target); t.value = t.value.toUpperCase(); }}
                        class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none transition-all placeholder:text-slate-400 text-sm uppercase bg-white"
                    />
                </div>

                <div class="space-y-1.5 flex-1">
                    <label for="medidaDecimal" class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Decimal</label>
                    <input 
                        type="number" 
                        step="0.01"
                        id="medidaDecimal" 
                        name="medidaDecimal" 
                        value={currentDiameter?.medidaDecimal || ''} 
                        placeholder="0.50"
                        class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none transition-all placeholder:text-slate-400 text-sm bg-white"
                    />
                </div>
            </div>

            <div class="flex gap-2">
                <button 
                    type="submit" 
                    disabled={loading}
                    class="flex-1 bg-[#f97316] hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 text-sm flex items-center justify-center gap-2"
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
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Diámetros Existentes</h4>
        <div class="max-h-[300px] overflow-y-auto pr-1 space-y-2 sidebar-scroll">
            {#each diametros as d (d.idDiametro)}
                <div class="group flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:border-orange-100 hover:shadow-sm transition-all">
                    <div class="flex flex-col">
                        <span class="text-sm font-medium text-slate-700">{d.medida}</span>
                        {#if d.medidaDecimal}
                            <span class="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Equivale a: {d.medidaDecimal}</span>
                        {/if}
                    </div>
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onclick={() => startEdit(d)}
                            class="p-1.5 text-slate-400 hover:text-[#f97316] hover:bg-orange-50 rounded-lg transition-all"
                            title="Editar"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <form 
                            method="POST" 
                            action="?/deleteDiameter" 
                            use:enhance={() => {
                                if (!confirm('¿Eliminar este diámetro?')) return;
                                return async ({ update }) => await update();
                            }}
                        >
                            <input type="hidden" name="id" value={d.idDiametro} />
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
                    <p class="text-sm">No hay diámetros registrados</p>
                </div>
            {/each}
        </div>
    </div>
</div>
