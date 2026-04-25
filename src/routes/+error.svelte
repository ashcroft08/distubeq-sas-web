<script>
	import { page } from '$app/stores';
	import { Home, ArrowLeft, AlertOctagon } from 'lucide-svelte';
</script>

<svelte:head>
	<title>{$page.status} | Distubeq</title>
</svelte:head>

<section class="blueprint-grid relative z-10 flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-background-light px-4 py-16 text-center">
	
	<!-- Background large numbers -->
	<div class="absolute inset-0 -z-10 flex items-center justify-center opacity-[0.03]">
		<span class="font-montserrat text-[12rem] font-black tracking-tighter text-[#1b396a] md:text-[20rem]">
			{$page.status}
		</span>
	</div>

	<div class="relative mx-auto mb-8">
		<div class="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-red-50 text-red-500 shadow-xl border border-red-100">
			<AlertOctagon size={48} strokeWidth={1.5} />
		</div>
		<!-- Decorative dots -->
		<div class="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-[#E8660A]/20 blur-md"></div>
		<div class="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-[#1b396a]/10 blur-xl"></div>
	</div>

	<div class="relative z-10 mb-4 flex items-center gap-3">
		<div class="h-[2px] w-8 bg-[#E8660A]"></div>
		<span class="text-sm font-bold tracking-widest text-[#E8660A] uppercase">
			Error {$page.status}
		</span>
		<div class="h-[2px] w-8 bg-[#E8660A]"></div>
	</div>

	<h1 class="font-montserrat mb-6 max-w-3xl text-4xl font-extrabold tracking-tight text-[#1b396a] lg:text-5xl">
		{#if $page.status === 404}
			Página no encontrada
		{:else}
			Ha ocurrido un problema
		{/if}
	</h1>

	<p class="mb-10 max-w-xl text-lg leading-relaxed text-slate-600">
		{#if $page.status === 404}
			Lo sentimos, la ruta que estás intentando buscar no existe, ha sido movida o se encuentra temporalmente fuera de servicio en nuestra plataforma.
		{:else}
			{$page.error?.message || 'Hemos encontrado un error inesperado al procesar tu solicitud. Nuestro equipo técnico ya ha sido notificado.'}
		{/if}
	</p>

	<div class="relative z-20 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
		<button
			onclick={() => {
				if (window.history.length > 1) {
					window.history.back();
				} else {
					window.location.href = '/';
				}
			}}
			class="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-700 transition-all hover:border-[#1b396a] hover:text-[#1b396a] sm:w-auto"
		>
			<ArrowLeft size={18} class="transition-transform group-hover:-translate-x-1" />
			Regresar
		</button>
		
		<a
			href="/"
			data-sveltekit-reload
			class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8660A] px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_-4px_rgba(232,102,10,0.4)] transition-all hover:-translate-y-0.5 hover:bg-[#d15908] hover:shadow-[0_8px_25px_-4px_rgba(232,102,10,0.5)] sm:w-auto"
		>
			<Home size={18} />
			Ir al Inicio
		</a>
	</div>

</section>
