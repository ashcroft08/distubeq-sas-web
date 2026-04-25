<script>
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
	import {
		ShieldCheck,
		Mail,
		Lock,
		Eye,
		EyeOff,
		Save,
		Loader2,
		AlertTriangle,
		CheckCircle2,
		KeyRound
	} from 'lucide-svelte';

	let { data, form } = $props();
	let isSubmittingEmail = $state(false);
	let isSubmittingPassword = $state(false);

	// Visibility toggles
	let showCurrentPassEmail = $state(false);
	let showCurrentPassPassword = $state(false);
	let showNewPass = $state(false);
	let showConfirmPass = $state(false);
</script>

<svelte:head>
	<title>Seguridad | Administrador</title>
</svelte:head>

<div class="space-y-8 pb-12">
	<!-- Header / Toolbar -->
	<div
		class="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row"
	>
		<div class="flex w-full items-center gap-4 sm:w-auto">
			<div
				class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
			>
				<ShieldCheck size={24} />
			</div>
			<div class="flex-1">
				<h1 class="text-2xl leading-none font-bold text-slate-900">Gestión de Acceso</h1>
			</div>
		</div>
		{#if form?.success}
			<div
				class="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700"
				in:fade
			>
				<CheckCircle2 size={16} />
				{form.message}
			</div>
		{:else if form?.message}
			<div
				class="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-bold text-red-700"
				in:fade
			>
				<AlertTriangle size={16} />
				{form.message}
			</div>
		{/if}
	</div>

	<!-- Info Banner -->
	<div class="flex gap-4 rounded-3xl border border-blue-100 bg-blue-50 p-5">
		<div
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200"
		>
			<AlertTriangle size={20} />
		</div>
		<div class="space-y-1">
			<h3 class="text-sm font-bold text-blue-900">Información Importante</h3>
			<p class="text-xs leading-relaxed font-medium text-blue-700">
				Los cambios realizados aquí actualizan el acceso administrativo en la base de datos.
				Asegúrate de tener tus nuevas credenciales anotadas antes de realizar cualquier cambio.
			</p>
		</div>
	</div>

	<div class="space-y-8">
		<!-- Correo de Acceso -->
		<section
			class="flex h-fit flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
		>
			<div class="border-b border-slate-50 bg-slate-50/50 p-6">
				<h2 class="flex items-center gap-2 text-lg font-bold text-slate-800">
					<Mail size={18} class="text-blue-600" />
					Correo de Acceso
				</h2>
			</div>
			<form
				method="POST"
				action="?/updateEmail"
				use:enhance={() => {
					isSubmittingEmail = true;
					return async ({ update }) => {
						isSubmittingEmail = false;
						await update({ reset: false });
					};
				}}
				class="space-y-6 p-6"
			>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<!-- Nuevo Email -->
					<div class="space-y-2">
						<label
							for="newEmail"
							class="ml-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase"
							>Nuevo Email</label
						>
						<div class="relative">
							<input
								type="email"
								name="newEmail"
								id="newEmail"
								value={data.userEmail || ''}
								placeholder="admin@distubeq.com"
								class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-11 font-medium transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
								required
							/>
							<div class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400">
								<Mail size={16} />
							</div>
						</div>
					</div>

					<!-- Contraseña Actual -->
					<div class="space-y-2">
						<label
							for="currentPasswordEmail"
							class="ml-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase"
							>Contraseña Actual</label
						>
						<div class="relative">
							<input
								type={showCurrentPassEmail ? 'text' : 'password'}
								name="currentPassword"
								id="currentPasswordEmail"
								placeholder="Ingresa tu contraseña"
								class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pr-11 pl-11 font-medium transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
								required
							/>
							<div class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400">
								<KeyRound size={16} />
							</div>
							<button
								type="button"
								onclick={() => (showCurrentPassEmail = !showCurrentPassEmail)}
								class="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-600"
							>
								{#if showCurrentPassEmail}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
							</button>
						</div>
					</div>
				</div>

				<div class="flex justify-end">
					<button
						type="submit"
						disabled={isSubmittingEmail}
						class="flex w-full min-w-[200px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 sm:w-auto"
					>
						{#if isSubmittingEmail}
							<Loader2 size={18} class="animate-spin" />
						{:else}
							<Save size={18} />
						{/if}
						Actualizar Email
					</button>
				</div>
			</form>
		</section>

		<!-- Cambiar Contraseña -->
		<section
			class="flex h-fit flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
		>
			<div class="border-b border-slate-50 bg-slate-50/50 p-6">
				<h2 class="flex items-center gap-2 text-lg font-bold text-slate-800">
					<Lock size={18} class="text-blue-600" />
					Contraseña
				</h2>
			</div>
			<form
				method="POST"
				action="?/updatePassword"
				use:enhance={() => {
					isSubmittingPassword = true;
					return async ({ update }) => {
						isSubmittingPassword = false;
						await update({ reset: false });
					};
				}}
				class="space-y-6 p-6"
			>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
					<!-- Contraseña Actual -->
					<div class="space-y-2">
						<label
							for="currentPasswordAuth"
							class="ml-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase"
							>Contraseña Actual</label
						>
						<div class="relative">
							<input
								type={showCurrentPassPassword ? 'text' : 'password'}
								name="currentPassword"
								id="currentPasswordAuth"
								placeholder="Ingresa tu contraseña"
								class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pr-11 pl-11 font-medium transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
								required
							/>
							<div class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400">
								<KeyRound size={16} />
							</div>
							<button
								type="button"
								onclick={() => (showCurrentPassPassword = !showCurrentPassPassword)}
								class="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-600"
							>
								{#if showCurrentPassPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
							</button>
						</div>
					</div>

					<!-- Nueva Contraseña -->
					<div class="space-y-2">
						<label
							for="newPassword"
							class="ml-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase"
							>Nueva Contraseña</label
						>
						<div class="relative">
							<input
								type={showNewPass ? 'text' : 'password'}
								name="newPassword"
								id="newPassword"
								placeholder="Nueva contraseña"
								class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pr-11 pl-11 font-medium transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
								required
							/>
							<div class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400">
								<Lock size={16} />
							</div>
							<button
								type="button"
								onclick={() => (showNewPass = !showNewPass)}
								class="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-600"
							>
								{#if showNewPass}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
							</button>
						</div>
					</div>

					<!-- Confirmar Contraseña -->
					<div class="space-y-2">
						<label
							for="confirmPassword"
							class="ml-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase"
							>Confirmar Contraseña</label
						>
						<div class="relative">
							<input
								type={showConfirmPass ? 'text' : 'password'}
								name="confirmPassword"
								id="confirmPassword"
								placeholder="Repite la contraseña"
								class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pr-11 pl-11 font-medium transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
								required
							/>
							<div class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400">
								<Lock size={16} />
							</div>
							<button
								type="button"
								onclick={() => (showConfirmPass = !showConfirmPass)}
								class="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-600"
							>
								{#if showConfirmPass}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
							</button>
						</div>
					</div>
				</div>

				<div class="flex justify-end">
					<button
						type="submit"
						disabled={isSubmittingPassword}
						class="flex w-full min-w-[200px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 sm:w-auto"
					>
						{#if isSubmittingPassword}
							<Loader2 size={18} class="animate-spin" />
						{:else}
							<Lock size={18} />
						{/if}
						Cambiar Contraseña
					</button>
				</div>
			</form>
		</section>
	</div>
</div>

<style>
	:global(body) {
		background-color: #f8fafc;
	}
</style>
