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
	$ValueID = $_GET['Id'];	
	
	include_once('../includes/db.php');
	
	$UpdateValuesSql ="UPDATE sc_values 
	SET CategoryValueFrom=:CategoryValueFrom, 
	CategoryValueTo=:CategoryValueTo, 
	Value=:Value, 
	status=:status, 
	updated_by=:updated_by
	WHERE Id=:Id";
	
	try {
		$db = ConnectDb();
		$ExecuteSql = $db->prepare($UpdateValuesSql);
		
		$ExecuteSql->bindParam("CategoryValueFrom",$update->CategoryValueFrom);
		$ExecuteSql->bindParam("CategoryValueTo",$update->CategoryValueTo);
		$ExecuteSql->bindParam("Value",$update->Value);
		$ExecuteSql->bindParam("status",$update->Status);
		$ExecuteSql->bindParam("updated_by",$SessionUserName);
		$ExecuteSql->bindParam("Id",$ValueID);
		
		$ExecuteSql->execute();
		
		$db = null;
		
		$Response= '{"DataResponse":[ {"Status":"Success", "message":"Updated Score - '.$update->ParameterName.'"}]}';
		echo $Response;
		
	} catch(PDOException $e) {
	    $Response = '{"DataResponse": [ {"Status":"Failure", "message":"'.$e->getMessage().'"}]}';		
		echo $Response;
	}
}
?>