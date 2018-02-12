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
	
	$CreateParameters = "INSERT INTO sc_values (Param_id, ParameterName, ScoreName, CategoryValueFrom, CategoryValueTo, Value, status, created_by, created_at, updated_by) VALUES";
	
	$required_array = array("ScoreName"=>"", "CategoryValueFrom"=>"", "CategoryValueTo"=>"", "Value"=>"", "Status"=>"");
	
	$InsertValues = "";
	
	$split_params = explode("___",$CreateResponse['Parameter']['ParameterName']);
	unset($CreateResponse['Parameter']['ParameterName']);
	
	foreach($CreateResponse['Parameter'] AS $key_val=>$Parameters)
	{
		if(array_key_exists($key_val, $required_array))
		$required_array[$key_val] = $Parameters;
	}
	
	$CreateParameters .= "( '".$split_params[0]."', '".$split_params[1]."', '".join("','", $required_array)."', '".$SessionUserName."', '".date("Y-m-d H:i:s")."', '".$SessionUserName."')";
	
	try {
		$db = ConnectDb();
		$ExecuteSql = $db->prepare($CreateParameters);
		
		$ExecuteSql->execute();
		
		$db = null;
		
		$Response= '{"DataResponse":[ {"Status":"Success", "message":"Created Parameter Values"}]}';
		echo $Response;
		
	} catch(PDOException $e) {
	    $Response = '{"DataResponse": [ {"Status":"Failure", "message":"'.$e->getMessage().'"}]}';		
		echo $Response;
	}
}
?>