<script>
	import { page } from '$app/state';
	import logoImg from '$lib/assets/images/Logo_Distubeq.webp';
	import { Search, ShoppingCart, Menu, X } from 'lucide-svelte';

	let mobileOpen = $state(false);

	const navLinks = [
		{ name: 'Inicio', href: '/' },
		{ name: 'Catálogo', href: '/catalogo' },
		{ name: 'Sucursales', href: '/sucursales' },
		{ name: 'Nosotros', href: '/nosotros' },
		{ name: 'Contacto', href: '/contacto' }
	];

	let currentPath = $derived(page.url.pathname);

	function isActive(href) {
		if (href === '/') return currentPath === '/';
		return currentPath.startsWith(href);
	}

	function closeMobile() {
		mobileOpen = false;
	}
</script>

<header
	class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md"
>
	<div class="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4">
		<!-- Logo -->
		<a href="/" class="flex shrink-0 items-center transition-opacity hover:opacity-90">
			<img src={logoImg} alt="Distubeq" class="h-12 w-auto object-contain" />
		</a>

		<!-- Search (Desktop) -->
		<div class="hidden max-w-xl flex-1 lg:flex">
			<div
				class="flex w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 transition-all focus-within:border-primary"
			>
				<Search size={18} class="ml-4 shrink-0 text-slate-400" />
				<input
					class="h-11 flex-1 border-none bg-transparent px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-0"
					placeholder="Buscar tuberías, válvulas, conexiones..."
					type="text"
				/>
				<button
					class="h-full bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
				>
					Buscar
				</button>
			</div>
		</div>

		<!-- Navigation -->
		<nav class="flex items-center gap-8">
			<!-- Desktop Links -->
			<div class="hidden items-center gap-6 text-sm font-medium text-slate-600 xl:flex">
				{#each navLinks as link}
					<a
						class="transition-colors hover:text-primary {isActive(link.href) ? 'font-semibold text-accent-orange' : ''}"
						href={link.href}
					>
						{link.name}
					</a>
				{/each}
			</div>

			<!-- Cart Button -->
			<div class="flex items-center gap-3">
				<button
					class="group relative flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-all hover:bg-slate-50"
				>
					<ShoppingCart size={20} class="text-slate-500 transition-colors group-hover:text-primary" />
					<span class="text-sm font-semibold">Cotizar</span>
				</button>

				<!-- Mobile hamburger -->
				<button
					class="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 xl:hidden"
					onclick={() => (mobileOpen = !mobileOpen)}
					aria-label="Menú"
				>
					{#if mobileOpen}
						<X size={24} />
					{:else}
						<Menu size={24} />
					{/if}
				</button>
			</div>
		</nav>
	</div>

	<!-- Mobile Menu -->
	{#if mobileOpen}
		<div class="border-t border-slate-100 bg-white px-4 pb-4 xl:hidden">
			<div class="flex flex-col gap-1 pt-2">
				{#each navLinks as link}
					<a
						class="rounded-lg px-4 py-3 text-sm font-medium transition-colors {isActive(link.href)
							? 'bg-primary/5 font-semibold text-accent-orange'
							: 'text-slate-600 hover:bg-slate-50'}"
						href={link.href}
						onclick={closeMobile}
					>
						{link.name}
					</a>
				{/each}
			</div>
			<!-- Mobile Search -->
			<div class="mt-3 flex items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 lg:hidden">
				<Search size={18} class="ml-3 shrink-0 text-slate-400" />
				<input
					class="h-10 flex-1 border-none bg-transparent px-3 text-sm text-slate-700 outline-none"
					placeholder="Buscar productos..."
					type="text"
				/>
			</div>
		</div>
	{/if}
</header>
