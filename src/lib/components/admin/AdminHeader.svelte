<script>
    let { title = "Dashboard" } = $props();
</script>

<header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
    <h2 class="text-xl font-semibold text-slate-800">{title}</h2>
    <div class="flex items-center gap-4">
        <div class="relative text-slate-400 hover:text-[#f97316] transition-colors cursor-pointer">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            </svg>
            <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </div>
    </div>
</header>
