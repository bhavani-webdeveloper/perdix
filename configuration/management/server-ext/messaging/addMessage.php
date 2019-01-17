<?php
date_default_timezone_set("Asia/Kolkata");
// http://devkinara.perdix.in:8081/management/server-ext/addMessage.php?conversation_id=1&message_text=dsfjaslkdfsdalkfjsald&created_by=1
include_once("../bootload.php");
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use Illuminate\Validation\Rule;
use App\Models\Messaging\Conversation;
use App\Models\Messaging\Message;

// Get value 
$queryString = $_SERVER['QUERY_STRING'];
// $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$query = [];
// parse_str($queryString, $query);
$query = json_decode(file_get_contents("php://input", true), true);
$response = get_response_obj();

// Validation rules
$rule = [
	'conversation_id'=>'required',
	'message_text'=>'required',
	'created_by'=>'required'
];

$validator = get_validator()->make($query, $rule);
if ($validator->fails()) {
	$response->setStatusCode(500)->json(json_decode($validator->errors(), true));
	exit();
}

// Fetching count using conversation id
if(isset($query['reply_reference_id']) && $query['reply_reference_id']!='') {
	$conversationCount = DB::table("ms_conversation")->join("ms_message", "ms_message.conversation_id", "ms_conversation.id")->where([["ms_conversation.id", "=", $query['conversation_id']], ["ms_message.id", "=", $query['reply_reference_id']]])->whereNull('ms_message.reply_reference_id')->count();
} else {
	$conversationCount = DB::table("ms_conversation")->join("ms_message", "ms_message.conversation_id", "ms_conversation.id")->where("ms_conversation.id", $query['conversation_id'])->count();
}

if(!$conversationCount) {
	$response->setStatusCode(500);
	exit();
}

// Create model
try {
	$message = new Message;
	$message->conversation_id = $query['conversation_id'];
	if(isset($query['reply_reference_id']) && $query['reply_reference_id']!='') 
		$message->reply_reference_id = $query['reply_reference_id'];
	$message->message_text = $query['message_text'];
	$message->created_by = $query['created_by'];
	$message->created_at = date("Y-m-d H:i:s");
	$message->save();
	$response->setStatusCode(200)->json($message->toArray());
	
} catch(Exception $e) {
	//echo $e->getMessage();
	$response->setStatusCode(500);
}
?>

