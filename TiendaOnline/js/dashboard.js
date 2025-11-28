document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar Seguridad
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Configurar Usuario y Logout
    const userNameDisplay = document.getElementById('userName');
    if (userNameDisplay) userNameDisplay.textContent = localStorage.getItem('usuarioNombre') || 'Usuario';
    
    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // Actualizar badge del carrito
    const cart = JSON.parse(localStorage.getItem('carrito')) || [];
    const badge = document.getElementById('cartBadge');
    if(badge) {
        badge.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
        badge.classList.remove('hidden');
    }

    // 3. Cargar Productos Destacados
    cargarDestacados();
});

function cargarDestacados() {
    const tiendaData = JSON.parse(localStorage.getItem('tiendaData'));
    const contenedor = document.getElementById('productosDestacados');

    if (!tiendaData || !tiendaData.productos) return;

    // Filtramos donde destacado == true
    const destacados = tiendaData.productos.filter(p => p.destacado === true);

    contenedor.innerHTML = '';
    destacados.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${prod.img}" alt="${prod.nombre}">
            <div class="product-info">
                <h3>${prod.nombre}</h3>
                <p class="price">${prod.precio}€</p>
                <button class="btn btn-primary" onclick="window.location.href='product.html?id=${prod.id}'">Ver Detalle</button>
            </div>
        `;
        contenedor.appendChild(div);
    });
}