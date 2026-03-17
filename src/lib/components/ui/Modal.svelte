<script>
    import { fade, fly } from 'svelte/transition';
    import { onMount } from 'svelte';

    let { 
        show = $bindable(false), 
        title = '', 
        children,
        maxWidth = 'max-w-md',
        closeOnBackdropClick = true
    } = $props();

    function close() {
        show = false;
    }

    function handleKeydown(event) {
        if (event.key === 'Escape' && show) {
            close();
        }
    }

    onMount(() => {
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    });
</script>

{#if show}
    <div 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        aria-modal="true"
        role="dialog"
    >
        <!-- Backdrop -->
        <div 
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" 
            transition:fade={{ duration: 200 }}
            onclick={() => closeOnBackdropClick && close()}
            onkeydown={(e) => closeOnBackdropClick && e.key === 'Enter' && close()}
            role="button"
            tabindex="-1"
            aria-label="Cerrar modal"
        ></div>

        <!-- Modal Content -->
        <div 
            class="bg-white rounded-2xl shadow-2xl w-full {maxWidth} relative z-10 flex flex-col max-h-[90vh] overflow-hidden"
            transition:fly={{ y: 20, duration: 300 }}
        >
            <!-- Header -->
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 class="text-xl font-bold text-slate-800">{title}</h3>
                <button 
                    onclick={close}
                    class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    aria-label="Cerrar"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-6 overflow-y-auto flex-1 sidebar-scroll">
                {@render children()}
            </div>
        </div>
    </div>
{/if}

<style>
    .sidebar-scroll::-webkit-scrollbar { width: 4px; }
    .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
    .sidebar-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
