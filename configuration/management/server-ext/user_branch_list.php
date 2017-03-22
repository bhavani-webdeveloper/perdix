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

$branches = UserBranch::where('user_id', $query['user_id'])
    ->with('branch')
    ->get();
$response = get_response_obj();

$response->setStatusCode(200)->json($branches->toArray());