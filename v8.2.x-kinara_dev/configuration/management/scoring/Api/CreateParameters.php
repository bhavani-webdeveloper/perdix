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
	
	$ReceivedJson = json_decode(file_get_contents("php://input"), true);
	$CreateResponse = $ReceivedJson[0];
	$SessionUserName = "admin";
	
	include_once('../includes/db.php');
	
	$CreateParameters = "INSERT INTO sc_parameters (ScoreName, ParameterName, ParameterDisplayName,  ParameterType, ParameterWeightage, ParameterPassScore, status, created_by, created_at, updated_by) VALUES 
	( '".join($CreateResponse['Parameter'], "','")."',  
	'".$SessionUserName."', 
	'".date("Y-m-d H:i:s")."', 
	'".$SessionUserName."')";	
	
	try {
		$db = ConnectDb();
		$ExecuteSql = $db->prepare($CreateParameters);
		
		$ExecuteSql->execute();
		
		$db = null;
		
		$Response= '{"DataResponse":[ {"Status":"Success", "message":"Created Parameters"}]}';
		echo $Response;
		
	} catch(PDOException $e) {
	    $Response = '{"DataResponse": [ {"Status":"Failure", "message":"'.$e->getMessage().'"}]}';		
		echo $Response;
	}
}
?>