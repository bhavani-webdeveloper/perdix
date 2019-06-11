<?php
echo "Inside danger.php\n";

function fnPost(){
	//Get request JSON message
	$requestData = json_decode(file_get_contents('php://input'));
	echo "Request message: ".json_encode($requestData);
	/*
	If(isNull($requestData)){
		echo "Invalid request message.";
		return;
	}
	//Get patch id from request
	$patchID = fnGetDataPatchID($requestData);
	echo "\nReport ID : $patchID";

	//Read locally stored json content from the json file
	$localJSONData = json_decode(file_get_contents("json/data_patch.json"));
	echo "\n";

	$sql = fnGetPatchSql($localJSONData, $patchID);
	echo "\n".$sql."\n";

	If(isNull($sql)){
		echo "Unable to find patch sql.";
		return;
	}

	//Replace bind variables with sql from request value
	$sql = fnReplaceBindVariables($requestData, $sql);
	echo "\nFinal Sql to be executed: \n";
	echo $sql;

	//fnApplyPatch($sql);
	//fnLogAditData($sql, $requestData->user);
	*/
}

function fnReplaceBindVariables($requestData, $sql){
	$sql1 = $sql;
	foreach($requestData->input_parameters as $input_data){
		$sql1 = str_replace("##".$input_data->name."#", $input_data->value, $sql1);
	}
	return $sql1;
}

function fnGetDataPatchID($data){
	$patchID = $data->id;
	return $patchID;
}

function fnGetPatchSql($data, $patchID){
	$sql;
	foreach($data->data_patch as $patch_data){
		if($patch_data->id === $patchID){
			$sql = $patch_data->patch_sql;
			break;
		}
	}
	return $sql;	
}

function isNull($data){
	if($data === null Or $data === ''){
		return true;
	}else{
		return false;
	}

}

function fnLogAditData($sql, $user){
	echo "\n".$user;
	echo "\n".$sql;
}

If($_SERVER['REQUEST_METHOD'] === 'POST'){
	echo "User submitted the data - POST\n";
	fnPost();
}
?>