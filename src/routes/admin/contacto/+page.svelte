<script>
	import { enhance } from '$app/forms';
	import { fade, slide, scale } from 'svelte/transition';
	import {
		Mail,
		Clock,
		Plus,
		Pencil,
		Trash2,
		X,
		Save,
		Settings,
		Calendar,
		AlertCircle,
		CheckCircle2,
		Loader2,
		Globe
	} from 'lucide-svelte';

	let { data, form } = $props();
	let config = $derived(data.config || { correo_corporativo: '' });
	let horarios = $derived(data.horarios || []);

	// Form states
	let showModal = $state(false);
	let editingHorario = $state(null);
	let isSubmitting = $state(false);
	let isDeleting = $state(null);

	let occupiedOrders = $derived(
		horarios.filter((h) => h.id_horario !== editingHorario?.id_horario).map((h) => h.orden)
	);

	// Modal fields
	let dias_texto = $state('');
	let hora_apertura = $state('');
	let hora_cierre = $state('');
	let esta_cerrado = $state(false);
	let orden = $state(0);

	function openAddModal() {
		editingHorario = null;
		dias_texto = '';
		hora_apertura = '';
		hora_cierre = '';
		esta_cerrado = false;
		orden = horarios.length;
		showModal = true;
	}

	function openEditModal(horario) {
		editingHorario = horario;
		dias_texto = horario.dias_texto;
		hora_apertura = horario.hora_apertura || '';
		hora_cierre = horario.hora_cierre || '';
		esta_cerrado = horario.esta_cerrado;
		orden = horario.orden;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingHorario = null;
	}
</script>

