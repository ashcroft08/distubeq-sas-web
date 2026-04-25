<script>
	import { MapPin, Phone, Navigation, Crown, Building2 } from 'lucide-svelte';
	import 'leaflet/dist/leaflet.css';

	let { data } = $props();
	let sucursales = $derived(data.sucursales || []);
	let activeBranch = $state(null);
	let mapReady = $state(false);
	let mapInstance = null;
	let markerInstance = null;

	// Auto-select first (matriz first by ordering)
	$effect(() => {
		if (sucursales.length > 0 && !activeBranch) {
			activeBranch = sucursales[0];
		}
	});

	function selectBranch(branch) {
		activeBranch = branch;
		updateMap(branch);

		// Scroll to map on mobile
		if (typeof window !== 'undefined' && window.innerWidth < 1024) {
			document
				.getElementById('map-container')
				?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	async function initMap(node) {
		if (typeof window === 'undefined') return;
		const L = await import('leaflet');

		delete L.Icon.Default.prototype._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl:
				'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
			iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
		});

		const first = sucursales[0];
		const lat = first?.latitud ? parseFloat(first.latitud) : 10.9639;
		const lng = first?.longitud ? parseFloat(first.longitud) : -74.7964;

		mapInstance = L.map(node).setView([lat, lng], 15);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap'
		}).addTo(mapInstance);

		markerInstance = L.marker([lat, lng]).addTo(mapInstance);

		setTimeout(() => {
			mapInstance.invalidateSize();
			mapReady = true;
		}, 200);

		return {
			destroy() {
				if (mapInstance) {
					mapInstance.remove();
					mapInstance = null;
				}
			}
		};
	}

	async function updateMap(branch) {
		if (!mapInstance || !branch?.latitud || !branch?.longitud) return;
		const lat = parseFloat(branch.latitud);
		const lng = parseFloat(branch.longitud);
		mapInstance.flyTo([lat, lng], 15);
		markerInstance.setLatLng([lat, lng]);
	}
</script>

<svelte:head>
	<title>Sucursales | Distubeq</title>
	<meta
		name="description"
		content="Encuentra nuestras sucursales. Ubicaciones estratégicas con inventario de alto volumen y soporte especializado."
	/>
	<link rel="preconnect" href="https://tile.openstreetmap.org" crossorigin />
</svelte:head>

