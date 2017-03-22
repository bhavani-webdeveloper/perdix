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
	$rawResult =DB::table('mstb_threads')
				->join('mstb_messages','mstb_messages.message_thread_id', '=','mstb_threads.id')
				->join('mstb_participants',function($join){
					$join->on('mstb_participants.message_thread_id','=','mstb_threads.id');
					$join->on('mstb_participants.id','=','mstb_messages.participant_id');
				})
				->select(/*'mstb_threads.id','mstb_threads.title',*/'mstb_messages.message','mstb_messages.created_at','mstb_participants.participant')
				->where('mstb_threads.id','=',$query['thread_id'])
				->orderBy('mstb_messages.id','desc')
				->get();

	$response = get_response_obj();
	$conv['conversations'] = $rawResult->toArray();
	$response->setStatusCode(200)->json($conv);

} catch (\Exception $e){
	throw $e;
}