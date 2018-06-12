<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include_once("../bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\ReportParameterMapping;

$queryString = $_SERVER['QUERY_STRING'];
// $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$query = [];
parse_str($queryString, $query);

try {
$userInput = json_decode(file_get_contents("php://input", true), true);

$reportName = $userInput['report_name'];

$parameterMappingList = DB::table('report_parameter_mapping')
            ->join('report_parameters_master', 'report_parameter_mapping.parameter', '=', 'report_parameters_master.parameter')
            ->select('report_parameter_mapping.*', 'report_parameters_master.name')
            ->where('report_parameter_mapping.report_name',$reportName)
            ->get();         


// Sample code for Param Mapping Update

/*
* Need to validate repeatations(param_name,report_name combination unique)
* When updating record - delete current data and insert form data
* 
*/

$existingParams = array();

$formParams = $userInput['parameter'];
// Validation for same Parameter exists in form post
$getparametercolumnsdata = array_column($formParams, 'parameter_name');
if(count(array_unique($getparametercolumnsdata))<count($getparametercolumnsdata))
{
    // Array has duplicates
   // echo "Array having duplication";  
    throw new Exception("Some Parameters are repeated, Please Re-enter valid parameters only.");          
}
//print_r($formParams);
//exit;

$getCurrentParamsFromModel = DB::table('report_parameter_mapping')->select('*')->where('report_name',$reportName)->get()->toArray();

//==========================================================
/// Delete all existing params
$reportMaster = ReportParameterMapping::where('report_name',$reportName)->delete();

/// Insert all form params
$allInsertParameters = array();
foreach($formParams as $formdata){
$allInsertParameters[] = array(
    'report_name' => $reportName,
    'parameter' => $formdata['parameter_name'],
    'report_query_column_name' => $formdata['report_query_column_name'],
    'type' => $formdata['type'],
    'query' => isset($formdata['query'])?$formdata['query']:'',
    'operators' => $formdata['operator'],
    'required' => $formdata['required']
);
}

ReportParameterMapping::insert($allInsertParameters);

$response = get_response_obj();    
return $response->setStatusCode(200)->json(array('success'=>'Updated'));
} catch (Exception $e) {
	$response = get_response_obj();
	$response->setStatusCode(500)->json(['error'=> $e->getMessage()]);
    throw $e;
}




