<?php

include_once("bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\User;



$queryString = $_SERVER['QUERY_STRING'];
$authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$query = [];
parse_str($queryString, $query);

$users = User::select(array('user_id', 'user_name', 'branch_name'))
    ->where('user_id', 'like', '%'. $query['user_id'] .'%')
    ->get();
$response = get_response_obj();

$response->setStatusCode(200)->json($users->toArray());