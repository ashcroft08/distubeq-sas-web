<script>
	import { Send, Mail, Phone, Clock, MapPin, ArrowRight, Building2 } from 'lucide-svelte';

	let isSubmitting = $state(false);

	function handleSubmit(e) {
		isSubmitting = true;
		// Placeholder: connect to form action later
		setTimeout(() => {
			isSubmitting = false;
		}, 1500);
	}
</script>

<svelte:head>
	<title>Contacto | Distubeq</title>
	<meta
		name="description"
		content="Solicita tu cotización personalizada. Completa el formulario y nuestro equipo te enviará una propuesta en menos de 24 horas."
	/>
</svelte:head>

<!-- Hero -->
<section class="industrial-bg relative overflow-hidden border-b-4 border-accent-orange pt-20 pb-16 lg:pt-28 lg:pb-24">
	<div
		class="absolute inset-0 opacity-[0.03] mix-blend-overlay"
		style="background-image: url('https://www.transparenttextures.com/patterns/carbon-fibre.png');"
	></div>

	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
		<div class="max-w-3xl">
			<div class="mb-6 flex items-center gap-3">
				<div class="h-[2px] w-8 bg-accent-orange"></div>
				<span class="font-display text-sm font-bold uppercase tracking-widest text-accent-orange">
					Atención Corporativa
				</span>
			</div>

			<h1 class="font-display mb-6 text-5xl font-black leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
				Asesorate con
				<span class="bg-gradient-to-r from-accent-orange to-[#ff8c3a] bg-clip-text text-transparent">
					Nosotros.
				</span>
			</h1>

			<p class="max-w-2xl text-lg font-light leading-relaxed text-slate-300">
				Solicita tu cotización personalizada, completa el formulario y nuestro equipo de expertos te
				enviará una propuesta detallada en menos de 24 horas. Estamos listos para ayudarte a impulsar tu proyecto.
			</p>
		</div>
	</div>
</section>

