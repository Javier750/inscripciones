<?php

function cupo ($type) {
	// Abrimos la conexion a la base de datos
	include("abre_conexion.php");

	if($type) {
		// Si se Inscribio
		$_Count = "SELECT DISTINCT Documento FROM $tabla_db1";
	}else {
		// Si Pago
		$_Count = "SELECT Documento FROM $tabla_db2 GROUP BY Documento HAVING SUM(Monto) >= 50";
	}
	$result = mysql_num_rows(mysql_query($_Count));
	// Cerramos la conexion a la base de datos 
	include("cierra_conexion.php"); 

	return $result;

	
}
?>