<?php

if(isset($_POST))
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
	
	$ReceivedJson = json_decode(file_get_contents("php://input"));
	
	$update = $ReceivedJson[0];
	
	$SessionUserName = "admin";
	$ScoreName = $_GET['ScoreName'];	
	
	include_once('../includes/db.php');
	
	$UpdateScoreSql ="UPDATE sc_master 
	SET OverallPassValue=:OverallPassValue, 
	MaxScoreValue=:MaxScoreValue, 
	Status=:Status, 
	updated_by=:updated_by
	WHERE ScoreName=:ScoreName";
	
	try {
		$db = ConnectDb();
		$ExecuteSql = $db->prepare($UpdateScoreSql);
		
		$ExecuteSql->bindParam("OverallPassValue",$update->OverallPassValue);
		$ExecuteSql->bindParam("MaxScoreValue",$update->MaxScoreValue);
		$ExecuteSql->bindParam("Status",$update->Status);
		$ExecuteSql->bindParam("updated_by",$SessionUserName);
		$ExecuteSql->bindParam("ScoreName",$ScoreName);
		
		$ExecuteSql->execute();
		
		$db = null;
		
		$Response= '{"DataResponse":[ {"Status":"Success", "message":"Updated Score - '.$ScoreName.'"}]}';
		echo $Response;
		
	} catch(PDOException $e) {
	    $Response = '{"DataResponse": [ {"Status":"Failure", "message":"'.$e->getMessage().'"}]}';		
		echo $Response;
	}
}
?>