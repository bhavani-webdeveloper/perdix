<?php
// http://devkinara.perdix.in:8081/management/server-ext/getConversation.php?process_id=1&sub_process_id=2
include_once("../bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use Illuminate\Validation\Rule;
use App\Models\Messaging\Conversation;
use App\Models\Messaging\Message;

// Get value 
$queryString = $_SERVER['QUERY_STRING'];
// $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$query = [];
parse_str($queryString, $query);

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

$conversation = array();
// Fetching the messaging details depends on the conversation ID
$conversationMessage = DB::table('ms_conversation')->join('ms_message', 'ms_message.conversation_id', '=', 'ms_conversation.id')->select('ms_conversation.sub_process_id')->where([['process_id', '=', $query['process_id']]])->whereNull('reply_reference_id')->groupBy('sub_process_id')->get();

$details = $conversationMessage->toArray();

// Response
$response = get_response_obj();
$response->setStatusCode(200)->json($details);
?>

