
const CART_KEY = 'carrito';
const TIENDA_KEY = 'tiendaData';
const VISTOS_KEY = 'productosVistos';
const MAX_VISTOS = 5;

// === 1. Funciones de Datos de la Tienda ===
function getTiendaData() {
    const dataString = localStorage.getItem(TIENDA_KEY);
    return dataString ? JSON.parse(dataString) : null;
}

function getProductById(productId) { 
    const tiendaData = getTiendaData();
    const idNum = parseInt(productId);
    if (tiendaData && tiendaData.productos && !isNaN(idNum)) { 
        // Busca el producto en los datos de la tienda
        return tiendaData.productos.find(p => p.id === idNum);
    }
    return null;
}

// === 2. Funciones de Carrito (incluye addToCart, que faltaba en categories.js) ===
function getCart() {
    const cartData = localStorage.getItem(CART_KEY);
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount(count) {
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        cartBadge.textContent = count;
    }
}

function addToCart(productId) {
    const productToAdd = getProductById(productId);
    if (!productToAdd) {
        alert('Producto no encontrado');
        return;
    }
    // Lógica para añadir al carrito...
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId); 
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productToAdd.id, nombre: productToAdd.nombre, precio: productToAdd.precio, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    alert(`Producto "${productToAdd.nombre}" añadido al carrito.`);
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartCount(0);
}

// === 3. Funciones de Vistos Recientemente===
function getVistos() {
    const vistosData = localStorage.getItem(VISTOS_KEY);
    return vistosData ? JSON.parse(vistosData) : [];
}

function addVisto(product) {
    let vistos = getVistos();
    vistos = vistos.filter(v => v.id !== product.id); 

    vistos.unshift({ id: product.id, nombre: product.nombre, imagen: product.imagen });

    if (vistos.length > MAX_VISTOS) {
        vistos = vistos.slice(0, MAX_VISTOS);
    }

    localStorage.setItem(VISTOS_KEY, JSON.stringify(vistos));
}

// Inicializar el contador del carrito
window.addEventListener('DOMContentLoaded', () => {
    updateCartCount(getCart().reduce((total, item) => total + item.quantity, 0));
});