<section class="relative z-10 bg-background-light blueprint-grid">


	<div class="mx-auto w-full max-w-7xl px-4 py-12 lg:py-16">
		<!-- Header -->
		<div class="mb-12 max-w-3xl">
			<div class="mb-4 flex items-center gap-3">
				<div class="h-[2px] w-8 bg-[#E8660A]"></div>
				<span class="text-sm font-bold tracking-widest text-[#E8660A] uppercase"
					>Red de Distribución</span
				>
			</div>
			<h1 class="mb-6 text-4xl font-extrabold tracking-tight text-[#1b396a] lg:text-5xl">
				Nuestras Sucursales
			</h1>
			<p class="max-w-2xl text-lg leading-relaxed text-slate-600">
				Ubicaciones estratégicas diseñadas para responder a los grandes desafíos de ingeniería.
				Contamos con soporte especializado e inventario de alto volumen en cada sede.
			</p>
		</div>

		{#if sucursales.length === 0}
			<div class="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-20 text-center">
				<Building2 size={48} class="mx-auto mb-4 text-slate-300" />
				<h3 class="text-xl font-bold text-slate-900">No hay sucursales disponibles</h3>
				<p class="mt-2 text-slate-500">Próximamente agregaremos nuestras ubicaciones.</p>
			</div>
		{:else}
			<div class="flex flex-col items-start gap-8 lg:flex-row">
				<!-- Branch List -->
				<div
					class="hide-scrollbar flex max-h-[650px] w-full flex-col gap-4 overflow-y-auto pr-2 pb-8 lg:w-[40%]"
				>
					{#each sucursales as branch (branch.id_sucursal)}
						<button
							onclick={() => selectBranch(branch)}
							class="branch-item group relative w-full overflow-hidden rounded-2xl bg-white p-6 text-left transition-all duration-200"
							class:branch-active={activeBranch?.id_sucursal === branch.id_sucursal}
						>
							<div class="flex gap-5">
								<!-- Branch Image -->
								<div
									class="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100"
								>
									{#if branch.imagen_url}
										<img
											src={branch.imagen_url}
											alt={branch.nombre}
											class="h-full w-full object-cover transition-opacity"
											class:opacity-90={activeBranch?.id_sucursal !== branch.id_sucursal}
										/>
									{:else}
										<div class="flex h-full w-full items-center justify-center">
											<Building2 size={24} class="text-slate-400" />
										</div>
									{/if}
								</div>

								<!-- Branch Info -->
								<div class="flex min-w-0 flex-1 flex-col justify-center">
									<div class="mb-2 flex items-center gap-2">
										<h3
											class="truncate text-xl font-bold text-slate-900 transition-colors group-hover:text-[#1b396a]"
										>
											{branch.nombre}
										</h3>
									</div>
									<div class="mb-1 flex items-center gap-2 text-sm text-slate-500">
										<MapPin
											size={14}
											class={activeBranch?.id_sucursal === branch.id_sucursal
												? 'text-[#E8660A]'
												: 'text-slate-400'}
										/>
										<span class="truncate">{branch.direccion}</span>
									</div>
									{#if branch.telefono}
										<div class="flex items-center gap-2 text-sm text-slate-500">
											<Phone
												size={14}
												class={activeBranch?.id_sucursal === branch.id_sucursal
													? 'text-[#E8660A]'
													: 'text-slate-400'}
											/>
											<span>{branch.telefono}</span>
										</div>
									{/if}
								</div>
							</div>
						</button>
					{/each}
				</div>

				<!-- Map & Overlay -->
				<div
					id="map-container"
					class="relative h-[500px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] lg:sticky lg:top-28 lg:h-[650px] lg:w-[60%]"
				>
					<div use:initMap class="absolute inset-0 z-0 h-full w-full"></div>

					<!-- Map Loading Skeleton -->
					{#if !mapReady}
						<div class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-100">
							<div class="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-[#1b396a]"></div>
							<p class="mt-3 text-sm font-medium text-slate-500">Cargando mapa...</p>
						</div>
					{/if}

					<!-- Floating Info Card -->
					{#if activeBranch}
						<div
							class="absolute right-6 bottom-6 left-6 z-[500] rounded-xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur-md lg:right-6 lg:left-auto lg:w-[340px]"
						>
							<div class="mb-6 flex items-center gap-4">
								<div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
									{#if activeBranch.imagen_url}
										<img
											src={activeBranch.imagen_url}
											alt={activeBranch.nombre}
											class="h-full w-full object-cover"
										/>
									{:else}
										<div class="flex h-full w-full items-center justify-center">
											<Building2 size={20} class="text-slate-400" />
										</div>
									{/if}
								</div>
								<div>
									<h4 class="text-lg font-bold text-slate-900">{activeBranch.nombre}</h4>
									<div class="mt-1 flex items-center gap-2">
										<span class="relative flex h-2 w-2">
											<span
												class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"
											></span>
											<span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
										</span>
										<span class="text-xs font-medium tracking-wide text-slate-500 uppercase"
											>Abierto ahora</span
										>
									</div>
								</div>
							</div>

							<div class="flex flex-col gap-3">
								{#if activeBranch.latitud && activeBranch.longitud}
									<a
										href="https://www.google.com/maps/dir/?api=1&destination={activeBranch.latitud},{activeBranch.longitud}"
										target="_blank"
										rel="noopener noreferrer"
										class="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1b396a] py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#152c54]"
									>
										<Navigation size={16} />
										Cómo llegar
									</a>
								{/if}
								<a
									href="https://wa.me/5079133326238"
									target="_blank"
									rel="noopener noreferrer"
									class="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
								>
									<svg class="h-4 w-4 fill-[#25D366]" viewBox="0 0 24 24">
										<path
											d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.896 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
										></path>
									</svg>
									Contactar Asesor
								</a>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.branch-item {
		border: 1px solid #e2e8f0;
		transition: all 0.2s ease-in-out;
	}
	.branch-item:hover:not(.branch-active) {
		border-color: #cbd5e1;
		transform: translateY(-2px);
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
	}
	.branch-active {
		border-color: #e8660a !important;
		background-color: #fff !important;
		box-shadow: 0 10px 30px -5px rgba(232, 102, 10, 0.12) !important;
	}
</style>
