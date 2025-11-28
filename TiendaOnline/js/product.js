document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener ID de la URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        window.location.href = 'dashboard.html';
        return;
    }

    // 2. Seguridad: Verificar si store.js se cargó bien
    if (typeof getProductById !== 'function') {
        console.error("Error: store.js no está cargado.");
        return;
    }

    // 3. Buscar el producto usando la función de store.js
    const producto = getProductById(productId);

    if (producto) {
        // --- AQUÍ ESTABA EL ERROR ---
        // Antes ponía: renderProduct(producto);
        // Ahora ponemos el nombre correcto en español:
        renderizarProducto(producto);
        
        // Registrar visto si la función existe
        if (typeof addVisto === 'function') {
            addVisto(producto);
        }
    } else {
        document.getElementById('product-detail').innerHTML = '<h2>Producto no encontrado</h2>';
    }
});

function renderizarProducto(prod) {
    const container = document.getElementById('product-detail');
    if (!container) return;

    // Usamos prod.img o prod.imagen (parche de compatibilidad)
    const imgUrl = prod.img || prod.imagen || 'assets/img/no-image.jpg';

    container.innerHTML = `
        <div style="display: flex; gap: 40px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px;">
                <img src="${imgUrl}" alt="${prod.nombre}" style="width: 100%; max-width: 400px; border-radius: 10px; object-fit: cover;">
            </div>
            <div style="flex: 1; min-width: 300px;">
                <h1 style="font-size: 2rem; margin-bottom: 10px;">${prod.nombre}</h1>
                <p style="color: #666; margin-bottom: 20px;">${prod.descripcion || 'Sin descripción'}</p>
                <div class="price" style="font-size: 2rem; color: #e74c3c; font-weight: bold; margin-bottom: 20px;">
                    ${prod.precio}€
                </div>
                
                <button class="btn btn-primary" onclick="tryAddToCart(${prod.id})" style="padding: 15px 30px; font-size: 1.1rem; cursor: pointer;">
                    Añadir al Carrito
                </button>
            </div>
        </div>
    `;
}

// === EL PUENTE MÁGICO (GLOBAL) ===
window.tryAddToCart = function(id) {
    if (typeof addToCart === 'function') {
        addToCart(id); 
    } else {
        alert("Error: No se puede añadir al carrito.");
    }
};