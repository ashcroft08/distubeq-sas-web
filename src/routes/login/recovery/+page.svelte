<script>
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import logoImg from '$lib/assets/images/Logo_Distubeq.webp';

	let { form } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Recuperar Contraseña | Ferretería Distubeq</title>
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
			<div class="group">
				<img
					src={logoImg}
					alt="Distubeq SAS"
					class="h-32 w-40 rounded-2xl object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
				/>
			</div>
		</div>

		<div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
			<div class="bg-gradient-to-b from-white to-gray-50/50 px-6 pt-8 pb-6 text-center sm:px-10">
				<div class="mb-3 flex justify-center">
					<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
						<svg
							class="h-7 w-7 text-[#e8660a]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
							/>
						</svg>
					</div>
				</div>
				<h1 class="text-brand-navy mb-1 text-2xl font-extrabold tracking-tight">
					Recuperar Contraseña
				</h1>
				<p class="text-sm font-medium text-gray-500">
					Ingresa tu correo electrónico y te enviaremos un código de recuperación
				</p>
			</div>

			{#if form?.success}
				<div class="space-y-5 px-6 pb-10 sm:px-10" in:fade>
					<div
						class="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-700"
					>
						<svg class="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
						{form.message}
					</div>

					<a
						class="bg-brand-navy hover:bg-opacity-95 group flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold text-white shadow-xl transition-all duration-300 hover:shadow-2xl active:scale-[0.98]"
						href="/login/recovery/reset?email={encodeURIComponent(form.email)}"
					>
						<span>Ingresar Código</span>
						<svg
							class="h-4 w-4 transition-transform group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
					</a>

					<div class="border-t border-gray-50 pt-5 text-center">
						<a
							class="hover:text-brand-navy inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase transition-colors"
							href="/login"
						>
							<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Volver al Login
						</a>
					</div>
				</div>
			{:else}
				<form
					method="POST"
					action="?/requestRecovery"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
					class="space-y-5 px-6 pb-10 sm:px-10"
				>
					{#if form?.message && !form?.success}
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
						<label
							class="ml-1 text-xs font-bold tracking-wider text-gray-500 uppercase"
							for="email"
						>
							Correo Electrónico
						</label>
						<div class="group relative">
							<span
								class="group-focus-within:text-brand-navy absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 transition-colors"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
									/>
								</svg>
							</span>
							<input
								class="focus:border-brand-navy w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 py-3 pr-4 pl-11 text-sm font-medium transition-all duration-200 outline-none placeholder:text-gray-300 hover:bg-gray-50 focus:bg-white focus:ring-0"
								id="email"
								name="email"
								placeholder="tu@correo.com"
								required
								type="email"
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
								<svg class="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
							{:else}
								<span>Enviar Código</span>
								<svg
									class="h-4 w-4 transition-transform group-hover:translate-x-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							{/if}
						</button>
					</div>

					<div class="border-t border-gray-50 pt-5 text-center">
						<a
							class="hover:text-brand-navy inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase transition-colors"
							href="/login"
						>
							<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Volver al Login
						</a>
					</div>
				</form>
			{/if}
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
