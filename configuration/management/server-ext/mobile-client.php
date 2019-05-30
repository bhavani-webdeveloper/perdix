<?php
include_once("bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Services\PerdixService;


try {
# AUTHENTICATION
	$perdixService = new PerdixService();
	$loggedInUser = $perdixService->accountInfo();
	$perdix_db = $settings['db']['database'];
	$results=DB::connection("default")->select("
		SELECT value FROM $perdix_db.global_settings 
		WHERE name='cordova.latest_apk_download_strategy' ");
	foreach($results as $result){
		$value=$result->value;
	}
	
	if($value == 'DOWNLOAD_PAGE')
	{
		$download_url='http://witfin.perdix.in:8081/apk/';

	} else {
		$url_result=DB::connection("default")->select("
		SELECT value FROM $perdix_db.global_settings 
		WHERE name='cordova.latest_apk_url' ");
		foreach($url_result as $url_result){
		$url_value=$url_result->value;
		}
		$download_url=$url_value;
	}

} catch (Exception $e) {
	$response = get_response_obj();
	$response->setStatusCode(500)->json(['error'=> $e->getMessage()]);
    throw $e;
}
$response = get_response_obj();
return $response->setStatusCode(200)->json(array('download_url' =>$download_url));