<svelte:head>
	<title>Configuración de Contacto | Admin</title>
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
				<Globe size={24} />
			</div>
			<div class="flex-1">
				<h1 class="text-2xl leading-none font-bold text-slate-900">Gestión de Canales</h1>
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
		{/if}
	</div>

	<div class="space-y-8">
		<!-- Main Form: Config Empresa -->
		<section
			class="flex h-fit flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
		>
			<div class="border-b border-slate-50 bg-slate-50/50 p-6">
				<h2 class="flex items-center gap-2 text-lg font-bold text-slate-800">
					<Mail size={18} class="text-blue-600" />
					Correo Corporativo
				</h2>
			</div>
			<form
				method="POST"
				action="?/updateConfig"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
				class="flex flex-col items-end gap-6 p-6 sm:flex-row"
			>
				<div class="w-full flex-1 space-y-2">
					<label
						for="correo_corporativo"
						class="ml-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase"
						>Email Destinatario</label
					>
					<div class="relative">
						<input
							type="email"
							id="correo_corporativo"
							name="correo_corporativo"
							value={config.correo_corporativo}
							placeholder="ejemplo@distubeq.com"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pr-4 pl-11 font-medium transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
							required
						/>
						<div class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400">
							<Mail size={18} />
						</div>
					</div>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					class="flex w-full min-w-[200px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 sm:w-auto"
				>
					{#if isSubmitting}
						<Loader2 size={18} class="animate-spin" />
					{:else}
						<Save size={18} />
					{/if}
					Actualizar Email
				</button>
			</form>
		</section>

		<!-- Horarios List -->
		<section
			class="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
		>
			<div
				class="flex flex-col items-center justify-between gap-4 border-b border-slate-50 bg-slate-50/50 px-8 py-6 sm:flex-row"
			>
				<h2 class="flex items-center gap-2 text-lg font-bold text-slate-800">
					<Clock size={18} class="text-blue-600" />
					Horarios de Atención
				</h2>
				<button
					onclick={openAddModal}
					class="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 sm:w-auto"
				>
					<Plus size={18} class="transition-transform group-hover:rotate-90" />
					Añadir Horario
				</button>
			</div>

			<div class="flex-1">
				{#if horarios.length === 0}
					<div class="flex flex-col items-center justify-center space-y-4 p-20 text-center">
						<div
							class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300"
						>
							<Clock size={32} />
						</div>
						<div class="space-y-1">
							<h3 class="font-bold text-slate-800">No hay horarios registrados</h3>
							<p class="mx-auto max-w-xs text-sm text-slate-500">
								Configura los días y horas en los que tu empresa presta servicio.
							</p>
						</div>
					</div>
				{:else}
					<div class="overflow-x-auto">
						<table class="w-full text-left">
							<thead>
								<tr
									class="border-b border-slate-50 bg-slate-50/30 text-[11px] font-bold tracking-widest text-slate-400 uppercase"
								>
									<th class="px-8 py-4">Orden</th>
									<th class="px-8 py-4">Días / Período</th>
									<th class="px-8 py-4">Status / Horas</th>
									<th class="px-8 py-4 text-right">Acciones</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-50">
								{#each horarios as horario (horario.id_horario)}
									<tr class="group transition-colors hover:bg-blue-50/20">
										<td class="px-8 py-5 font-mono text-sm text-slate-400">#{horario.orden}</td>
										<td class="px-8 py-5">
											<p class="font-bold text-slate-900">{horario.dias_texto}</p>
										</td>
										<td class="px-8 py-5">
											{#if horario.esta_cerrado}
												<span
													class="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold tracking-wide text-red-700 uppercase"
												>
													Cerrado
												</span>
											{:else}
												<div class="flex items-center gap-2">
													<span
														class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wide text-emerald-700 uppercase"
													>
														Abierto
													</span>
													<span class="text-sm font-medium text-slate-600">
														{horario.hora_apertura} - {horario.hora_cierre}
													</span>
												</div>
											{/if}
										</td>
										<td class="px-8 py-5 text-right">
											<div class="flex items-center justify-end gap-2">
												<button
													onclick={() => openEditModal(horario)}
													class="rounded-xl p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
													title="Editar"
												>
													<Pencil size={18} />
												</button>
												<form
													method="POST"
													action="?/deleteHorario"
													use:enhance={() => {
														isDeleting = horario.id_horario;
														return async ({ update }) => {
															isDeleting = null;
															await update();
														};
													}}
												>
													<input type="hidden" name="id" value={horario.id_horario} />
													<button
														type="submit"
														class="rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
														disabled={isDeleting === horario.id_horario}
														title="Eliminar"
													>
														{#if isDeleting === horario.id_horario}
															<Loader2 size={18} class="animate-spin" />
														{:else}
															<Trash2 size={18} />
														{/if}
													</button>
												</form>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		</section>
	</div>
</div>

<!-- Modal Horario -->
{#if showModal}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
		in:fade={{ duration: 200 }}
		onclick={(e) => e.target === e.currentTarget && closeModal()}
	>
		<div
			class="relative flex w-full max-w-lg flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl"
			in:scale={{ duration: 300, start: 0.95 }}
		>
			<div
				class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-8 py-6"
			>
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
						<Clock size={20} />
					</div>
					<div>
						<h3 class="text-xl font-bold text-slate-900">
							{editingHorario ? 'Editar Horario' : 'Añadir Horario'}
						</h3>
						<p class="mt-0.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
							Gestión de Tiempo
						</p>
					</div>
				</div>
				<button
					onclick={closeModal}
					class="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200"
				>
					<X size={20} />
				</button>
			</div>

			<form
				method="POST"
				action="?/upsertHorario"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						showModal = false;
						await update();
					};
				}}
				class="space-y-6 p-8"
			>
				<input type="hidden" name="id_horario" value={editingHorario?.id_horario || ''} />

				<!-- Días -->
				<div class="space-y-2">
					<label
						for="dias_texto"
						class="ml-1 text-xs font-bold tracking-wider text-slate-500 uppercase"
						>Días o Período</label
					>
					<input
						type="text"
						name="dias_texto"
						id="dias_texto"
						bind:value={dias_texto}
						placeholder="Ej: Lunes a Viernes"
						class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-medium transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
						required
					/>
				</div>

				<!-- Toggles Status -->
				<div class="space-y-4">
					<span class="ml-1 block text-xs font-bold tracking-wider text-slate-500 uppercase"
						>Estado de Servicio</span
					>
					<div class="grid grid-cols-2 gap-3">
						<button
							type="button"
							onclick={() => (esta_cerrado = false)}
							class="flex items-center justify-center gap-2 rounded-2xl border-2 p-4 font-bold transition-all {!esta_cerrado
								? 'border-emerald-500 bg-emerald-50 text-emerald-700'
								: 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}"
						>
							<div
								class="flex h-4 w-4 items-center justify-center rounded-full border-2 border-current"
							>
								{#if !esta_cerrado}<div class="h-2 w-2 rounded-full bg-current"></div>{/if}
							</div>
							Abierto
						</button>
						<button
							type="button"
							onclick={() => (esta_cerrado = true)}
							class="flex items-center justify-center gap-2 rounded-2xl border-2 p-4 font-bold transition-all {esta_cerrado
								? 'border-red-500 bg-red-50 text-red-700'
								: 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}"
						>
							<div
								class="flex h-4 w-4 items-center justify-center rounded-full border-2 border-current"
							>
								{#if esta_cerrado}<div class="h-2 w-2 rounded-full bg-current"></div>{/if}
							</div>
							Cerrado
						</button>
						<input type="hidden" name="esta_cerrado" value={esta_cerrado} />
					</div>
				</div>

				{#if !esta_cerrado}
					<div class="grid grid-cols-2 gap-4" transition:slide>
						<div class="space-y-2">
							<label
								for="hora_apertura"
								class="ml-1 text-xs font-bold tracking-wider text-slate-500 uppercase"
								>Hora Apertura</label
							>
							<input
								type="text"
								name="hora_apertura"
								id="hora_apertura"
								bind:value={hora_apertura}
								placeholder="8:00 AM"
								class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-medium transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
							/>
						</div>
						<div class="space-y-2">
							<label
								for="hora_cierre"
								class="ml-1 text-xs font-bold tracking-wider text-slate-500 uppercase"
								>Hora Cierre</label
							>
							<input
								type="text"
								name="hora_cierre"
								id="hora_cierre"
								bind:value={hora_cierre}
								placeholder="6:00 PM"
								class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-medium transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
							/>
						</div>
					</div>
				{/if}

				<!-- Orden de Visualización -->
				<div class="space-y-4">
					<div class="ml-1 flex items-center justify-between">
						<span class="text-xs font-bold tracking-wider text-slate-500 uppercase"
							>Orden de Visualización</span
						>
						{#if occupiedOrders.includes(orden)}
							<span
								class="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase"
								transition:fade
							>
								<AlertCircle size={10} /> Ocupado
							</span>
						{/if}
					</div>

					<div class="grid grid-cols-6 gap-2">
						{#each Array(12) as _, i}
							{@const num = i + 1}
							{@const isOccupied = occupiedOrders.includes(num)}
							{@const isSelected = orden === num}

							<button
								type="button"
								onclick={() => !isOccupied && (orden = num)}
								disabled={isOccupied}
								class="relative flex h-12 items-center justify-center rounded-xl border-2 font-bold transition-all
                                    {isSelected
									? 'border-blue-600 bg-blue-600 text-white shadow-md'
									: isOccupied
										? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300'
										: 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600'}"
							>
								{num}
								{#if isOccupied}
									<div class="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-slate-300"></div>
								{/if}
							</button>
						{/each}
					</div>
					<input type="hidden" name="orden" value={orden} />
					<p class="text-center text-[10px] text-slate-400 italic">
						Selecciona la posición en la que aparecerá este horario.
					</p>
				</div>

				<!-- Footer Actions -->
				<div class="flex gap-3 pt-6">
					<button
						type="button"
						onclick={closeModal}
						class="flex-1 rounded-2xl border border-slate-200 px-6 py-4 font-bold text-slate-600 transition-colors hover:bg-slate-50"
					>
						Cancelar
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-50"
					>
						{#if isSubmitting}
							<Loader2 size={18} class="animate-spin" />
							Guardando...
						{:else}
							<Save size={18} />
							{editingHorario ? 'Actualizar Horario' : 'Crear Horario'}
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	/* Premium layout refinements */
	:global(body) {
		background-color: #f8fafc;
	}
</style>
