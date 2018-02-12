<?php

include_once("bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\UserBranch;



$queryString = $_SERVER['QUERY_STRING'];
$authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$query = [];
parse_str($queryString, $query);

$url = $settings['perdix']['v8_url'] . "/api/account";
$client = new GuzzleClient();
$reqResAch = $client->request('GET', $url , [
    'headers' => [
        'Authorization' => $authHeader
    ],
    'connect_timeout' => 3600,
    'timeout' => 3600
]);

$responseBody = $reqResAch->getBody()->getContents();
$parsedArrAch = \GuzzleHttp\json_decode($responseBody, true);

$username = $parsedArrAch['login'];

$input = json_decode(file_get_contents("php://input", true), true);

$ub = new UserBranch();
$ub->branch_id = $input['branch_id'];
$ub->user_id = $input['user_id'];
$ub->created_at = date('Y-m-d H:i:s');
$ub->updated_at = date('Y-m-d H:i:s');
$ub->created_by = $username;
$ub->updated_by = $username;

$response = get_response_obj();
if ($ub->save()){
    return $response->setStatusCode(200)->json($ub->toArray());
} else {
    return $response->setStatusCode(500);
}