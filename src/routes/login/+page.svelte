<script>
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';

	let { form } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Admin Login | Ferretería Distubeq</title>
</svelte:head>

<div
	class="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#F5F7FA] p-4 font-sans text-gray-900 antialiased"
>
	<div
		class="pointer-events-none absolute inset-0 opacity-10"
		style="background-image: radial-gradient(#1B3A6B 0.5px, transparent 0.5px); background-size: 24px 24px;"
	></div>

	<main class="relative z-10 w-full max-w-md" in:fly={{ y: 20, duration: 800 }}>
		<!-- Logo FUERA de la card -->
		<div class="mb-6 flex justify-center">
			<div class="logo-placeholder group">
				<svg class="h-20 w-20 text-[#1b3a6b] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="4" y="4" width="72" height="72" rx="16" stroke="currentColor" stroke-width="3" fill="white" class="drop-shadow-sm"/>
					<rect x="12" y="12" width="56" height="56" rx="10" fill="currentColor" opacity="0.06"/>
					<path d="M40 24C33.373 24 28 29.373 28 36c0 4.418 2.388 8.268 5.941 10.342V52a2 2 0 002 2h8.118a2 2 0 002-2v-5.658C49.612 44.268 52 40.418 52 36c0-6.627-5.373-12-12-12z" fill="currentColor" opacity="0.12"/>
					<circle cx="40" cy="36" r="8" stroke="currentColor" stroke-width="2.5" fill="none"/>
					<path d="M40 30v12M34 36h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
					<rect x="34" y="50" width="12" height="4" rx="1.5" fill="currentColor" opacity="0.25"/>
					<rect x="36" y="55" width="8" height="2" rx="1" fill="currentColor" opacity="0.15"/>
				</svg>
				<p class="mt-2 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Sin Logo</p>
			</div>
		</div>

		<div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
			<div class="bg-gradient-to-b from-white to-gray-50/50 px-6 pt-8 pb-6 text-center sm:px-10">
				<h1 class="text-brand-navy mb-1 text-2xl font-extrabold tracking-tight">
					Acceso Administrativo
				</h1>
				<p class="text-sm font-medium text-gray-500">
					Ingrese sus credenciales para acceder al sistema
				</p>
			</div>

			<form
				method="POST"
				action="?/login"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
				class="space-y-5 px-6 pb-10 sm:px-10"
			>
				{#if form?.message}
					<div
						in:fade
						class="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-600"
					>
						<svg class="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"
							/>
						</svg>
						{form.message}
					</div>
				{/if}

				<div class="space-y-1.5">
					<label class="ml-1 text-xs font-bold tracking-wider text-gray-500 uppercase" for="email"
						>Correo Electrónico</label
					>
					<div class="group relative">
						<span
							class="group-focus-within:text-brand-navy absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 transition-colors"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
								/></svg
							>
						</span>
						<input
							class="focus:border-brand-navy w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 py-3 pr-4 pl-11 text-sm font-medium transition-all duration-200 outline-none placeholder:text-gray-300 hover:bg-gray-50 focus:bg-white focus:ring-0"
							id="email"
							name="email"
							placeholder="admin@distubeq.com"
							required
							type="email"
						/>
					</div>
				</div>

				<div class="space-y-1.5">
					<div class="ml-1 flex items-center justify-between">
						<label class="text-xs font-bold tracking-wider text-gray-500 uppercase" for="password"
							>Contraseña</label
						>
						<a
							class="text-brand-orange text-[10px] font-bold tracking-wider uppercase transition-colors hover:text-orange-600"
							href="/login/recovery">¿Olvidaste tu contraseña?</a
						>
					</div>
					<div class="group relative">
						<span
							class="group-focus-within:text-brand-navy absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 transition-colors"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/></svg
							>
						</span>
						<input
							class="focus:border-brand-navy w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 py-3 pr-4 pl-11 text-sm font-medium transition-all duration-200 outline-none placeholder:text-gray-300 hover:bg-gray-50 focus:bg-white focus:ring-0"
							id="password"
							name="password"
							placeholder="••••••••"
							required
							type="password"
						/>
					</div>
				</div>

				<div class="pt-1">
					<button
						class="bg-brand-navy hover:bg-opacity-95 group flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold text-white shadow-xl transition-all duration-300 hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
						type="submit"
						disabled={loading}
					>
						{#if loading}
							<svg class="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24"
								><circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle><path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path></svg
							>
						{:else}
							<span>Entrar al Sistema</span>
							<svg
								class="h-4 w-4 transition-transform group-hover:translate-x-1"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 7l5 5m0 0l-5 5m5-5H6"
								/></svg
							>
						{/if}
					</button>
				</div>

				<div class="border-t border-gray-50 pt-5 text-center">
					<a
						class="hover:text-brand-navy inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase transition-colors"
						href="/"
					>
						<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/></svg
						>
						Volver a la Web
					</a>
				</div>
			</form>
		</div>

		<footer class="mt-6 text-center text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
			<p>© 2026 Distubeq SAS • Ecuador</p>
		</footer>
	</main>
</div>

<style>
	:global(body) {
		background-color: #f5f7fa;
	}
	.text-brand-navy {
		color: #1b3a6b;
	}
	.bg-brand-navy {
		background-color: #1b3a6b;
	}
	.text-brand-orange {
		color: #e8660a;
	}
	.focus\:border-brand-navy:focus {
		border-color: #1b3a6b;
	}
	.group-focus-within\:text-brand-navy:is(:where(.group):focus-within *) {
		color: #1b3a6b;
	}
	.hover\:text-brand-navy:hover {
		color: #1b3a6b;
	}
</style>
