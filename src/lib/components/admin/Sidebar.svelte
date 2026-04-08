<script>
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import logoImg from '$lib/assets/images/Logo_Distubeq.webp';

	let { active = 'Productos' } = $props();
	let isCollapsed = $state(false);

	const menuItems = [
		{ name: 'Dashboard', icon: 'home', path: '/admin', id: 'dashboard' },
		{ name: 'Productos', icon: 'box', path: '/admin/productos', id: 'productos' },
		{ name: 'Categorías', icon: 'list', path: '/admin/categorias', id: 'categorias' },
		{ name: 'Sliders', icon: 'image', path: '/admin/sliders', id: 'sliders' },
		{ name: 'Nosotros', icon: 'user', path: '/admin/nosotros', id: 'nosotros' },
		{ name: 'Sucursales', icon: 'map-pin', path: '/admin/sucursales', id: 'sucursales' },
		{ name: 'Contacto', icon: 'mail', path: '/admin/contacto', id: 'contacto' },
		{ name: 'Seguridad', icon: 'settings', path: '/admin/configuracion', id: 'configuracion' }
	];

	function toggleSidebar() {
		isCollapsed = !isCollapsed;
	}
</script>

<aside
	class="relative flex h-full shrink-0 flex-col bg-[#1e293b] text-white shadow-xl transition-all duration-300 ease-in-out {isCollapsed
		? 'w-20'
		: 'w-64'}"
>
	<!-- Toggle Button -->
	<button
		onclick={toggleSidebar}
		class="absolute top-20 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#1e293b] bg-[#475569] shadow-lg transition-transform hover:scale-110 active:scale-95"
		title={isCollapsed ? 'Expandir' : 'Colapsar'}
	>
		<svg
			class="h-4 w-4 transition-transform duration-300 {isCollapsed ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
		</svg>
	</button>

	<div
		class="flex shrink-0 items-center justify-center overflow-hidden border-b border-slate-700 p-4"
	>
		<img
			src={logoImg}
			alt="Logo"
			class="{isCollapsed
				? 'h-8 w-auto'
				: 'h-14 w-auto max-w-[180px]'} rounded-xl object-contain brightness-0 invert transition-all duration-300"
		/>
	</div>

	<nav class="sidebar-scroll flex-1 space-y-2 overflow-x-hidden overflow-y-auto p-3">
		{#each menuItems as item (item.id)}
			<a
				href={item.path}
				class="group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 {active ===
				item.name
					? 'bg-[#475569] font-medium text-white shadow-lg'
					: 'text-slate-400 hover:bg-slate-800'}"
				title={isCollapsed ? item.name : ''}
			>
				<div class="shrink-0 transition-transform group-hover:scale-110">
					{#if item.icon === 'home'}
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
							></path></svg
						>
					{:else if item.icon === 'box'}
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
							/></svg
						>
					{:else if item.icon === 'list'}
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 10h16M4 14h16M4 18h16"
							/></svg
						>
					{:else if item.icon === 'image'}
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/></svg
						>
					{:else if item.icon === 'user'}
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
							/></svg
						>
					{:else if item.icon === 'mail'}
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
							/></svg
						>
					{:else if item.icon === 'map-pin'}
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
							/><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
							/></svg
						>
					{:else}
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							/><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/></svg
						>
					{/if}
				</div>
				{#if !isCollapsed}
					<span in:fade={{ duration: 200, delay: 100 }} class="whitespace-nowrap">{item.name}</span>
				{/if}
			</a>
		{/each}
	</nav>

	<div class="border-t border-slate-700 bg-slate-900/50 p-3">
		<div class="mb-4 flex items-center gap-3 px-3 py-2">
			<div
				class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#475569] text-lg font-bold text-white ring-2 ring-slate-700"
			>
				A
			</div>
			{#if !isCollapsed}
				<div in:fade={{ duration: 200 }} class="overflow-hidden">
					<p class="truncate text-sm font-bold text-white">Administrador</p>
					<p class="truncate text-[10px] font-medium tracking-tight text-slate-400 uppercase">
						Acceso Total
					</p>
				</div>
			{/if}
		</div>

		<form method="POST" action="/logout" use:enhance>
			<button
				class="group flex w-full items-center justify-center gap-3 rounded-xl border border-transparent bg-slate-800/50 px-4 py-3 text-slate-400 shadow-sm transition-all duration-300 hover:border-red-500/20 hover:bg-red-500/10 hover:text-white"
				title={isCollapsed ? 'Cerrar Sesión' : ''}
			>
				<div class="shrink-0 transition-transform group-hover:rotate-12">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
				</div>
				{#if !isCollapsed}
					<span in:fade={{ duration: 200, delay: 100 }} class="text-sm font-bold"
						>Cerrar Sesión</span
					>
				{/if}
			</button>
		</form>
	</div>
</aside>

<style>
	.sidebar-scroll::-webkit-scrollbar {
		width: 4px;
	}
	.sidebar-scroll::-webkit-scrollbar-track {
		background: #1e293b;
	}
	.sidebar-scroll::-webkit-scrollbar-thumb {
		background: #475569;
		border-radius: 10px;
	}
</style>
