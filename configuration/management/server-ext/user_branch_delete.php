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

$input = json_decode(file_get_contents("php://input", true), true);

$userBranchId = $input['userBranchId'];

$response = get_response_obj();
if (UserBranch::find($userBranchId)->delete()) {
    return $response->setStatusCode(200);
} else {
    return $response->setStatusCode(500);
}
