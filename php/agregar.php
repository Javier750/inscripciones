<?php

include("abre_conexion.php"); 

$_persona = json_decode(file_get_contents('php://input'), TRUE);

$mysqli = new mysqli($hotsdb, $usuariodb, $clavedb, $basededatos);

// ¡Oh, no! Existe un error 'connect_errno', fallando así el intento de conexión
if ($mysqli->connect_errno) {
    // La conexión falló. ¿Que vamos a hacer? 
    // Se podría contactar con uno mismo (¿email?), registrar el error, mostrar una bonita página, etc.
    // No se debe revelar información delicada

    // Probemos esto:
    echo json_encode(array());
    exit;
}
// Realizar una consulta SQL
$sql = "INSERT INTO $tabla_db1 (Documento, Salutation, FirstName, LastName, City, Street, Created, Acreditado, Church) VALUES ('$_persona[documento]', '$_persona[salutacion]', '$_persona[nombre]', '$_persona[apellido]', '$_persona[lugar]', '$_persona[iglesia]', CURRENT_TIMESTAMP, '$_persona[acreditado]', '$_persona[abono]')";

$mysqli->set_charset("utf8");
if ($mysqli->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . $mysqli->error;
}
$mysqli->close();
?>