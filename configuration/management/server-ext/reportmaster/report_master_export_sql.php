<?php
//error_reporting(E_ALL);
//ini_set('display_errors', 1);

include_once("../bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;

$queryString = $_SERVER['QUERY_STRING'];
/*
$authHeader = $_SERVER['HTTP_AUTHORIZATION'];
*/
$query = [];
parse_str($queryString, $query);

$url = $settings['perdix']['v8_url'] . "/api/account";
$client = new GuzzleClient();

/*$reqResAch = $client->request('GET', $url , [
    'headers' => [
        'Authorization' => $authHeader
    ],
    'connect_timeout' => 3600,
    'timeout' => 3600
]);

$responseBody = $reqResAch->getBody()->getContents();
$parsedArrAch = \GuzzleHttp\json_decode($responseBody, true);
*/
//$username = $parsedArrAch['login'];
if(isset($_GET['report_name']) && !empty($_GET['report_name'])){
$searchdata=$_GET['report_name'];
$search_table_name = 'report_master';
$search_column_name = 'report_name';

function query_builder($searchdata,$search_table_name,$search_column_name)
{
    $columns_results = DB::getSchemaBuilder()->getColumnListing($search_table_name);
    $current_values = DB::table($search_table_name)->select('*')->where($search_column_name,$searchdata)->get()->toArray();
     $current_values_query = array();
    if(isset($current_values[0])){
        foreach($current_values[0] as $key=>$current_value){
            //print_r($current_value);
            if($key == "where_replace"){
                $current_values_query[] = DB::connection()->getPdo()->quote(ltrim($current_value));
            }
            else{
                $current_values_query[] = DB::connection()->getPdo()->quote($current_value);
            }
        }
    }
	$deletequery = "DELETE FROM `".$search_table_name."` WHERE `".$search_column_name."`='".$searchdata."';";
    	$insertquery = "INSERT INTO `$search_table_name` (`" . implode('`, `', $columns_results) . "`) "
         . "VALUES (" . implode(",", $current_values_query) . ");";
         
    return $deletequery."\n".$insertquery;
}

$queries = query_builder($searchdata,$search_table_name,$search_column_name);
$report_download_name = $searchdata.date('YmdHis');

header("Content-type: text/plain");
//header("Content-Disposition: attachment; filename=savethis.txt");
header("Content-Disposition: attachment; filename=".$report_download_name.".sql");
 
print $queries;
}