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
	
	include_once('../includes/db.php');
	
	$ReceivedJson = json_decode(file_get_contents("php://input"));
	
	$update = $ReceivedJson[0];
	
	$SessionUserName = "admin";
	
	$ScoreCreateSql = "INSERT INTO sc_master 
	(ScoreName, OverallPassValue, MaxScoreValue, Status, created_by, created_at, updated_by) 
	VALUES (:ScoreName, :OverallPassValue, :MaxScoreValue, :Status, :created_by, :created_at, :updated_by)";
	try {
		$db = ConnectDb();
		$createScore = $db->prepare($ScoreCreateSql);  
		$createScore->bindParam("ScoreName", $update->ScoreName);
		$createScore->bindParam("OverallPassValue", $update->OverallPassValue);
		$createScore->bindParam("MaxScoreValue", $update->MaxScoreValue);
		$createScore->bindParam("Status", $update->Status);
		$createScore->bindParam("created_by", $SessionUserName);
		
		$updatetime = date('Y-m-d H:i:s');
		
		$createScore->bindParam("created_at", $updatetime);
		$createScore->bindParam("updated_by", $SessionUserName);
		
		$createScore->execute();
		
		$Response = '{"DataResponse": [{"Status":"Success", "message":"Created Score"}]}';
		
		echo $Response;
		
	} catch(PDOException $e) {		
		$Response = '{"DataResponse": [ {"Status":"Failure", "message":"'.$e->getMessage().'"}]}';		
		echo $Response;
	}
}
?>