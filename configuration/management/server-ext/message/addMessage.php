<?php

include_once("../bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\MessageThreads;
use App\Models\Messages;


$input = json_decode(file_get_contents("php://input", true), true);

try{
	if(empty($input)){
		throw new Exception('EMPTY_JSON');
	}
	DB::beginTransaction();
	$mtIn = $input['messageThreads'];
	$rawResult =DB::table('mstb_threads')
				->join('mstb_participants','mstb_participants.message_thread_id', '=','mstb_threads.id')
				->select('mstb_participants.id as participant_id','mstb_participants.participant_name as participant_name')
				->where('mstb_participants.participant','=',$mtIn['participant'])
				->where('mstb_threads.id', '=', $mtIn['thread_id'])
				->get();
	$part = $rawResult->toArray();

	$msgOut = Messages::addMessage($mtIn['message'], $mtIn['thread_id'], $part[0]->participant_id, $part[0]->participant_name);
	DB::commit();

	$response = get_response_obj();
	$respObj = ['messageThreads'=>$msgOut];
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
