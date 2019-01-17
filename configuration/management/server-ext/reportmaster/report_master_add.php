<?php
//error_reporting(E_ALL);
//ini_set('display_errors', 1);

include_once("../bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\ReportMaster;
try {
$queryString = $_SERVER['QUERY_STRING'];
/*
$authHeader = $_SERVER['HTTP_AUTHORIZATION'];
*/
$query = [];
parse_str($queryString, $query);

$url = $settings['perdix']['v8_url'] . "/api/account";
$client = new GuzzleClient();

/*$reqResAch = $client->request('GET', $url , [
    'headers' => [
        'Authorization' => $authHeader
    ],
    'connect_timeout' => 3600,
    'timeout' => 3600
]);

$responseBody = $reqResAch->getBody()->getContents();
$parsedArrAch = \GuzzleHttp\json_decode($responseBody, true);
*/
//$username = $parsedArrAch['login'];

$userInput = json_decode(file_get_contents("php://input", true), true);

$input=$userInput[0];

//need to check already exists - report_name is primary
$reportName = strtolower(str_replace(" ","_",$input['report_display_name']));

$reportNameAlreadyExists = ReportMaster::where('report_name', $reportName)->count();

if ($reportNameAlreadyExists) {
          throw new Exception("This Report Name is already exists, Please Re-enter the Report Display Name.");     
 }

//query_2, query_3,where_replace,group_by_2,group_by_3
$ub = new ReportMaster();
$ub->group = $input['group'];//default MIS
$ub->report_name = strtolower(str_replace(" ","_",$input['report_display_name']));//$input['report_name'];

$ub->report_display_name = $input['report_display_name'];
$ub->query = $input['query'];
$ub->query_2 = isset($input['query_2'])?$input['query_2']:'';
$ub->query_3 = isset($input['query_3'])?$input['query_3']:'';//$input['query_3'];
$ub->where_replace = isset($input['where_replace'])?$input['where_replace']:'';//$input['where_replace'];
$ub->group_by = isset($input['group_by'])?$input['group_by']:'';//$input['group_by'];
$ub->group_by_2 = isset($input['group_by_2'])?$input['group_by_2']:'';//$input['group_by_2'];
$ub->group_by_3	 = isset($input['group_by_3'])?$input['group_by_3']:'';//$input['group_by_3'];
$ub->file_type = isset($input['file_type'])?$input['file_type']:'';//$input['file_type'];
$ub->file_extension = isset($input['file_extension'])?$input['file_extension']:'';//$input['file_extension'];
$ub->is_header_less = $input['is_header_less'];
$ub->is_active = isset($input['is_active'])?$input['is_active']:'';//$input['is_active'];
$ub->is_ui_editable = 1;

$response = get_response_obj();

if ($ub->save()){
    return $response->setStatusCode(200)->json($ub->toArray());
} else {
    return $response->setStatusCode(500);
}

} catch (Exception $e) {
	$response = get_response_obj();
	$response->setStatusCode(500)->json(['error'=> $e->getMessage()]);
    throw $e;
}