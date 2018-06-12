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
//$branches = DB::table('report_master')->get();


   $report_list = DB::table('report_master')->select('*');

   if(isset($_GET['group']) && !empty($_GET['group'])){
            $report_list->where('group', $_GET['group']);
    }    
    if(isset($_GET['report_display_name']) && !empty($_GET['report_display_name'])){
    	//echo $_GET['report_display_name'];
        $report_list->where('report_display_name','like', $_GET['report_display_name']."%");
    }
    if(isset($_GET['is_active'])){
         $report_list->where('is_active', $_GET['is_active']);
    }
    $report_list->where('is_ui_editable', 1);

    $reports= $report_list->get();
    
	$response = get_response_obj();

$response->setStatusCode(200)->json($reports->toArray());