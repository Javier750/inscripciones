<?php
include("abre_conexion.php"); 

$_dni = $_GET["dni"];
$_pay = $_GET["pago"];
$_date = date("Y-m-d", strtotime($_GET["fecha"]));


$_Insert = "INSERT INTO $tabla_db2 (Documento,Monto,FechaPago)
				VALUES ('$_dni','$_pay', '$_date')"; 

mysql_query($_Insert);

include("cierra_conexion.php"); 

?>