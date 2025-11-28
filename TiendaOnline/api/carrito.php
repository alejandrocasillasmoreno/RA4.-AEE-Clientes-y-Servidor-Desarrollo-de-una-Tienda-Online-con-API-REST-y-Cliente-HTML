<?php
//  Endpoint de VALIDACIÓN DE PRECIOS

header('Content-Type: application/json');
require_once 'config.php';

// 1. REQUISITO DE SEGURIDAD: Verificar el token
checkToken(); 

$input_data = json_decode(file_get_contents('php://input'), true);
$carrito_cliente = $input_data['carrito'] ?? [];

if (empty($carrito_cliente)) {
    http_response_code(400); 
    echo json_encode(["success" => false, "error" => "Carrito vacío "]);
    exit;
}

// 2. Cargar los precios oficiales del servidor desde tienda.json
$tienda_servidor = loadJsonData('tienda.json');
$productos_oficiales = [];
foreach ($tienda_servidor['productos'] as $p) {
    $productos_oficiales[$p['id']] = $p['precio'];
}

$manipulacion_detectada = false;
$total_oficial = 0;

// 3. Validar cada ítem del carrito
foreach ($carrito_cliente as $item) {
    $item_id = $item['id'];
    $precio_cliente = (float)($item['precio'] ?? 0);
    $cantidad = (int)($item['quantity'] ?? 0);

    // Verificar si el producto existe y si su precio coincide
    if (!isset($productos_oficiales[$item_id]) || 
        abs($precio_cliente - $productos_oficiales[$item_id]) > 0.001) 
    {
        $manipulacion_detectada = true;
        break; 
    }

    $precio_oficial = (float)$productos_oficiales[$item_id];
    $total_oficial += $precio_oficial * $cantidad;
}

// 4. Responder al cliente
if ($manipulacion_detectada) {
    http_response_code(403); // Forbidden
    echo json_encode([
        "success" => false,
        "error" => "Manipulación de precios detectada en el carrito."
    ]);
} else {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "¡Pedido realizado con éxito y precios validados!",
        "total_validado" => number_format($total_oficial, 2, '.', '')
    ]);
}
?>