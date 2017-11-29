<?php
date_default_timezone_set("Asia/Kolkata");
// http://devkinara.perdix.in:8081/management/server-ext/createConversation.php?message_text=test&process_id=12&sub_process_id=34&created_by=35
include_once("../bootload.php");
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use Illuminate\Validation\Rule;

use App\Models\Messaging\Conversation;
use App\Models\Messaging\Message;
use Illuminate\Support\Facades\Validator;

// Get value 
$queryString = $_SERVER['QUERY_STRING'];
//$authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$query = [];
// parse_str($queryString, $query);
$query = json_decode(file_get_contents("php://input", true), true);
//print_r($query);
$response = get_response_obj();

// Validation rules
$rule = [
	'process_id'=>'required',
	'sub_process_id'=>'required',
	'created_by'=>'required',
	'message_text'=>'required'
];

// Custome error message
$customeMessage = [
	'process_id.required' => 'required',
	'sub_process_id.required' => 'required',
	'created_by.required' => 'required',
	'message_text.required' => 'required',
];

$validator = get_validator()->make($query, $rule,$customeMessage);
if ($validator->fails()) {
	$response->setStatusCode(500);
	exit();
}

try {
	// Create model
	$conversation = new Conversation;
	$conversation->process_id = $query['process_id'];
	$conversation->sub_process_id = $query['sub_process_id'];
	$conversation->created_by = $query['created_by'];
	$conversation->created_at = date("Y-m-d H:i:s");
	$conversation->save();

	$message = new Message;
	$message->conversation_id = $conversation->id;
	$message->message_text = $query['message_text'];
	$message->created_by = $query['created_by'];
	$message->created_at = date("Y-m-d H:i:s");
	$message->save();
	$response->setStatusCode(200)->json($conversation->toArray());
} catch(Exception $e) {
	$response->setStatusCode(500);
}
?>