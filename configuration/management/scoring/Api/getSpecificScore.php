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
	
	$SessionUserName = "admin";
	$ScoreId = $_GET['score_id'];
	
	include_once('../includes/db.php');
	
	$GetSpecificsql = "(SELECT score_id AS ScoreId, ScoreName, OverallPassValue, MaxScoreValue, Status 
	FROM sc_master 
	WHERE score_id=:score_id
	ORDER BY score_id)";
	try {
		$db = ConnectDb();
		$SpecificScoreDetails = $db->prepare($GetSpecificsql);  
		$SpecificScoreDetails->bindparam("score_id",$ScoreId);
		$SpecificScoreDetails->execute();
		
		$SpecificDetails = $SpecificScoreDetails->fetchAll(PDO::FETCH_OBJ);
		
		$db = null;
		echo '{"ScoreList": ' . json_encode($SpecificDetails) . '}';
	} catch(PDOException $e) {
	    //error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}
?>