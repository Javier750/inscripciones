<?php
include("abre_conexion.php"); 

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
$sql = "SELECT Documento, Salutation, FirstName, LastName, City, Phone, DocResponsable, Acreditado 			 
			 FROM $tabla_db1";
$mysqli->set_charset("utf8");
if (!$resultado = $mysqli->query($sql)) {
    // ¡Oh, no! La consulta falló. 
    print json_encode('error2');
    echo "ERROR2";

    exit;
}

// ¡Uf, lo conseguimos!. Sabemos que nuestra conexión a MySQL y nuestra consulta
// tuvieron éxito, pero ¿tenemos un resultado?
if ($resultado->num_rows === 0) {
    // ¡Oh, no ha filas! Unas veces es lo previsto, pero otras
    // no. Nosotros decidimos. En este caso, ¿podría haber sido
    // actor_id demasiado grande? 
    print json_encode('error3');
    echo "ERROR3";
    exit;
}

while ($row = $resultado->fetch_assoc()) {
   $inspector[] = $row;
}
echo json_encode($inspector);

// El script automáticamente liberará el resultado y cerrará la conexión
// a MySQL cuando finalice, aunque aquí lo vamos a hacer nostros mismos
$resultado->free();
$mysqli->close();
?>