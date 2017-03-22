<?php

include_once("bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\Repayment;



$queryString = $_SERVER['QUERY_STRING'];
$authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$url = $settings['perdix']['v8_url'] . "/api/ach/pdcdemandList";

$query = [];
parse_str($queryString, $query);


try{
    $client = new GuzzleClient();
    $reqRes = $client->request('GET', $url . '?'. $queryString, [
        'headers' => [
            'Authorization' => $authHeader
        ],
        'connect_timeout' => 3600,
        'timeout' => 3600
    ]);


} catch (\Exception $e){
    throw $e;
}

$responseBody = $reqRes->getBody()->getContents();
$parsedArr = \GuzzleHttp\json_decode($responseBody, true);

/* Fetch the details for branchId */

try{
    DB::beginTransaction();
    Repayment::populateWithEntries($parsedArr, $query, 'PDC');
    DB::commit();
} catch (\Exception $e){
    DB::rollback();
    throw $e;
}

$response = get_response_obj();

$response->setStatusCode(200)->json($parsedArr);