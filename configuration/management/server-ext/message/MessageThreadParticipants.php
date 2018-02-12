<?php

include_once("../bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\MessageThreads;
use App\Models\MessageParticipants;


$queryString = $_SERVER['QUERY_STRING'];
$query = [];
parse_str($queryString, $query);

try{
	$rawResult =DB::table('mstb_threads')
				->join('mstb_participants','mstb_participants.message_thread_id', '=','mstb_threads.id')
				->select('mstb_participants.id','mstb_participants.participant','mstb_participants.participant_name', 'mstb_participants.last_read_at')
				->where('mstb_threads.id','=',$query['thread_id'])
				->orderBy('mstb_participants.id','desc')
				->get();

	$response = get_response_obj();
	$conv['participants'] = $rawResult->toArray();
	$response->setStatusCode(200)->json($conv);

} catch (\Exception $e){
	throw $e;
}