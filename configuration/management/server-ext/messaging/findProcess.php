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

// Get DB names from env file
$bi_db = $settings['bi_db']['database'];
$db = $settings['db']['database'];

// $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$query = [];
parse_str($queryString, $query);

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
	$skip = ($query['page']-1)*$query['per_page'];
	// Fetching the messaging details depends on the conversation ID
	$havingCondition = ($query['replied']=='true') ? 'count(conversation_id) > 1' : 'count(conversation_id) = 1';
	$havingCondition = ($query['replied']=='true') ? "(SELECT count(conversation_id) FROM $db.ms_message WHERE conversation_id = mc.id) > 1" : "(SELECT count(conversation_id) FROM $db.ms_message WHERE conversation_id = mc.id) = 1";
	$conversationMessage = DB::table("$db.ms_conversation as mc")
	->join("$db.ms_message as mm", "mm.conversation_id", "=", "mc.id")
	->join("$db.loan_accounts as la", "la.id", "=", "mc.process_id")
	->join("$db.customer as c", "c.id", "=", "la.customer_id")
	->join("$db.customer as app", "app.urn_no", "=", "la.applicant")
	->join("$db.branch_master as bm", "bm.id", "=", "la.branch_id")
	->join("$db.loan_centre as lc", "lc.loan_id", "=", "la.id")
	->join("$db.centre_master as cm", "cm.id", "=", "lc.centre_id")
	->where("mc.process_type", "=", "LOAN");
	if(isset($query['branchName']) && !empty($query['branchName'])) 
		$conversationMessage = $conversationMessage->where('bm.branch_name','=', $query['branchName']);
	
	if($query['status']=='Active') 
		$conversationMessage = $conversationMessage->whereNull('closed_at');
	else 
		$conversationMessage = $conversationMessage->whereNotNull('closed_at');
	
	if(isset($query['centreCode']) && !empty($query['centreCode'])) 
		$conversationMessage = $conversationMessage->where('cm.centre_code','=', $query['centreCode']);
		
	if(isset($query['stage']) && !empty($query['stage'])) 
		$conversationMessage = $conversationMessage->where('la.current_stage','=', $query['stage']);
			
	if(isset($query['customerName']) && !empty($query['customerName'])) 
		$conversationMessage = $conversationMessage->where('c.first_name','=', $query['customerName']);	
	
	if(isset($query['applicantName']) && !empty($query['applicantName'])) 
		$conversationMessage = $conversationMessage->where('app.first_name','=', $query['applicantName']);
		
	
	$conversationMessage = $conversationMessage->select(
		'mc.id as cid', 
		'la.id as id', 
		'la.id as loanId', 
		'la.account_number as accountNumber',
		'la.current_stage as currentStage',
		DB::raw("DATE_FORMAT(la.sanction_date, '%Y-%m-%d') as sanctionDate"),
		DB::raw("DATE_FORMAT(la.loan_application_date, '%Y-%m-%d') as applicationDate"),
		'la.loan_amount as loanAmount',
		'la.product_code as productCode',
		'la.partner_code as partnerCode',
		'c.first_name as customerName',
		'bm.branch_name as branchName',
		'cm.centre_code as centreCode',
		'cm.centre_name as centreName',
		DB::raw("DATE_FORMAT(la.created_at, '%Y-%m-%dT%TZ') as createdDate"),
		'la.loan_type as loanType',
		'la.process_type as processType',
		DB::raw("DATE_FORMAT(la.screening_date, '%Y-%m-%d') as screeningDate"),
		'app.first_name as applicantName',
		'la.urn_no as urn',
		'c.locality as area',
		'c.village_name as villageName',
		DB::raw("DATE_FORMAT(la.last_stage_changed_at, '%Y-%m-%dT%TZ') as lastStageChangedAt"),
		DB::raw("DATE_FORMAT(MAX(mm.created_at), '%Y-%m-%d') as lastMessage")
	)
	->groupBy('la.id')
	// ->skip($skip)
	// ->take($query['per_page'])
	->havingRaw($havingCondition)
	->get();

	$response->setStatusCode(200)->json($conversationMessage->toArray());
} catch(Exception $e) {
	//echo $e->getMessage();
	$response->setStatusCode(500);
}
?>

