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

$userInput = json_decode(file_get_contents("php://input", true), true);
$input=$userInput[0];
$reportName = $_GET['report_name'];

$parameterMappingList = DB::connection("bi_db")->table('report_parameter_mapping')
            ->join('report_parameters_master', 'report_parameter_mapping.parameter', '=', 'report_parameters_master.parameter')
            ->select('report_parameter_mapping.*', 'report_parameters_master.name')
            ->where('report_parameter_mapping.report_name',$reportName)
            ->get();

 $response = get_response_obj();

 $response->setStatusCode(200)->json($parameterMappingList->toArray());