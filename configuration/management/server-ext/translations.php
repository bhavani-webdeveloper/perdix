<?php

include_once("bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;



$queryString = $_SERVER['QUERY_STRING'];
$authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$query = [];
parse_str($queryString, $query);

$translations = DB::table('translations')->select('label_code AS code', 'en', 'hi', 'ta')->get();
$response = get_response_obj();

$response->setStatusCode(200)->json($translations->toArray());