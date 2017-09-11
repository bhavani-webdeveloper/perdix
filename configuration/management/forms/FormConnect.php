<?php
mysqli_report(MYSQLI_REPORT_STRICT); // Traps all mysqli error

define('DB_HOST', 'localhost');
define('DB_USER', 'financialForms');
define('DB_PASSWORD', 'financialForms');

try{
	try{
		$connection = new mysqli(DB_HOST, DB_USER, DB_PASSWORD);
		
	}catch(mysqli_sql_exception $e){
		throw $e;
	}
}catch (Exception $e) {
	echo $e->getMessage();
}
?>
