<script>
	import logoImg from '$lib/assets/images/Logo_Distubeq.webp';
	import { MapPin, Phone, Mail } from 'lucide-svelte';
</script>

<footer class="border-t-[6px] border-accent-orange bg-primary pt-16 pb-8 text-white">
	<div class="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-10 px-4 md:grid-cols-2 lg:grid-cols-4">

		<!-- Brand -->
		<div class="col-span-1 lg:col-span-1">
			<div class="mb-6 flex items-center gap-2">
				<img src={logoImg} alt="Distubeq" class="h-8 w-auto brightness-0 invert" />
				<span class="font-display text-xl font-bold tracking-tight">Distubeq</span>
			</div>
			<p class="mb-6 text-sm leading-relaxed text-slate-300">
				Líderes en el suministro técnico de tuberías y sistemas de conducción. Calidad industrial garantizada.
			</p>
		</div>

		<!-- Navigation -->
		<div>
			<h4 class="mb-6 font-display text-sm font-bold uppercase tracking-wider text-white">Navegación</h4>
			<ul class="space-y-3 text-sm">
				<li><a class="text-slate-300 transition-colors hover:text-accent-orange" href="/catalogo">Catálogo de Productos</a></li>
				<li><a class="text-slate-300 transition-colors hover:text-accent-orange" href="/sucursales">Nuestras Sucursales</a></li>
				<li><a class="text-slate-300 transition-colors hover:text-accent-orange" href="/nosotros">Sobre Nosotros</a></li>
			</ul>
		</div>

		<!-- Contact -->
		<div>
			<h4 class="mb-6 font-display text-sm font-bold uppercase tracking-wider text-white">Contacto</h4>
			<ul class="space-y-4 text-sm">
				<li class="flex items-start gap-3 text-slate-300">
					<MapPin size={20} class="shrink-0 text-accent-orange" />
					<span>Av. Industrial 1234, Ciudad de Panamá</span>
				</li>
				<li class="flex items-center gap-3 text-slate-300">
					<Phone size={20} class="shrink-0 text-accent-orange" />
					<span>+507 800-FERRE</span>
				</li>
				<li class="flex items-center gap-3 text-slate-300">
					<Mail size={20} class="shrink-0 text-accent-orange" />
					<span>ventas@distubeq.com</span>
				</li>
			</ul>
		</div>

		<!-- CTA WhatsApp -->
		<div>
			<h4 class="mb-6 font-display text-sm font-bold uppercase tracking-wider text-white">Ventas Corporativas</h4>
			<p class="mb-4 text-sm text-slate-300">Cotice de forma inmediata con nuestro equipo.</p>
			<a
				href="https://wa.me/5079133326238"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#20b958]"
			>
				<svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
					<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.411-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.656zm6.757-4.242c1.472.873 3.123 1.335 4.811 1.336 5.231 0 9.488-4.258 9.491-9.49.002-2.535-.985-4.917-2.78-6.712-1.796-1.796-4.177-2.784-6.713-2.784-5.232 0-9.49 4.258-9.493 9.491-.001 1.932.521 3.812 1.508 5.438l-1.003 3.665 3.763-.987zm9.837-7.14c-.235-.117-1.391-.687-1.606-.765-.215-.078-.372-.117-.528.117s-.606.765-.744.922-.274.176-.509.059c-.235-.117-.992-.365-1.89-1.166-.699-.624-1.171-1.395-1.308-1.63s-.014-.363.104-.48c.106-.105.235-.274.352-.411s.156-.235.235-.391.039-.313-.02-.43c-.059-.117-.528-1.27-.724-1.74-.191-.46-.385-.397-.528-.404l-.45-.008c-.156 0-.411.059-.626.294-.215.235-.821.802-.821 1.956s.841 2.269.958 2.426c.117.157 1.654 2.525 4.007 3.541.559.242.996.387 1.337.494.562.179 1.073.154 1.477.094.45-.067 1.391-.568 1.586-1.115.195-.547.195-1.017.137-1.115s-.215-.176-.45-.293z"></path>
				</svg>
				WhatsApp Business
			</a>
		</div>
	</div>

	<div class="mx-auto flex max-w-7xl items-center justify-between border-t border-white/10 px-4 pt-8 text-sm text-slate-400">
		<p>© {new Date().getFullYear()} Distubeq. Todos los derechos reservados.</p>
	</div>
</footer>
