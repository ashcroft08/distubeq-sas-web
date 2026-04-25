<script>
    import { enhance } from '$app/forms';
    import { fade, slide } from 'svelte/transition';
    import { MapPin, Phone, Plus, Pencil, Trash2, Image, Building2, Crown, Eye, EyeOff, X, Loader2 } from 'lucide-svelte';
    import 'leaflet/dist/leaflet.css';
    import 'leaflet-geosearch/dist/geosearch.css';

    let { data, form } = $props();

    let sucursales = $derived(data.sucursales || []);
    
    $effect(() => {
        if (form?.success) {
            showModal = false;
            window.location.reload();
        }
    });

    let showModal = $state(false);
    let isEditing = $state(false);
    let saving = $state(false);

    // Form fields
    let id_sucursal = $state(null);
    let nombre = $state('');
    let direccion = $state('');
    let telefono = $state('');
    let latitud = $state('');
    let longitud = $state('');
    let es_matriz = $state(false);
    let estado = $state(true);
    let imagePreview = $state(null);
    let imageFile = $state(null);

    let mapInstance = null;
    let markerInstance = null;

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            imageFile = file;
            const reader = new FileReader();
            reader.onload = e => imagePreview = e.target.result;
            reader.readAsDataURL(file);
        }
    }

    async function initMap(node) {
        if (typeof window === 'undefined') return;
        
        const L = await import('leaflet');
        const { GeoSearchControl, OpenStreetMapProvider } = await import('leaflet-geosearch');
        
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        const defaultLat = latitud ? parseFloat(latitud) : 10.9639; 
        const defaultLng = longitud ? parseFloat(longitud) : -74.7964;

        mapInstance = L.map(node).setView([defaultLat, defaultLng], latitud ? 15 : 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(mapInstance);

        markerInstance = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(mapInstance);

        markerInstance.on('dragend', function (e) {
            const pos = e.target.getLatLng();
            latitud = pos.lat.toFixed(8);
            longitud = pos.lng.toFixed(8);
        });

        mapInstance.on('click', function(e) {
            const pos = e.latlng;
            markerInstance.setLatLng(pos);
            latitud = pos.lat.toFixed(8);
            longitud = pos.lng.toFixed(8);
        });

        const provider = new OpenStreetMapProvider();
        const searchControl = new GeoSearchControl({
            provider: provider,
            style: 'bar',
            showMarker: false,
            retainZoomLevel: false,
            autoClose: true,
            searchLabel: 'Buscar dirección (ej. Calle 72 Barranquilla)',
        });

        mapInstance.addControl(searchControl);

        mapInstance.on('geosearch/showlocation', (e) => {
            const lat = e.location.y;
            const lng = e.location.x;
            markerInstance.setLatLng([lat, lng]);
            latitud = lat.toFixed(8);
            longitud = lng.toFixed(8);
            if (!direccion) {
                 direccion = e.location.label;
            }
        });

        setTimeout(() => mapInstance.invalidateSize(), 200);

        return {
            destroy() {
                if (mapInstance) {
                    mapInstance.remove();
                    mapInstance = null;
                }
            }
        };
    }

    function openModal(item = null) {
        isEditing = !!item;
        
        if (item) {
            id_sucursal = item.id_sucursal;
            nombre = item.nombre;
            direccion = item.direccion;
            telefono = item.telefono || '';
            latitud = item.latitud ? item.latitud.toString() : '';
            longitud = item.longitud ? item.longitud.toString() : '';
            es_matriz = item.es_matriz;
            estado = item.estado;
            imagePreview = item.imagen_url;
        } else {
            id_sucursal = null;
            nombre = '';
            direccion = '';
            telefono = '';
            latitud = '';
            longitud = '';
            es_matriz = false;
            estado = true;
            imagePreview = null;
        }
        imageFile = null;
        showModal = true;
    }
</script>

<div class="space-y-8 pb-12">
    <!-- Action Toolbar -->
    <div class="flex flex-col sm:flex-row items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm gap-4">
        <div class="flex items-center gap-4 w-full sm:w-auto">
            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Building2 size={24} />
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-slate-500">Total Sucursales</p>
                <p class="text-2xl font-bold text-slate-900 leading-none">{sucursales.length}</p>
            </div>
        </div>
        <div class="flex gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <button 
                onclick={() => openModal()}
                class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95 whitespace-nowrap group"
            >
                <Plus size={20} strokeWidth={2.5} class="transition-transform group-hover:rotate-90" />
                Nueva Sucursal
            </button>
        </div>
    </div>

    <!-- Error Messages -->
    {#if form?.message}
        <div class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3" transition:fade>
            <span class="font-medium text-sm">{form.message}</span>
        </div>
    {/if}

    <!-- Table -->
    {#if sucursales.length === 0}
        <div class="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center" in:fade>
            <Building2 size={48} class="mx-auto text-slate-300 mb-4" />
            <h3 class="text-xl font-bold text-slate-900">No hay sucursales</h3>
            <p class="text-slate-500 mt-2">Agrega el primer punto de venta para mostrarlo en los mapas.</p>
        </div>
    {:else}
        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th class="px-6 py-4">Foto</th>
                            <th class="px-6 py-4">Sede</th>
                            <th class="px-6 py-4">Dirección</th>
                            <th class="px-6 py-4">Coordenadas</th>
                            <th class="px-6 py-4">Tipo</th>
                            <th class="px-6 py-4">Estado</th>
                            <th class="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        {#each sucursales as sucursal}
                            <tr class="hover:bg-slate-50/80 transition-colors group">
                                <td class="px-6 py-4 w-24">
                                    <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                                        {#if sucursal.imagen_url}
                                            <img src={sucursal.imagen_url} alt={sucursal.nombre} class="w-full h-full object-cover">
                                        {:else}
                                            <Image size={18} class="text-slate-400" />
                                        {/if}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <h3 class="font-bold text-slate-900 text-base" title={sucursal.nombre}>{sucursal.nombre}</h3>
                                    {#if sucursal.telefono}
                                        <div class="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                                            <Phone size={12} class="text-slate-400" />
                                            {sucursal.telefono}
                                        </div>
                                    {/if}
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-sm text-slate-700 flex items-center gap-1.5">
                                        <MapPin size={14} class="text-slate-400 shrink-0" />
                                        {sucursal.direccion}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-xs font-mono text-slate-500">
                                    {#if sucursal.latitud && sucursal.longitud}
                                        <div class="flex flex-col gap-0.5">
                                            <span>Lat: <span class="font-medium text-slate-700">{parseFloat(sucursal.latitud).toFixed(4)}</span></span>
                                            <span>Lng: <span class="font-medium text-slate-700">{parseFloat(sucursal.longitud).toFixed(4)}</span></span>
                                        </div>
                                    {:else}
                                        <span class="text-orange-500 italic bg-orange-50 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase">Sin Mapa</span>
                                    {/if}
                                </td>
                                <td class="px-6 py-4">
                                    {#if sucursal.es_matriz}
                                        <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold uppercase tracking-wide border border-amber-200">
                                            <Crown size={12} /> Matriz
                                        </span>
                                    {:else}
                                        <span class="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold uppercase tracking-wide border border-slate-200">Sucursal</span>
                                    {/if}
                                </td>
                                <td class="px-6 py-4">
                                    {#if sucursal.estado}
                                        <span class="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wide">
                                            <Eye size={12} /> Activo
                                        </span>
                                    {:else}
                                        <span class="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold uppercase tracking-wide">
                                            <EyeOff size={12} /> Oculto
                                        </span>
                                    {/if}
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button type="button" onclick={() => openModal(sucursal)} class="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors" title="Editar">
                                            <Pencil size={18} />
                                        </button>
                                        <form action="?/delete" method="POST" use:enhance onsubmit={(e) => { if (!confirm('¿Seguro que deseas eliminar esta sucursal?')) e.preventDefault(); }}>
                                            <input type="hidden" name="id" value={sucursal.id_sucursal}>
                                            <button type="submit" class="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors" title="Eliminar">
                                                <Trash2 size={18} />
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

<!-- Modal -->
{#if showModal}
    <div class="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" style="z-index: 100;" in:fade={{ duration: 200 }}>
        <button class="absolute inset-0 cursor-default border-none" aria-label="Cerrar modal" onclick={() => showModal = false}></button>
        
        <div class="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden" transition:slide={{ duration: 300, axis: 'y' }}>
            <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 class="text-2xl font-bold text-slate-900">{isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}</h3>
                <button type="button" onclick={() => showModal = false} class="p-2 hover:bg-slate-100 rounded-full text-slate-500 font-bold w-10 h-10 flex items-center justify-center transition-colors">
                    <X size={20} />
                </button>
            </div>

            <form action="?/upsert" method="POST" enctype="multipart/form-data" use:enhance={() => { saving = true; return async ({ update }) => { saving = false; update(); } }} class="flex-1 overflow-y-auto">
                <input type="hidden" name="id_sucursal" value={id_sucursal || ''}>
                
                <div class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <!-- Left Column: Data -->
                    <div class="space-y-6">
                        <!-- Image Upload -->
                        <div>
                            <label for="imageUpload" class="block text-sm font-bold text-slate-700 mb-2">Foto / Fachada (Opcional)</label>
                            <label for="imageUpload" class="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer bg-slate-50 overflow-hidden">
                                {#if imagePreview}
                                    <img src={imagePreview} alt="Preview" class="w-full h-full object-cover">
                                    <div class="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span class="text-white font-medium text-sm">Cambiar Foto</span>
                                    </div>
                                {:else}
                                    <div class="text-center">
                                        <Image size={40} class="mx-auto text-slate-400 group-hover:text-blue-500 transition-colors" />
                                        <span class="mt-2 block text-sm font-medium text-slate-500 group-hover:text-blue-600">Subir imagen</span>
                                    </div>
                                {/if}
                                <input type="file" id="imageUpload" name="image" accept="image/*" class="hidden" onchange={handleImageChange}>
                            </label>
                        </div>

                        <!-- Name -->
                        <div>
                            <label for="nombre" class="block text-sm font-bold text-slate-700 mb-2">Nombre de la Sede</label>
                            <input type="text" id="nombre" name="nombre" bind:value={nombre} required class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium" placeholder="Ej. Sede Norte">
                        </div>
                        
                        <!-- Phone -->
                        <div>
                            <label for="telefono" class="block text-sm font-bold text-slate-700 mb-2">Teléfono de Sede</label>
                            <input type="text" id="telefono" name="telefono" bind:value={telefono} class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium" placeholder="Ej. (605) 350-0000">
                        </div>

                        <!-- Address -->
                        <div>
                            <label for="direccion" class="block text-sm font-bold text-slate-700 mb-2">Dirección Escrita</label>
                            <input type="text" id="direccion" name="direccion" bind:value={direccion} required class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium" placeholder="Ej. Calle 72 #40-20">
                            <p class="text-xs text-slate-500 mt-1">Si buscas en el mapa a la derecha, esta dirección se autocompletará.</p>
                        </div>

                        <!-- Toggles -->
                        <div class="space-y-3">
                            <!-- Es Matriz Toggle -->
                            <button type="button" onclick={() => es_matriz = !es_matriz}
                                class="w-full flex items-center gap-3 p-4 border rounded-xl transition-all cursor-pointer select-none {es_matriz ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'}"
                            >
                                <div class="relative w-11 h-6 rounded-full transition-colors {es_matriz ? 'bg-amber-500' : 'bg-slate-300'}">
                                    <div class="absolute top-[2px] h-5 w-5 bg-white border border-slate-300 rounded-full transition-all {es_matriz ? 'left-[22px] border-white' : 'left-[2px]'}"></div>
                                </div>
                                <span class="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Crown size={16} class={es_matriz ? 'text-amber-500' : 'text-slate-400'} />
                                    {es_matriz ? 'Sede Principal (Matriz)' : 'Sucursal Regular'}
                                </span>
                            </button>
                            <input type="hidden" name="es_matriz" value={es_matriz ? 'true' : 'false'}>

                            <!-- Estado Toggle -->
                            <button type="button" onclick={() => estado = !estado}
                                class="w-full flex items-center gap-3 p-4 border rounded-xl transition-all cursor-pointer select-none {estado ? 'bg-slate-50 border-slate-200' : 'bg-red-50/50 border-red-200'}"
                            >
                                <div class="relative w-11 h-6 rounded-full transition-colors {estado ? 'bg-blue-600' : 'bg-slate-300'}">
                                    <div class="absolute top-[2px] h-5 w-5 bg-white border border-slate-300 rounded-full transition-all {estado ? 'left-[22px] border-white' : 'left-[2px]'}"></div>
                                </div>
                                <span class="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    {#if estado}
                                        <Eye size={16} class="text-blue-600" /> Visible al Público
                                    {:else}
                                        <EyeOff size={16} class="text-slate-400" /> Oculta al Público
                                    {/if}
                                </span>
                            </button>
                            <input type="hidden" name="estado" value={estado ? 'true' : 'false'}>
                        </div>
                    </div>

                    <!-- Right Column: Interactive Map -->
                    <div class="flex flex-col h-full space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="block text-sm font-bold text-slate-700">Ubicación Precisa (Mapa)</span>
                            <div class="flex gap-2 text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                                <span>L: {latitud || '---'}</span>
                                <span class="text-slate-300">|</span>
                                <span>G: {longitud || '---'}</span>
                            </div>
                        </div>
                        
                        <div class="flex-1 w-full relative bg-slate-100 rounded-2xl border-2 border-slate-200 overflow-hidden shadow-inner min-h-[350px]">
                            <div use:initMap class="absolute inset-0 w-full h-full z-0"></div>
                        </div>
                        
                        <p class="text-xs text-blue-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100 flex items-center gap-1.5">
                            <MapPin size={12} class="shrink-0" />
                            <span><strong>Tip:</strong> Usa la barra de búsqueda del mapa o arrastra el marcador rojo a la ubicación exacta.</span>
                        </p>

                        <input type="hidden" name="latitud" bind:value={latitud}>
                        <input type="hidden" name="longitud" bind:value={longitud}>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0 rounded-b-3xl mt-auto">
                    <button type="button" onclick={() => showModal = false} class="px-6 py-3 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" disabled={saving} class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2">
                        {#if saving}
                            <Loader2 size={16} class="animate-spin" />
                            Guardando...
                        {:else}
                            {isEditing ? 'Actualizar Sucursal' : 'Guardar Sucursal'}
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
