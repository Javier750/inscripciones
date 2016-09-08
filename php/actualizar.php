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
$sql = "UPDATE $tabla_db1 SET Salutation = '$_persona[salutacion]', FirstName = '$_persona[nombre]', LastName= '$_persona[apellido]', City= '$_persona[lugar]', Phone = '$_persona[telefono]', DocResponsable = '$_persona[docResponsable]', Acreditado = '$_persona[acreditado]' WHERE Documento = '$_persona[documento]'";

$mysqli->set_charset("utf8");
if ($mysqli->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . $conn->error;
}
$mysqli->close();
?>