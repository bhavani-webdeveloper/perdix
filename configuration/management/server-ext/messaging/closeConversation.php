<?php
date_default_timezone_set("Asia/Kolkata");
// http://devkinara.perdix.in:8081/management/server-ext/closeConversation.php?process_id=12&sub_process_id=34
include_once("../bootload.php");
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use Illuminate\Validation\Rule;

use App\Models\Messaging\Conversation;
use App\Models\Messaging\Message;

// Get value 
$queryString = $_SERVER['QUERY_STRING'];
//$authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$query = [];
parse_str($queryString, $query);
//print_r($query);
$response = get_response_obj();

// Validation rules
$rule = [
	'process_id'=>'required'
];

// Custome error message
$customeMessage = [
	'process_id.required' => 'required'
];

$validator = get_validator()->make($query, $rule,$customeMessage);
if ($validator->fails()) {
	$response->setStatusCode(500);
	exit();
}

try {
	// Create model
	// $conversation = Conversation::where([['process_id', '=', $query['process_id']], ['sub_process_id', '=', $query['sub_process_id']]])->first();
	$conversation = Conversation::where('process_id', '=', $query['process_id'])->whereNull("closed_at")->count();
	if($conversation) {
		DB::table('ms_conversation')->where('process_id', $query['process_id'])->whereNull("closed_at")->update(['closed_at' => date('Y-m-d H:i:s')]);
		$response->setStatusCode(200)->json($conversation->toArray());
		exit();
	}
} catch(Exception $e) {
	echo $e->getMessage();
}
$response->setStatusCode(500);
?>