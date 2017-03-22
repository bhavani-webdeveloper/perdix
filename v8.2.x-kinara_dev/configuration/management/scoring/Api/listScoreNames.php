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
	
	$getscoressql = "SELECT ScoreName AS 'name', ScoreName AS 'value'
	FROM sc_master 
	ORDER BY score_id";
	
	try {
		$db = ConnectDb();
		$ExecuteSql = $db->query($getscoressql);  
		$ListScores = $ExecuteSql->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		
		$Response= '{"DataResponse":'.json_encode($ListScores, JSON_NUMERIC_CHECK).'}';
		echo $Response;
		
	} catch(PDOException $e) {
	    $Response = '{"DataResponse": [ {"Status":"Failure", "message":"'.$e->getMessage().'"}]}';		
		echo $Response;
	}
}
?>