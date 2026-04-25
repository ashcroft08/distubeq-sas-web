/**
 * Distubeq - Sistema de Cotización Unificado (Cart)
 * Gestiona la lista de productos, el badge del navbar y el panel lateral.
 */

const Cart = {
    items: JSON.parse(localStorage.getItem('cotizacion')) || [],
    isOpen: false,
    whatsappNumber: '5079133326238',

    init() {
        this.injectStyles();
        this.injectSidebar();
        this.updateBadge();
        this.addEventListeners();
        console.log('📦 Cart System Initialized');
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #cart-sidebar {
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                z-index: 1000;
            }
            #cart-overlay {
                transition: opacity 0.3s ease-out;
                z-index: 999;
            }
            .cart-open #cart-sidebar { transform: translateX(0); }
            .cart-open #cart-overlay { opacity: 1; pointer-events: auto; }
            .cart-closed #cart-sidebar { transform: translateX(100%); }
            .cart-closed #cart-overlay { opacity: 0; pointer-events: none; }
            
            .custom-scrollbar::-webkit-scrollbar { width: 5px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { 
                background: #cbd5e1; 
                border-radius: 10px; 
            }
        `;
        document.head.appendChild(style);
    },

    injectSidebar() {
        const sidebarHTML = `
            <div id="cart-overlay" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 pointer-events-none"></div>
            <div id="cart-sidebar" class="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#1e293b] shadow-2xl flex flex-col translate-x-full border-l border-slate-200 dark:border-slate-800">
                <header class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] shrink-0">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-primary dark:text-white text-[28px]">receipt_long</span>
                        <h2 class="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight">Mi Cotización</h2>
                    </div>
                    <button id="close-cart" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </header>

                <div id="cart-items-container" class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
                    <!-- Items go here -->
                </div>

                <div id="cart-footer" class="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] shrink-0">
                    <div id="cart-preview" class="mb-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[14px]">preview</span> Resumen del Mensaje
                        </p>
                        <p id="cart-preview-text" class="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-h-[60px] overflow-hidden whitespace-pre-wrap"></p>
                    </div>

                    <button id="send-whatsapp" class="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b958] text-white py-3.5 rounded-lg font-bold text-base transition-all shadow-lg group mb-4">
                        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.006.332.013c.101.007.245-.043.383.282.144.354.498 1.214.542 1.301.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.101-.177.211-.077.383.099.172.443.732.951 1.185.655.584 1.207.765 1.38.851.173.086.275.072.376-.043.101-.116.433-.505.548-.677.116-.174.231-.144.39-.087.158.058 1.011.477 1.184.563.173.086.289.13.332.202.045.072.045.419-.1.824zM12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.655 1.441 5.161L2 22l5.011-1.314C8.421 21.579 10.132 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"></path></svg>
                        Solicitar Cotización
                    </button>

                    <button id="clear-cart" class="w-full text-center text-slate-400 hover:text-red-500 text-xs font-bold transition-colors py-2 flex items-center justify-center gap-1">
                        <span class="material-symbols-outlined text-[14px]">delete_sweep</span>
                        Vaciar Lista
                    </button>
                </div>
            </div>
        `;
        const div = document.createElement('div');
        div.innerHTML = sidebarHTML;
        document.body.appendChild(div);
    },

    addEventListeners() {
        // Toggle Sidebar
        document.addEventListener('click', (e) => {
            if (e.target.closest('#cart-button')) {
                e.preventDefault();
                this.open();
            }
            if (e.target.closest('#close-cart') || e.target.closest('#cart-overlay')) {
                this.close();
            }
            if (e.target.closest('#clear-cart')) {
                this.clear();
            }
            if (e.target.closest('#send-whatsapp')) {
                this.sendToWhatsApp();
            }
            // Add to cart buttons (delegation)
            const addBtn = e.target.closest('[data-cart-add]');
            if (addBtn) {
                const product = JSON.parse(addBtn.getAttribute('data-product'));
                this.add(product);
            }
        });
    },

    open() {
        document.body.classList.add('cart-open');
        document.body.classList.remove('cart-closed');
        this.render();
    },

    close() {
        document.body.classList.remove('cart-open');
        document.body.classList.add('cart-closed');
    },

    add(product) {
        // Add default qty if missing
        product.qty = product.qty || 1;
        this.items.push(product);
        this.save();
        this.updateBadge();
        this.open(); // Show sidebar when adding
        
        // Visual feedback
        console.log('✅ Added to cart:', product.name);
    },

    remove(index) {
        this.items.splice(index, 1);
        this.save();
        this.updateBadge();
        this.render();
    },

    clear() {
        if (confirm('¿Vaciar toda la lista?')) {
            this.items = [];
            this.save();
            this.updateBadge();
            this.render();
        }
    },

    save() {
        localStorage.setItem('cotizacion', JSON.stringify(this.items));
    },

    updateBadge() {
        const badges = document.querySelectorAll('#cart-badge');
        badges.forEach(badge => {
            badge.innerText = this.items.length;
            badge.style.display = this.items.length > 0 ? 'flex' : 'none';
        });
    },

    render() {
        const container = document.getElementById('cart-items-container');
        const previewText = document.getElementById('cart-preview-text');
        const footer = document.getElementById('cart-footer');

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center text-center py-12">
                    <div class="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <span class="material-symbols-outlined text-4xl text-slate-200 dark:text-slate-600">inventory</span>
                    </div>
                    <h3 class="font-bold text-xl text-slate-900 dark:text-white mb-2">Su lista está vacía</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-sm max-w-[200px] mx-auto leading-relaxed">Agregue materiales industriales para solicitar su cotización.</p>
                </div>
            `;
            footer.classList.add('hidden');
            return;
        }

        footer.classList.remove('hidden');
        container.innerHTML = this.items.map((p, i) => `
            <div class="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm group">
                <div class="w-16 h-16 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-2 shrink-0">
                    <img src="${p.img || './img/tubo_l_cobre.png'}" alt="${p.name}" class="w-full h-full object-contain" onerror="this.src='./img/tubo_m_cobre.png'">
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">${p.name}</h4>
                    <p class="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">${p.ref || 'Estándar'}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="text-[10px] bg-primary/10 text-primary dark:text-accent-orange dark:bg-accent-orange/10 px-2 py-0.5 rounded font-bold">${p.qty}u</span>
                    </div>
                </div>
                <button onclick="Cart.remove(${i})" class="text-slate-300 hover:text-red-500 transition-colors p-2 shrink-0">
                    <span class="material-symbols-outlined text-[20px]">delete</span>
                </button>
            </div>
        `).join('');

        // Preview Message
        let msg = `*Hola Distubeq!* 👋\n\nQuisiera solicitar una cotización para:\n`;
        this.items.forEach(p => {
            msg += `▪️ *${p.qty}x* ${p.name} (${p.ref || 'N/A'})\n`;
        });
        previewText.innerText = msg;
    },

    sendToWhatsApp() {
        let msg = `*Hola Distubeq!* 👋\n\nQuisiera solicitar una cotización formal para los siguientes materiales industriales:\n\n`;
        this.items.forEach(p => {
            msg += `▪️ *${p.qty}x* ${p.name}\n   Marca: ${p.ref || 'Estándar'}\n\n`;
        });
        msg += `Quedo a la espera de su confirmación de precios y stock. ¡Gracias!`;
        
        const encoded = encodeURIComponent(msg);
        window.open(`https://wa.me/${this.whatsappNumber}?text=${encoded}`, '_blank');
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => Cart.init());
