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

// Fetching the messaging details depends on the conversation ID
$branches = DB::table('report_master')->select('group AS name','group AS value')->groupby('group')->get();

$Response= '{"DataResponse":'.json_encode($branches, JSON_NUMERIC_CHECK).'}';
echo $Response;