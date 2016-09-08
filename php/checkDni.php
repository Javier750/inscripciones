<?php 
// Abrimos la conexion a la base de datos 
include("abre_conexion.php"); 

$_dni = $_GET["dni"];

$mysqli = new mysqli($hotsdb, $usuariodb, $clavedb, $basededatos);

$sql = "SELECT Documento FROM $tabla_db1 WHERE Documento = $_dni";

if (!$resultado = $mysqli->query($sql)) {
    echo 'falsedddd';
    exit;
}

// ¡Uf, lo conseguimos!. Sabemos que nuestra conexión a MySQL y nuestra consulta
// tuvieron éxito, pero ¿tenemos un resultado?
if ($resultado->num_rows === 0) {
    // ¡Oh, no ha filas! Unas veces es lo previsto, pero otras
    // no. Nosotros decidimos. En este caso, ¿podría haber sido
    // actor_id demasiado grande? 
    http_response_code(404);
    echo 'false';
    exit;
}

if ($resultado->num_rows === 1) {
	http_response_code(200);
 echo 'true';
}

$resultado->free();
$mysqli->close();

?>