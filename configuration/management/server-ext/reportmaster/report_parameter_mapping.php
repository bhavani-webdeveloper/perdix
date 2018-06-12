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

// Fetching the param list by report_name
//$parameterMappingList = DB::table('report_parameter_mapping')->select('parameter','report_query_column_name')->where('report_name',$reportName)->get();

$parameterMappingList = DB::table('report_parameter_mapping')
            ->join('report_parameters_master', 'report_parameter_mapping.parameter', '=', 'report_parameters_master.parameter')
            ->select('report_parameter_mapping.*', 'report_parameters_master.name')
            ->where('report_parameter_mapping.report_name',$reportName)
            ->get();

//$Response= '{"DataResponse":'.json_encode($parameterMappingList, JSON_NUMERIC_CHECK).'}';
//echo $Response;
//echo $reportName;
//exit;
 $response = get_response_obj();

 $response->setStatusCode(200)->json($parameterMappingList->toArray());

//--------------------------------
//UPDATE PARAMETER MAPPING
//--------------------------------

/*
report_name
parameter
report_query_column_name
type
query
operators
required
*/

//--------------------------------
// PARAMETER MASTER
//--------------------------------

/*
parameter
name
type
query
*/

/*
* Need to validate repeatations(param_name,report_name combination unique)
* When updating record - delete current data and insert form data
* 
*/


/*
// Sample code for Param Mapping Update
$existingParams = array();

$formParams = array();
$getCurrentParamsFromModel = DB::table('report_parameter_mapping')->select('*')->where('report_name',$reportName)->get()->toArray();

//$existingParams = '';
$input=$userInput[0];
/// get existing params from DB

/// get form params from form

/// *** compare existing with form and get missed existing params for delete operation

//==========================================================
/// Delete all existing params
$reportMaster = ReportParametersMapping::find()->where('report_name',$reportName)->delete();

/// Insert all form params
$allInsertParameters = array();
foreach($formParams as $formdata){
$allInsertParameters[] = array(
    'report_name' => $reportName,
    'parameter' => $formdata['parameter'],
    'report_query_column_name' => $formdata['report_query_column_name'],
    'type' => $formdata['type'],
    'query' => $formdata['query'],
    'operators' => $formdata['operators'],
    'required' => $formdata['required']
);
}

    ReportParametersMapping::insert($allInsertParameters);

$response = get_response_obj();    
    return $response->setStatusCode(200)->json(array('success'=>'Updated'));
    //=========================================
*/







