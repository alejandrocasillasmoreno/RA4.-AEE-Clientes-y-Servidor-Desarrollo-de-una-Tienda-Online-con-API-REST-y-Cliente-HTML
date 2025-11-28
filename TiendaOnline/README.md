# Tienda Online (Proyecto RA4)

Tienda online SPA desarrollada con HTML, CSS, JS y PHP.

## Instalación
1. Copiar la carpeta del proyecto en htdocs (XAMPP).
2. Abrir login.html en el navegador.
3. Usuario de prueba: admin / 123.

## Principios SOLID Aplicados
- **SRP (Responsabilidad Única):** El código JavaScript está dividido en módulos según su función (auth.js para login, store.js para datos, cart.js para el carrito).
- **OCP (Abierto/Cerrado):** Se pueden añadir nuevos productos editando el archivo tienda.json sin necesidad de modificar el código fuente del frontend.
- **ISP (Segregación de Interfaces):** La API del servidor está dividida en endpoints específicos (login.php, carrito.php) que no obligan al cliente a enviar datos innecesarios.