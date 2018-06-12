<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once("../bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\ReportMaster;

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

//$ub = ReportMaster::find($input['id']);
$ub = ReportMaster::findOrFail($input['id']);

$ub->query = $input['query'];
$ub->group_by = $input['group_by'];
$ub->file_type = $input['file_type'];
$ub->file_extension = $input['file_extension'];
$ub->is_header_less = $input['is_header_less'];
$ub->is_active = $input['is_active'];
$response = get_response_obj();
if ($ub->save()){
    return $response->setStatusCode(200)->json($ub->toArray());
} else {
    return $response->setStatusCode(500);
}