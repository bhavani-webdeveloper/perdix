<?php
// http://devkinara.perdix.in:8081/management/server-ext/getConversation.php?process_id=1&sub_process_id=2
include_once("../bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use Illuminate\Validation\Rule;
use App\Models\Messaging\Conversation;
use App\Models\Messaging\Message;

// Response
$response = get_response_obj();

// Get value 
$queryString = $_SERVER['QUERY_STRING'];
// $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$query = [];
parse_str($queryString, $query);

// Get DB names from env file
$bi_db = $settings['bi_db']['database'];
$db = $settings['db']['database'];

// Validation rules
$rule = [
	'replied'=>'required'
];

// Custome error message
$customeMessage = [
	'replied.required' => 'required'
];

$validator = get_validator()->make($query, $rule,$customeMessage);
if ($validator->fails()) {
	$response->setStatusCode(500);
	exit();
}

try {
	// Fetching the messaging details depends on the conversation ID
	$havingCondition = ($query['replied']=='true') ? "(SELECT count(conversation_id) FROM $db.ms_message WHERE conversation_id = mm.conversation_id) > 1" : "(SELECT count(conversation_id) FROM $db.ms_message WHERE conversation_id = mm.conversation_id) = 1";
	$conversationMessage =  DB::table("$db.ms_conversation as mc")
	->join("$db.ms_message as mm", "mm.conversation_id", "=", "mc.id")
	->where("mc.process_type", "=", "LOAN")
	->whereNull('mc.closed_at')
	->groupBy("conversation_id")
	->havingRaw($havingCondition)
	->get();

	$response->setStatusCode(200)->json($conversationMessage->toArray(), ['x-total-count'=>count($conversationMessage)]);
} catch(Exception $e) {
	//echo $e->getMessage();
	$response->setStatusCode(500);
}
?>

