<?php
//error_reporting(E_ALL);
//ini_set('display_errors', 1);

include_once("../bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\ReportMaster;

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

//$userInput = json_decode(file_get_contents("php://input", true), true);
//echo $_GET['id']; exit;
$input=$_GET['id'];

$branches = DB::connection("bi_db")->table('report_master')->select('*')->where('id',$input)->get();

$Response= '{"DataResponse":'.json_encode($branches, JSON_NUMERIC_CHECK).'}';
echo $Response;
