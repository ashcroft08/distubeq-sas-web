<script>
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';

	let { form } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Admin Login | Ferretería Distubeq</title>
</svelte:head>

<div class="fixed inset-0 font-sans antialiased text-gray-900 flex items-center justify-center p-4 bg-[#F5F7FA] overflow-hidden">
    <!-- Subtle geometric background pattern -->
    <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(#1B3A6B 0.5px, transparent 0.5px); background-size: 24px 24px;"></div>

    <main class="w-full max-w-md relative z-10" in:fly={{ y: 20, duration: 800 }}>
        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <!-- Header section -->
            <div class="pt-8 pb-6 px-10 text-center bg-gradient-to-b from-white to-gray-50/50">
                <div class="flex justify-center mb-4">
                    <div class="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                         <span class="text-white font-bold text-2xl">D</span>
                    </div>
                </div>
                <h1 class="text-2xl font-extrabold text-brand-navy tracking-tight mb-1">Acceso Administrativo</h1>
                <p class="text-gray-500 font-medium text-sm">Panel de Gestión Distubeq SAS</p>
            </div>

            <!-- Login Form -->
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
                class="px-10 pb-10 space-y-5"
            >
                {#if form?.message}
                    <div in:fade class="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 text-sm font-semibold flex items-center gap-3">
                        <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        {form.message}
                    </div>
                {/if}

                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1" for="email">Correo Electrónico</label>
                    <div class="relative group">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-navy transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                        </span>
                        <input 
                            class="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-brand-navy focus:ring-0 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white placeholder:text-gray-300 text-sm font-medium" 
                            id="email" 
                            name="email" 
                            placeholder="admin@distubeq.com" 
                            required 
                            type="email"
                        />
                    </div>
                </div>

                <div class="space-y-1.5">
                    <div class="flex items-center justify-between ml-1">
                        <label class="text-[10px] font-bold uppercase tracking-wider text-gray-400" for="password">Contraseña</label>
                        <a class="text-[10px] font-bold text-brand-orange hover:text-orange-600 transition-colors uppercase tracking-wider" href="/login/recovery">¿Olvidaste tu contraseña?</a>
                    </div>
                    <div class="relative group">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-navy transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </span>
                        <input 
                            class="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-brand-navy focus:ring-0 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white placeholder:text-gray-300 text-sm font-medium" 
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
                        class="w-full bg-brand-navy text-white font-bold py-3.5 px-6 rounded-xl hover:bg-opacity-95 active:scale-[0.98] transition-all duration-300 shadow-xl hover:shadow-2xl flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed" 
                        type="submit"
                        disabled={loading}
                    >
                        {#if loading}
                            <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {:else}
                            <span>Entrar al Sistema</span>
                            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        {/if}
                    </button>
                </div>

                <div class="text-center pt-5 border-t border-gray-50">
                    <a class="inline-flex items-center text-[10px] font-bold text-gray-400 hover:text-brand-navy transition-colors uppercase tracking-widest gap-2" href="/">
                        <svg class="w-3.4 h-3 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Volver a la Web
                    </a>
                </div>
            </form>
        </div>

        <footer class="mt-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            <p>© 2026 Distubeq SAS • Ecuador</p>
        </footer>
    </main>
</div>

<style>
    :global(body) {
        background-color: #F5F7FA;
    }
    .text-brand-navy { color: #1B3A6B; }
    .bg-brand-navy { background-color: #1B3A6B; }
    .text-brand-orange { color: #E8660A; }
    .focus\:border-brand-navy:focus { border-color: #1B3A6B; }
</style>