<?php
function ConnectDb() {
	/*$dbhost="10.60.40.114";
	$dbuser="financialForms";
	$dbpass="senseidb@123";
	
	$framework_db="framework";	*/
	
	$dbhost="52.202.57.36";
	$dbuser="user1";
	$dbpass="root@123";
	$framework_db="financialForms";	
	
	$dbConnection = new PDO("mysql:host=$dbhost;dbname=$framework_db", $dbuser, $dbpass);	
	$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbConnection;
}

function ConnectUAT() {	
	$dbhost="52.202.57.36";
	$dbuser="user1";
	$dbpass="root@123";
	
	$framework_db="financialForms";	
	
	$dbConnection = new PDO("mysql:host=$dbhost;dbname=$framework_db", $dbuser, $dbpass);	
	$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbConnection;
}
function ConnectFormDb() {
	/*$dbhost="10.60.40.114";
	$dbuser="financialForms";
	$dbpass="senseidb@123";
	
	$framework_db="framework";	*/
	
	$dbhost="kinarasit.perdix.co.in";
	// $dbuser="user1";
	// $dbpass="root@123";
	$dbuser="financialForms";
	$dbpass="financialForms";
	
	$framework_db="forms_management_p2uat";	
	
	$dbConnection = new PDO("mysql:host=$dbhost;dbname=$framework_db", $dbuser, $dbpass);	
	$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbConnection;
}
?>