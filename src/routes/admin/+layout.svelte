<script>
	import Sidebar from '$lib/components/admin/Sidebar.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	// Derive title and active state from path
	let title = $derived(
		page.url.pathname.includes('/products') ? 'Gestión de Productos' : 'Panel de Administración'
	);
	let active = $derived(page.url.pathname.includes('/products') ? 'Productos' : 'Dashboard');
</script>

<div class="bg-[#f8fafc] font-sans text-slate-800 flex h-screen overflow-hidden">
	<Sidebar {active} />

	<main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
		<AdminHeader {title} />

		<div class="flex-1 overflow-y-auto p-8 bg-slate-50">
			{@render children()}
		</div>

	</main>
</div>
