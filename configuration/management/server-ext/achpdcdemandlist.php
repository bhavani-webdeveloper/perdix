<?php

include_once("bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\Repayment;



$queryString = $_SERVER['QUERY_STRING'];
$authHeader = $_SERVER['HTTP_AUTHORIZATION'];


$query = [];
parse_str($queryString, $query);

try{
	$url = $settings['perdix']['v8_url'] . "/api/ach/achdemandList";
	$client = new GuzzleClient();
	$reqResAch = $client->request('GET', $url . '?'. $queryString, [
		'headers' => [
			'Authorization' => $authHeader
		],
		'connect_timeout' => 3600,
		'timeout' => 3600
	]);


	$responseBody = $reqResAch->getBody()->getContents();
	$parsedArrAch = \GuzzleHttp\json_decode($responseBody, true);

	$url = $settings['perdix']['v8_url'] . "/api/ach/pdcdemandList";
	$client = new GuzzleClient();
	$reqResPdc = $client->request('GET', $url . '?'. $queryString, [
		'headers' => [
			'Authorization' => $authHeader
		],
		'connect_timeout' => 3600,
		'timeout' => 3600
	]);

	$responseBody = $reqResPdc->getBody()->getContents();
	$parsedArrPdc = \GuzzleHttp\json_decode($responseBody, true);
} catch (\Exception $e){
	throw $e;
}



try{
	DB::beginTransaction();
	Repayment::populateWithEntries($parsedArrAch, $query, 'ACH');
	Repayment::populateWithEntries($parsedArrPdc, $query, 'PDC');
	DB::commit();
} catch (\Exception $e){
	DB::rollback();
	throw $e;
}

$response = get_response_obj();

$response->setStatusCode(200)->json(array_merge($parsedArrAch, $parsedArrPdc));