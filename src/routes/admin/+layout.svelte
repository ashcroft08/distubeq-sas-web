<script>
	import Sidebar from '$lib/components/admin/Sidebar.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import { page } from '$app/state';

	let { children, data } = $props();

	let path = $derived(page.url.pathname);
	
	let title = $derived(
		path.includes('/productos') ? 'Gestión de Productos' :
		path.includes('/categorias') ? 'Categorías de Productos' :
		path.includes('/sucursales') ? 'Sucursales' :
		path.includes('/nosotros') ? 'Nosotros' :
		path.includes('/sliders') ? 'Sliders' :
		path.includes('/contacto') ? 'Contacto' :
		path.includes('/seguridad') ? 'Seguridad' :
		'Dashboard Principal'
	);

	let active = $derived(
		path.includes('/productos') ? 'Productos' :
		path.includes('/categorias') ? 'Categorías' :
		path.includes('/sucursales') ? 'Sucursales' :
		path.includes('/nosotros') ? 'Nosotros' :
		path.includes('/sliders') ? 'Sliders' :
		path.includes('/contacto') ? 'Contacto' :
		path.includes('/seguridad') ? 'Seguridad' :
		'Dashboard'
	);
</script>

<div class="bg-[#f8fafc] font-sans text-slate-800 flex h-screen overflow-hidden">
	<Sidebar {active} origin={data.origin} />

	<main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
		<AdminHeader {title} />

		<div class="flex-1 overflow-y-auto p-8 bg-slate-50">
			{@render children()}
		</div>

	</main>
</div>
