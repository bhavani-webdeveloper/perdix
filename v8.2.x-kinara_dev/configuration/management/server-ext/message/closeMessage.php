<?php

include_once("../bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\MessageThreads;
use App\Models\MessageParticipants;
use App\Models\Messages;


$queryString = $_SERVER['QUERY_STRING'];
$query = [];
parse_str($queryString, $query);

try{
	$result =DB::select("select count(1) cnt from mstb_threads mt
		where mt.id = ? and mt.created_by = ? and is_closed=false",array($query['thread_id'], $query['user_id']));

	if($result[0]->cnt==0){
		throw new Exception('INVALID_USER');
	}

	DB::beginTransaction();
	$msgStatus = Messages::archiveMessages($query['thread_id']);
	$msgStatus = MessageParticipants::archiveParticipant($query['thread_id']);
	$msgStatus = MessageThreads::archiveMessageThread($query['thread_id']);
	DB::commit();

	header("Access-Control-Expose-Headers: close-message-status");
	get_response_obj()->json([], ['close-message-status' => true]);

} catch (\Exception $e){
	DB::rollback();
	if($e->getMessage()=='INVALID_USER'){
		echo "Only creator of the thread can close it.";
	}
	else {
		throw $e;
	}
}
