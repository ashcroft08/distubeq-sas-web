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

		<!-- Floating CTA if in products -->
		{#if page.url.pathname.includes('/products')}
			<button
				class="fixed bottom-10 right-10 flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 z-50 group"
			>
				<svg
					class="h-6 w-6 group-hover:rotate-90 transition-transform"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						d="M12 4v16m8-8H4"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="3"
					></path></svg
				>
				<span>Agregar Producto</span>
			</button>
		{/if}
	</main>
</div>
