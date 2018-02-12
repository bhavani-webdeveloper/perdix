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
	$result =DB::select("update mstb_participants set is_read=true, last_read_at=now() where message_thread_id = ? and participant=?",array($query['thread_id'], $query['user_id']));

	header("Access-Control-Expose-Headers: message-read");
	get_response_obj()->json([], ['message-read' => true]);

} catch (\Exception $e){
	DB::rollback();
	throw $e;
}
