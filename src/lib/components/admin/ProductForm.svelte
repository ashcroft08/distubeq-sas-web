<script>
    import { enhance } from '$app/forms';

    let { 
        product = null, 
        materiales = [], 
        diametros = [], 
        onComplete 
    } = $props();

    let loading = $state(false);
    let isEditing = $derived(!!product);

    // Image state
    let imagePreview = $state(product?.imagenUrl || '');
    let imageData = $state(''); // Base64 string

    // Quick-add diameter state
    let newDiameterMedida = $state('');
    let newDiameterDecimal = $state('');
    let addingDiameter = $state(false);
    let addDiameterError = $state('');

    // Track manually added diameters (auto-checked)
    let autoCheckedIds = $state(new Set());

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview = event.target.result;
                imageData = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    async function quickAddDiameter() {
        const medida = newDiameterMedida.trim().toUpperCase();
        if (!medida) return;

        // Check if already exists
        const exists = diametros.some(d => d.medida.toUpperCase() === medida);
        if (exists) {
            addDiameterError = `"${medida}" ya existe. Selecciónalo de la lista.`;
            // Auto-check the existing one
            const existing = diametros.find(d => d.medida.toUpperCase() === medida);
            if (existing) {
                autoCheckedIds = new Set([...autoCheckedIds, existing.idDiametro]);
            }
            newDiameterMedida = '';
            newDiameterDecimal = '';
            setTimeout(() => addDiameterError = '', 3000);
            return;
        }

        addingDiameter = true;
        addDiameterError = '';

        try {
            const formData = new FormData();
            formData.set('medida', medida);
            if (newDiameterDecimal) {
                formData.set('medidaDecimal', newDiameterDecimal);
            }

            const response = await fetch('?/quickCreateDiameter', {
                method: 'POST',
                body: formData
            });

            const responseText = await response.text();

            // SvelteKit returns devalue-serialized data, use deserialize
            const { deserialize } = await import('$app/forms');
            const result = deserialize(responseText);

            if (result.type === 'success' && result.data) {
                const newDiam = result.data.diameter;
                if (newDiam?.idDiametro) {
                    // Add to local list and auto-check it
                    diametros = [...diametros, newDiam];
                    autoCheckedIds = new Set([...autoCheckedIds, newDiam.idDiametro]);
                }
                newDiameterMedida = '';
                newDiameterDecimal = '';
            } else if (result.type === 'failure') {
                addDiameterError = result.data?.message || 'Error al crear la medida.';
                setTimeout(() => addDiameterError = '', 4000);
            } else {
                addDiameterError = 'Respuesta inesperada del servidor.';
                setTimeout(() => addDiameterError = '', 4000);
            }
        } catch (err) {
            console.error(err);
            addDiameterError = 'Error de conexión. Intente nuevamente.';
            setTimeout(() => addDiameterError = '', 4000);
        } finally {
            addingDiameter = false;
        }
    }

    function isChecked(d) {
        if (autoCheckedIds.has(d.idDiametro)) return true;
        if (product?.diametros?.some(pd => pd.idDiametro === d.idDiametro)) return true;
        return false;
    }
</script>

<form 
    method="POST" 
    action={isEditing ? '?/updateProduct' : '?/createProduct'} 
    use:enhance={() => {
        loading = true;
        return async ({ result, update }) => {
            await update();
            loading = false;
            if (result.type === 'success' || result.type === 'redirect') {
                onComplete?.();
            }
        };
    }}
    class="space-y-5"
