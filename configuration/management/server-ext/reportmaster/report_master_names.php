<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include_once("../bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\ReportMaster;

$queryString = $_SERVER['QUERY_STRING'];
// $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$query = [];
parse_str($queryString, $query);

 $branches = DB::table('report_master')->select('group','report_name AS value','report_display_name AS name')->orderBy('group')->get();
 $response = get_response_obj();
 $response->setStatusCode(200)->json($branches->toArray());