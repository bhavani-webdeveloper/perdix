<?php

include_once("../bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\MessageThreads;
use App\Models\MessageParticipants;
use App\Models\Messages;



$authHeader = $_SERVER['HTTP_AUTHORIZATION'];


try{
	$url = $settings['perdix']['v8_url'] . "/api/account";
	$client = new GuzzleClient();
	$reqResAuth = $client->request('GET', $url, [
		'headers' => [
			'Authorization' => $authHeader
		],
		'connect_timeout' => 3600,
		'timeout' => 3600
	]);


	$responseBody = $reqResAuth->getBody()->getContents();
	$parsedArrUser = \GuzzleHttp\json_decode($responseBody, true);
	$username = $parsedArrUser['login'];

} catch (\Exception $e){
	throw $e;
}

$input = json_decode(file_get_contents("php://input", true), true);

try{
	DB::beginTransaction();
	
	if(empty($input)){
		throw new Exception('EMPTY_JSON');
	}
	$mtOut = MessageThreads::createThread($input, $username);
	$mpOut = MessageParticipants::createParticipant($input, $mtOut['id'], $username);
	foreach($mpOut as $mp){
		if($mp['participant']==$username){
			$userId = $mp['id'];
		}
	}
	$mOut = Messages::addMessage($input['messageThreads']['message'], $mtOut['id'], $userId, $username);
	DB::commit();

	$response = get_response_obj();

	$mtOut['messageParticipants'] = $mpOut;
	$mtOut['message'] = $mOut;

	$respObj = ['messageThreads'=>$mtOut];


	$response->setStatusCode(200)->json($respObj);
} catch (\Exception $e){
	DB::rollback();
	if($e->getMessage()=='EMPTY_JSON'){
		echo "Invalid Input JSON";
	}
	else
	{
		throw $e;
	}
}
