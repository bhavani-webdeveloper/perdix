<?php
// 
$jsp_form_link = "http://34.232.182.192:8080/forms/";
$folder_path = "/opt/mount_point/application/nginx/management/forms/temp-forms/temp/";

mysqli_report(MYSQLI_REPORT_STRICT); // Traps all mysqli error

define('DB_HOST', 'localhost');
define('DB_USER', 'finPer113');
define('DB_PASSWORD', '113#7haramani');

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
