<?php 
// Abrimos la conexion a la base de datos 
include("abre_conexion.php"); 

$_dni = $_GET["dni"];
$_check = $_GET["checkExist"];


$_Select = "SELECT * FROM $tabla_db1 WHERE Documento like '$_dni' "; 
if(!$_check) 
{
	if (mysql_num_rows(mysql_query($_Select)) == 0) {
		echo 'true';
	}
	else {
		echo "false";
	}
}
else
{

	if (mysql_num_rows(mysql_query($_Select)) == 0) {
		echo 'false';
	}
	else {
		echo "true";
	}
}

// Cerramos la conexion a la base de datos 
include("cierra_conexion.php"); 

?>