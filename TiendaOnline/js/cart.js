/* js/cart.js - Versión Compatible */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Cargando lógica del carrito...");

    // 1. Referencias al HTML (IDs exactos del HTML que te di)
    const cartContainer = document.getElementById('cart-content');
    const totalDisplay = document.getElementById('cart-total-display');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearBtn = document.getElementById('clear-btn');
    const msgDisplay = document.getElementById('checkout-message');
    const cartActions = document.getElementById('cart-actions');

    // 2. Ruta correcta a tu API (Relativa)
    const API_URL = 'api/carrito.php'; 

    // 3. Función para pintar el carrito con IVA
    function renderCart() {
        if (typeof getCart !== 'function') {
            cartContainer.innerHTML = '<p style="color:red">Error: store.js no está cargado.</p>';
            return;
        }

        const cart = getCart();
        
        // Mostrar botones solo si hay cosas
        if (cartActions) {
            cartActions.style.display = cart.length > 0 ? 'block' : 'none';
        }

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Tu carrito está vacío 🛒</p>';
            if(totalDisplay) totalDisplay.textContent = '0.00€';
            return;
        }

        // --- CÁLCULOS MATEMÁTICOS ---
        let subtotal = 0;
        
        // 1. Calculamos la suma de productos
        cart.forEach(item => {
            subtotal += item.precio * (item.quantity || 1);
        });

        // 2. Calculamos el 21% de IVA
        const iva = subtotal * 0.21;

        // 3. Calculamos el Total Final
        const totalFinal = subtotal + iva;


        // --- GENERAMOS EL HTML ---
        let html = `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background: #f8f9fa; text-align: left;">
                        <th style="padding: 10px;">Producto</th>
                        <th style="padding: 10px;">Precio</th>
                        <th style="padding: 10px;">Cant.</th>
                        <th style="padding: 10px;">Total</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Filas de productos
        cart.forEach(item => {
            const totalItem = item.precio * (item.quantity || 1);
            html += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px;">${item.nombre}</td>
                    <td style="padding: 10px;">${item.precio}€</td>
                    <td style="padding: 10px;">${item.quantity || 1}</td>
                    <td style="padding: 10px;">${totalItem.toFixed(2)}€</td>
                </tr>
            `;
        });

        // --- SECCIÓN DE TOTALES CON IVA ---
        html += `
                <tr><td colspan="4" style="height: 20px;"></td></tr>

                <tr style="border-top: 2px solid #ddd;">
                    <td colspan="3" style="text-align: right; padding: 10px; color: #666;">Subtotal:</td>
                    <td style="padding: 10px;">${subtotal.toFixed(2)}€</td>
                </tr>

                <tr>
                    <td colspan="3" style="text-align: right; padding: 10px; color: #666;">IVA (21%):</td>
                    <td style="padding: 10px;">${iva.toFixed(2)}€</td>
                </tr>

                <tr style="background-color: #f1f1f1; font-weight: bold; font-size: 1.2em;">
                    <td colspan="3" style="text-align: right; padding: 15px;">TOTAL A PAGAR:</td>
                    <td style="padding: 15px; color: #e74c3c;">${totalFinal.toFixed(2)}€</td>
                </tr>
            </tbody>
        </table>`;

        cartContainer.innerHTML = html;

        // Actualizamos también el numerito pequeño si existe
        if(totalDisplay) totalDisplay.textContent = totalFinal.toFixed(2) + '€';
    }

    // 4. Función de Checkout (Comprar)
    async function procesarCompra() {
        const cart = getCart();
        const token = localStorage.getItem('authToken');

        if(msgDisplay) {
            msgDisplay.textContent = "Procesando compra...";
            msgDisplay.style.color = "blue";
        }
        checkoutBtn.disabled = true;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                    // 'Authorization': `Bearer ${token}` // Descomentar si tu PHP lo usa
                },
                body: JSON.stringify({ 
                    carrito: cart,
                    token: token 
                })
            });

            const data = await response.json();

            if (data.success || data.status === 'success') {
                // Éxito
                if(msgDisplay) {
                    msgDisplay.textContent = "¡Compra realizada con éxito! 🎉";
                    msgDisplay.style.color = "green";
                }
                localStorage.removeItem('carrito'); // Vaciar LS
                setTimeout(() => { renderCart(); }, 2000); // Repintar vacío
            } else {
                // Error del servidor
                if(msgDisplay) {
                    msgDisplay.textContent = "Error: " + (data.error || data.mensaje);
                    msgDisplay.style.color = "red";
                }
            }

        } catch (error) {
            console.error(error);
            if(msgDisplay) {
                msgDisplay.textContent = "Error de conexión con el servidor.";
                msgDisplay.style.color = "red";
            }
        } finally {
            checkoutBtn.disabled = false;
        }
    }

    // 5. Event Listeners
    if(checkoutBtn) checkoutBtn.addEventListener('click', procesarCompra);
    
    if(clearBtn) {
        clearBtn.addEventListener('click', () => {
            if(confirm('¿Seguro que quieres vaciar el carrito?')) {
                localStorage.removeItem('carrito');
                renderCart();
            }
        });
    }

    // Arrancar
    renderCart();
});