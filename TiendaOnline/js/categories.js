document.addEventListener('DOMContentLoaded', () => {
    // Seguridad y Header
    if (!localStorage.getItem('authToken')) { window.location.href = 'login.html'; return; }
    
    // Logout
    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.clear(); window.location.href = 'login.html';
    });

    const tiendaData = JSON.parse(localStorage.getItem('tiendaData'));
    if(tiendaData) {
        renderCategoryButtons(tiendaData.categorias);
        renderProducts(tiendaData.productos); // Por defecto mostrar todos
    }
});

function renderCategoryButtons(categorias) {
    const container = document.getElementById('categoryButtons');
    container.innerHTML = '';

    categorias.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn'; // Clase CSS de tu compañero
        btn.textContent = cat.nombre;
        btn.onclick = () => filterByCategory(cat.id);
        container.appendChild(btn);
    });
}

function filterByCategory(catId) {
    const tiendaData = JSON.parse(localStorage.getItem('tiendaData'));
    const filtrados = tiendaData.productos.filter(p => p.id_categoria === catId);
    renderProducts(filtrados);
}

function renderProducts(productos) {
    const grid = document.getElementById('productosGrid');
    grid.innerHTML = '';
    
    if(productos.length === 0) {
        grid.innerHTML = '<p>No hay productos en esta categoría.</p>';
        return;
    }

    productos.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${prod.img}">
            <div class="product-info">
                <h4>${prod.nombre}</h4>
                <p>${prod.precio}€</p>
                <button class="btn btn-primary" onclick="window.location.href='product.html?id=${prod.id}'">Ver</button>
            </div>
        `;
        grid.appendChild(div);
    });
}