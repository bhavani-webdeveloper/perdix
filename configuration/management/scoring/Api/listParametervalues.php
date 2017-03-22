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
	
	include_once('../includes/db.php');
	
	$GetSpecificsql = "(SELECT Id, ScoreName, ParameterName, CategoryValueFrom, CategoryValueTo, Value, status  
	FROM sc_values
	ORDER BY Id)";
	try {
		$db = ConnectDb();
		$SpecificScoreDetails = $db->query($GetSpecificsql);
		$SpecificScoreDetails->execute();
		
		$SpecificDetails = $SpecificScoreDetails->fetchAll(PDO::FETCH_OBJ);
		
		$db = null;
		echo '{"DataResponse": ' . json_encode($SpecificDetails) . '}';
	} catch(PDOException $e) {
		echo '{"DataResponse": [ {"Status":"Failure", "message":"'.$e->getMessage().'"}]}';	
	}
}
?>