>
    {#if isEditing}
        <input type="hidden" name="idProducto" value={product.idProducto} />
    {/if}

    <input type="hidden" name="imageData" value={imageData} />

    <!-- Image Upload Section -->
    <div class="space-y-2">
        <label class="text-sm font-semibold text-slate-700 ml-1">Imagen del Producto</label>
        <div class="flex items-center gap-5">
            <div class="relative group">
                <div class="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#475569]/30">
                    {#if imagePreview}
                        <img src={imagePreview} alt="Preview" class="w-full h-full object-cover" />
                    {:else}
                        <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    {/if}
                </div>
            </div>
            <div class="flex-1 space-y-2">
                <p class="text-[11px] text-slate-400 font-medium leading-tight">Sube una imagen clara para mejorar la visualización en el catálogo.</p>
                <input 
                    type="file" 
                    accept="image/*" 
                    onchange={handleFileChange}
                    class="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#475569]/10 file:text-[#475569] hover:file:bg-[#475569]/20 transition-all cursor-pointer"
                />
            </div>
        </div>
    </div>

    <div class="space-y-1.5">
        <label for="nombreCompleto" class="text-sm font-semibold text-slate-700 ml-1">Nombre Completo</label>
        <input 
            type="text" 
            id="nombreCompleto" 
            name="nombreCompleto" 
            value={product?.nombreCompleto || ''} 
            required
            placeholder='Ej: Tubo Galvanizado 1/2" x 6m...'
            oninput={(e) => { const t = /** @type {HTMLInputElement} */ (e.target); t.value = t.value.toUpperCase(); }}
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#475569]/20 focus:border-[#475569] outline-none transition-all placeholder:text-slate-400 text-sm uppercase"
        />
    </div>

    <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
            <label for="idMaterial" class="text-sm font-semibold text-slate-700 ml-1">Material</label>
            <select 
                id="idMaterial" 
                name="idMaterial" 
                required
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#475569]/20 focus:border-[#475569] outline-none transition-all bg-white text-sm"
            >
                <option value="">Seleccionar...</option>
                {#each materiales as m (m.idMaterial)}
                    <option value={m.idMaterial} selected={product?.idMaterial === m.idMaterial}>{m.nombre}</option>
                {:else}
                    <option disabled>No hay materiales registrados</option>
                {/each}
            </select>
        </div>

        <div class="space-y-1.5 col-span-2">
            <div class="flex items-center justify-between">
                <label class="text-sm font-semibold text-slate-700 ml-1">Diámetros / Medidas Disponibles</label>
            </div>

            <!-- Quick-add inline form -->
            <div class="flex gap-2 items-end">
                <div class="flex-1">
                    <input 
                        type="text" 
                        placeholder='Ej: 1/2", 3/4", DN50...'
                        bind:value={newDiameterMedida}
                        oninput={(e) => { const t = /** @type {HTMLInputElement} */ (e.target); t.value = t.value.toUpperCase(); }}
                        onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); quickAddDiameter(); }}}
                        class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#475569]/20 focus:border-[#475569] outline-none transition-all placeholder:text-slate-400 text-xs uppercase bg-white"
                    />
                </div>
                <div class="w-20">
                    <input 
                        type="number"
                        step="0.01" 
                        placeholder="Decimal"
                        bind:value={newDiameterDecimal}
                        onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); quickAddDiameter(); }}}
                        class="w-full px-2 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#475569]/20 focus:border-[#475569] outline-none transition-all placeholder:text-slate-400 text-xs bg-white"
                    />
                </div>
                <button 
                    type="button"
                    onclick={quickAddDiameter}
                    disabled={addingDiameter || !newDiameterMedida.trim()}
                    class="px-3 py-2 text-xs font-bold text-white bg-[#475569] rounded-lg hover:bg-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-1"
                >
                    {#if addingDiameter}
                        <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {:else}
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" /></svg>
                    {/if}
                    Agregar
                </button>
            </div>

            {#if addDiameterError}
                <p class="text-[10px] text-amber-600 font-medium ml-1">{addDiameterError}</p>
            {/if}

            <!-- Checkbox list -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-48 overflow-y-auto sidebar-scroll">
                {#each diametros as d (d.idDiametro)}
                    <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-white transition-all cursor-pointer border border-transparent hover:border-slate-100">
                        <input 
                            type="checkbox" 
                            name="idDiametros" 
                            value={d.idDiametro}
                            checked={isChecked(d)}
                            class="w-4 h-4 rounded border-slate-300 text-[#475569] focus:ring-[#475569]"
                        />
                        <span class="text-xs font-medium text-slate-600 uppercase">{d.medida}</span>
                    </label>
                {:else}
                    <div class="col-span-full py-4 text-center">
                        <p class="text-xs text-slate-400">No hay diámetros registrados. Agrega uno arriba.</p>
                    </div>
                {/each}
            </div>
            <p class="text-[10px] text-slate-400 ml-1 font-medium italic">* Escribe y agrega medidas nuevas directamente, o selecciona las existentes</p>
        </div>
    </div>

    <div class="space-y-1.5">
        <label for="fabricante" class="text-sm font-semibold text-slate-700 ml-1">Fabricante (Opcional)</label>
        <input 
            type="text" 
            id="fabricante" 
            name="fabricante" 
            value={product?.fabricante || ''} 
            placeholder="Ej: Gerfor, Pavco, Colmena..."
            oninput={(e) => { const t = /** @type {HTMLInputElement} */ (e.target); t.value = t.value.toUpperCase(); }}
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#475569]/20 focus:border-[#475569] outline-none transition-all placeholder:text-slate-400 text-sm uppercase"
        />
    </div>

    <div class="flex items-center gap-3 px-1 py-1">
        <input 
            type="checkbox" 
            id="estado" 
            name="estado" 
            checked={product ? product.estado : true}
            class="w-5 h-5 rounded border-slate-300 text-[#475569] focus:ring-[#475569]"
        />
        <label for="estado" class="text-sm font-medium text-slate-700">Producto Activo / Disponible</label>
    </div>

    <button 
        type="submit" 
        disabled={loading}
        class="w-full bg-[#475569] hover:bg-slate-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-slate-300 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
    >
        {#if loading}
            <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        {/if}
        <span>{isEditing ? 'Actualizar Producto' : 'Guardar Producto'}</span>
    </button>
</form>
