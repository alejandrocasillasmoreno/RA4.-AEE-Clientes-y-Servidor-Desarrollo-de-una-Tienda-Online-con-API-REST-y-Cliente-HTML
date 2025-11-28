<?php
// api/login.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// 1. Recibir datos
$input = json_decode(file_get_contents("php://input"), true);
$userSent = $input['username'] ?? ''; // Tu compañero usa 'username'
$passSent = $input['password'] ?? '';

// 2. Cargar usuarios y tienda
$usuarios = json_decode(file_get_contents("../data/usuarios.json"), true);
$tienda = json_decode(file_get_contents("../data/tienda.json"), true);

$loginExitoso = false;
$nombreUsuario = '';

// 3. Validar credenciales
foreach ($usuarios as $u) {
    if ($u['usuario'] === $userSent && $u['password'] === $passSent) {
        $loginExitoso = true;
        $nombreUsuario = $u['nombre'];
        break;
    }
}

// 4. Responder
if ($loginExitoso) {
    echo json_encode([
        "success" => true,
        "token" => bin2hex(random_bytes(16)), // Generar token
        "usuario" => $nombreUsuario,
        "tiendaData" => $tienda // IMPORTANTE: Enviamos la tienda completa
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => "Usuario o contraseña incorrectos"
    ]);
}
?>