<script>
    import { enhance } from '$app/forms';
    import ProductTable from '$lib/components/admin/ProductTable.svelte';
    import Modal from '$lib/components/ui/Modal.svelte';
    import ProductForm from '$lib/components/admin/ProductForm.svelte';
    import MaterialForm from '$lib/components/admin/MaterialForm.svelte';
    import DiameterForm from '$lib/components/admin/DiameterForm.svelte';

    let { data } = $props();

    // Modal States
    let showProductModal = $state(false);
    let showMaterialModal = $state(false);
    let showDiameterModal = $state(false);
    
    let selectedProduct = $state(null);

    function openCreateProduct() {
        selectedProduct = null;
        showProductModal = true;
    }

    /** @param {any} product */
    function openEditProduct(product) {
        selectedProduct = product;
        showProductModal = true;
    }

    /** @type {HTMLFormElement | undefined} */
    let statusForm = $state();
    let toggleId = $state(null);
    let toggleCurrentState = $state(null);

    /** @param {any} product */
    function handleToggleStatus(product) {
        toggleId = product.idProducto;
        toggleCurrentState = product.estado;
        // Wait for state to update then submit
        setTimeout(() => {
            if (statusForm) statusForm.requestSubmit();
        }, 0);
    }

    /** @type {HTMLFormElement | undefined} */
    let deleteForm = $state();
    let deleteId = $state(null);

    /** @param {any} product */
    function handleDelete(product) {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            deleteId = product.idProducto;
            setTimeout(() => {
                if (deleteForm) deleteForm.requestSubmit();
            }, 0);
        }
    }
</script>

<div class="space-y-6">
    <!-- Header with Actions -->
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">Gestión de Inventario</h1>
            <p class="text-slate-500 text-sm">Administra tus productos, materiales y medidas.</p>
        </div>
        <div class="flex flex-wrap gap-3">
            <button 
                onclick={() => showMaterialModal = true}
                class="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
                + Material
            </button>
            <button 
                onclick={() => showDiameterModal = true}
                class="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
                + Medida
            </button>
            <button 
                onclick={openCreateProduct}
                class="px-5 py-2 text-sm font-bold text-white bg-[#f97316] rounded-lg shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all transform hover:scale-[1.02]"
            >
                Nuevo Producto
            </button>
        </div>
    </header>

    <!-- Main Table Section -->
    <ProductTable 
        products={data.products} 
        onEdit={openEditProduct}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
    />
</div>

<!-- Hidden form for toggling status -->
<form 
    method="POST" 
    action="?/toggleProductStatus" 
    use:enhance 
    bind:this={statusForm} 
    class="hidden"
>
    <input type="hidden" name="id" value={toggleId} />
    <input type="hidden" name="estado" value={toggleCurrentState} />
</form>

<!-- Hidden form for deleting product -->
<form 
    method="POST" 
    action="?/deleteProduct" 
    use:enhance 
    bind:this={deleteForm} 
    class="hidden"
>
    <input type="hidden" name="id" value={deleteId} />
</form>

<!-- MODALS -->

<!-- Product Modal -->
<Modal bind:show={showProductModal} title={selectedProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'} maxWidth="max-w-xl" closeOnBackdropClick={false}>
    <ProductForm 
        product={selectedProduct} 
        materiales={data.materiales || []} 
        diametros={data.diametros || []}
        onComplete={() => showProductModal = false}
    />
</Modal>

<!-- Material Modal -->
<Modal bind:show={showMaterialModal} title="Administrar Materiales" maxWidth="max-w-md" closeOnBackdropClick={false}>
    <MaterialForm materiales={data.materiales || []} onComplete={() => {}} />
</Modal>

<!-- Diameter Modal -->
<Modal bind:show={showDiameterModal} title="Administrar Diámetros" maxWidth="max-w-md" closeOnBackdropClick={false}>
    <DiameterForm diametros={data.diametros || []} onComplete={() => {}} />
</Modal>
