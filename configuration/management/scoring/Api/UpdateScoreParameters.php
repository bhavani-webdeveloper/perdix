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
	$ParamId = $_GET['param_id'];	
	
	include_once('../includes/db.php');
	
	$UpdateParameterSql ="UPDATE sc_parameters 
	SET ParameterDisplayName=:ParameterDisplayName, 
	ParameterType=:ParameterType, 
	ParameterWeightage=:ParameterWeightage, 
	ParameterPassScore=:ParameterPassScore, 
	status=:Status,
	updated_by=:updated_by
	WHERE param_id=:param_id";
	
	try {
		$db = ConnectDb();
		$ExecuteSql = $db->prepare($UpdateParameterSql);
		
		$ExecuteSql->bindParam("ParameterDisplayName",$update->ParameterDisplayName);
		$ExecuteSql->bindParam("ParameterType",$update->ParameterType);
		$ExecuteSql->bindParam("ParameterWeightage",$update->ParameterWeightage);
		$ExecuteSql->bindParam("ParameterPassScore",$update->ParameterPassScore);		
		$ExecuteSql->bindParam("Status",$update->Status);
		$ExecuteSql->bindParam("updated_by",$SessionUserName);
		$ExecuteSql->bindParam("param_id",$ParamId);
		
		$ExecuteSql->execute();
		
		$db = null;
		
		$Response= '{"DataResponse":[ {"Status":"Success", "message":"Updated Score - '.$update->ScoreName.'"}]}';
		echo $Response;
		
	} catch(PDOException $e) {
	    $Response = '{"DataResponse": [ {"Status":"Failure", "message":"'.$e->getMessage().'"}]}';		
		echo $Response;
	}
}
?>