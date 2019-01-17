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
	'process_id'=>'required',
	'sub_process_id'=>'required'
];

// Custome error message
$customeMessage = [
	'process_id.required' => 'required',
	'sub_process_id.required' => 'required'
];

$validator = get_validator()->make($query, $rule,$customeMessage);
if ($validator->fails()) {
	$response->setStatusCode(500);
	exit();
}

$conversation = array();
// Fetching the messaging details depends on the conversation ID
$conversationMessage = DB::table('ms_conversation')->join('ms_message', 'ms_message.conversation_id', '=', 'ms_conversation.id')->select('ms_conversation.*', 'ms_message.conversation_id', 'ms_message.id AS sub_id', 'ms_message.reply_reference_id', 'ms_message.message_text', 'ms_message.created_at AS sub_created_at', 'ms_message.created_by AS sub_created_by')->where([['process_id', '=', $query['process_id']], ['sub_process_id', '=', $query['sub_process_id']]])->whereNull('reply_reference_id')->get();

$details = $conversationMessage->toArray();
if(count($details)>0) {
	$conversation = array('id'=>$details[0]->id, 'process_id'=>$details[0]->process_id, 'sub_process_id'=>$details[0]->sub_process_id, 'created_at'=>$details[0]->created_at, 'created_by'=>$details[0]->created_by, 'closed_at'=>$details[0]->closed_at);
	foreach($details as $value) {
		$reply = Message::select("id", "reply_reference_id", "message_text", "created_at", "created_by")->where([['conversation_id',"=",$details[0]->id],['reply_reference_id',"=", $value->sub_id]])->get();
		$conversation['messages'][] = ['id'=>$value->sub_id,'message_text'=>$value->message_text,'created_at'=>$value->sub_created_at,'created_by'=>$value->sub_created_by, 'replies'=>$reply->toArray()];
	}
}

// Response
$response = get_response_obj();
$response->setStatusCode(200)->json($conversation);
?>

