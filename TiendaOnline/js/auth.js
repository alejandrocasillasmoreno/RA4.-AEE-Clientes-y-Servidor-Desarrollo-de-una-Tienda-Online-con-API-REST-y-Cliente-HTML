/* js/auth.js - VERSIÓN CORREGIDA (Sin imports) */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Identificamos el formulario
    const loginForm = document.getElementById('loginForm');
    const messageContainer = document.getElementById('mensaje'); 

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita recargar la página

            // 2. Obtenemos datos del formulario
            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;

            // Limpiamos mensajes anteriores
            if(messageContainer) {
                messageContainer.textContent = 'Verificando...';
                messageContainer.style.color = 'black';
                messageContainer.classList.remove('hidden');
            }

            try {
                // 3. Petición al servidor
                // IMPORTANTE: Asegúrate de que esta ruta es correcta en tu XAMPP
                const response = await fetch('api/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        username: usernameInput, 
                        password: passwordInput 
                    })
                });

                const data = await response.json();

                // 4. Respuesta del servidor
                if (data.success) {
                    // Guardar datos en el navegador
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('tiendaData', JSON.stringify(data.tiendaData));
                    localStorage.setItem('usuarioNombre', data.usuario);

                    // Mensaje de éxito
                    if(messageContainer) {
                        messageContainer.textContent = '¡Correcto! Entrando...';
                        messageContainer.style.color = 'green';
                    }

                    // Redirigir al Dashboard
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);

                } else {
                    // Error de contraseña
                    if(messageContainer) {
                        messageContainer.textContent = data.error || 'Login incorrecto';
                        messageContainer.style.color = 'red';
                    }
                }

            } catch (error) {
                console.error('Error:', error);
                if(messageContainer) {
                    messageContainer.textContent = 'Error de conexión con el servidor (api/login.php).';
                    messageContainer.style.color = 'red';
                }
            }
        });
    }
});