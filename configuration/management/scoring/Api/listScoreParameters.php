<?php

if(isset($_GET))
{
	header("Access-Control-Allow-Headers: Content-Type, accept, Authorization, X-Requested-With"); 
	header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT"); 
	header("Access-Control-Request-Headers: Content-Type, accept"); 
	header("Access-Control-Expose-Headers: X-Total-Count"); 
	header('Content-Type: application/json'); 

	if (!empty($_SERVER['HTTP_ORIGIN'])) { 
        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']); 
	} 

	if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") { 
        die(); 
	}
	
	$ScoreName = $_GET['ScoreName'];
	
	include_once('../includes/db.php');
	
	$getscoressql = "SELECT ParameterName AS 'name', CONCAT_WS('___', param_id, ParameterName) AS 'value'
	FROM sc_parameters
	WHERE ScoreName=:ScoreName
	ORDER BY param_id";
	
	try {
		$db = ConnectDb();
		$ExecuteSql = $db->prepare($getscoressql);
		$ExecuteSql->bindParam("ScoreName",$ScoreName);
		$ExecuteSql->execute();
		
		$SpecificDetails = $ExecuteSql->fetchAll(PDO::FETCH_OBJ);
		
		$db = null;
		echo '{"DataResponse": ' . json_encode($SpecificDetails) . '}';
		
	} catch(PDOException $e) {
	    $Response = '{"DataResponse": [ {"Status":"Failure", "message":"'.$e->getMessage().'"}]}';		
		echo $Response;
	}
}
?>