<!-- Main Content -->
<section class="blueprint-grid relative bg-background-light py-16 lg:py-24">
	<div class="mx-auto max-w-7xl px-4 sm:px-6">
		<div class="flex flex-col gap-12 lg:flex-row lg:gap-20">

			<!-- Left Column: Channels + Schedule -->
			<div class="space-y-8 lg:w-5/12">

				<!-- Direct Channels -->
				<div>
					<h2 class="font-display mb-6 text-2xl font-black text-primary">Canales Directos</h2>

					<div class="space-y-4">
						<!-- Email Card -->
						<div class="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-accent-orange/50">
							<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-50">
								<Mail size={22} class="text-primary" />
							</div>
							<div>
								<p class="font-display mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
									Cotizaciones Corporativas
								</p>
								<p class="font-bold text-primary">ventas@distubeq.com</p>
							</div>
						</div>

						<!-- WhatsApp Card -->
						<a
							href="https://wa.me/50766778899"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-[#25D366]"
						>
							<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/10 transition-colors group-hover:bg-[#25D366]">
								<svg class="h-6 w-6 fill-[#25D366] transition-colors group-hover:fill-white" viewBox="0 0 24 24">
									<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.411-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.656zm6.757-4.242c1.472.873 3.123 1.335 4.811 1.336 5.231 0 9.488-4.258 9.491-9.49.002-2.535-.985-4.917-2.78-6.712-1.796-1.796-4.177-2.784-6.713-2.784-5.232 0-9.49 4.258-9.493 9.491-.001 1.932.521 3.812 1.508 5.438l-1.003 3.665 3.763-.987zm9.837-7.14c-.235-.117-1.391-.687-1.606-.765-.215-.078-.372-.117-.528.117s-.606.765-.744.922-.274.176-.509.059c-.235-.117-.992-.365-1.89-1.166-.699-.624-1.171-1.395-1.308-1.63s-.014-.363.104-.48c.106-.105.235-.274.352-.411s.156-.235.235-.391.039-.313-.02-.43c-.059-.117-.528-1.27-.724-1.74-.191-.46-.385-.397-.528-.404l-.45-.008c-.156 0-.411.059-.626.294-.215.235-.821.802-.821 1.956s.841 2.269.958 2.426c.117.157 1.654 2.525 4.007 3.541.559.242.996.387 1.337.494.562.179 1.073.154 1.477.094.45-.067 1.391-.568 1.586-1.115.195-.547.195-1.017.137-1.115s-.215-.176-.45-.293z"></path>
								</svg>
							</div>
							<div class="flex-1">
								<p class="font-display mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
									Asistencia Rápida
								</p>
								<div class="flex items-center justify-between">
									<p class="font-display text-xl font-bold text-primary">+507 6677-8899</p>
									<ArrowRight size={20} class="text-slate-400 transition-colors group-hover:text-[#25D366]" />
								</div>
							</div>
						</a>
					</div>
				</div>

				<!-- Schedule Card -->
				<div class="relative overflow-hidden rounded-xl bg-primary p-8">
					<div class="absolute -right-4 -bottom-4 opacity-5">
						<Clock size={120} class="text-white" />
					</div>
					<h3 class="font-display mb-6 flex items-center gap-3 text-lg font-bold text-white">
						<Clock size={22} class="text-accent-orange" />
						Horario Operativo
					</h3>
					<div class="relative z-10 space-y-4 text-sm">
						<div class="flex items-center justify-between border-b border-white/10 pb-3">
							<span class="font-medium text-slate-300">Lunes a Viernes</span>
							<span class="font-bold text-white">08:00 AM — 05:00 PM</span>
						</div>
						<div class="flex items-center justify-between border-b border-white/10 pb-3">
							<span class="font-medium text-slate-300">Sábados</span>
							<span class="font-bold text-white">08:00 AM — 12:00 PM</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="font-medium text-slate-400">Domingos</span>
							<span class="font-display text-xs font-bold uppercase tracking-wider text-accent-orange">Cerrado</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Column: Form -->
			<div class="lg:w-7/12">
				<div class="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
					<div class="mb-8">
						<h2 class="font-display mb-2 text-2xl font-black text-primary">Envíenos su Requerimiento</h2>
						<p class="text-sm text-slate-600">
							Complete el formulario y un consultor técnico analizará sus necesidades antes de contactarlo.
						</p>
					</div>

					<form class="space-y-6" onsubmit={handleSubmit}>
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<label class="form-label" for="nombre">Nombre o Razón Social</label>
								<input class="form-input" id="nombre" type="text" placeholder="Ej. Constructora Andina S.A." required />
							</div>
							<div>
								<label class="form-label" for="email">Correo Electrónico</label>
								<input class="form-input" id="email" type="email" placeholder="ejemplo@empresa.com" required />
							</div>
						</div>

						<div>
							<label class="form-label" for="telefono">Teléfono de Contacto (Opcional)</label>
							<input class="form-input" id="telefono" type="tel" placeholder="+507 0000-0000" />
						</div>

						<div>
							<label class="form-label" for="mensaje">Detalles del Proyecto o Materiales</label>
							<textarea
								class="form-input min-h-[120px] resize-y"
								id="mensaje"
								placeholder="Describa brevemente los diámetros, materiales (PVC, Acero, etc.) o especificaciones del proyecto..."
								required
							></textarea>
						</div>

						<div class="pt-4">
							<button
								type="submit"
								disabled={isSubmitting}
								class="font-display inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-50 sm:w-auto"
							>
								{#if isSubmitting}
									<div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
									Enviando...
								{:else}
									Enviar Solicitud
									<Send size={16} />
								{/if}
							</button>
						</div>
					</form>
				</div>
			</div>

		</div>
	</div>
</section>

<!-- Map Section -->
<section class="relative h-[400px] overflow-hidden border-t border-slate-200 bg-slate-200">
	<iframe
		src="https://maps.google.com/maps?q=Via+Transistmica,+Panama&t=&z=14&ie=UTF8&iwloc=&output=embed"
		class="absolute inset-0 h-full w-full border-0 opacity-80 grayscale"
		allowfullscreen
		loading="lazy"
		referrerpolicy="no-referrer-when-downgrade"
		title="Ubicación Distubeq"
	></iframe>

	<div class="pointer-events-none absolute inset-0 bg-primary/10"></div>

	<div class="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6">
		<div class="pointer-events-auto max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-xl">
			<div class="mb-4 flex items-start gap-4">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-orange/10">
					<Building2 size={20} class="text-accent-orange" />
				</div>
				<div>
					<h3 class="font-display mb-1 text-xl font-bold text-primary">Casa Matriz</h3>
					<p class="text-sm leading-relaxed text-slate-600">
						Av. Industrial 1234, Área Industrial.<br />Ciudad de Panamá, Panamá.
					</p>
				</div>
			</div>
			<a
				href="/sucursales"
				class="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
			>
				Ver todas las sucursales
			</a>
		</div>
	</div>
</section>
