<?php

include_once("../bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\MessageThreads;
use App\Models\MessageParticipants;
use App\Models\Messages;


$input = json_decode(file_get_contents("php://input", true), true);

try{
	if(empty($input)){
		throw new Exception('EMPTY_JSON');
	}
	DB::beginTransaction();
	$mpOut = [];
	$mtIn = $input['messageThreads'];
	foreach ($input['messageThreads']['messageParticipants'] as $messageParticipants) {
		$partOut = MessageParticipants::addParticipant($mtIn['thread_id'], $messageParticipants['participant'], $messageParticipants['participantName']);
		$mpOut[]=$partOut->toArray();
	}
	DB::commit();

	$response = get_response_obj();

	$mtOut['thread_id']=$mtIn['thread_id'];
	$mtOut['messageParticipants'] = $mpOut;
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
