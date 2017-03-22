<?php

include_once("../bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\MessageThreads;
use App\Models\MessageParticipants;
use App\Models\Messages;



$queryString = $_SERVER['QUERY_STRING'];
$query = [];
parse_str($queryString, $query);

/*try{
	$url = $settings['perdix']['v8_url'] . "/api/account";
	$client = new GuzzleClient();
	$reqResAuth = $client->request('GET', $url, [
		'headers' => [
			'Authorization' => $authHeader
		],
		'connect_timeout' => 3600,
		'timeout' => 3600
	]);

	$responseBody = $reqResAuth->getBody()->getContents();
	$parsedArrUser = \GuzzleHttp\json_decode($responseBody, true);
	$username = $parsedArrUser['login'];

} catch (\Exception $e){
	throw $e;
}*/

try{
	$result =DB::select("select id, title from mstb_threads mt
		where mt.reference_no = ?",array($query['loanId']));


	header("Access-Control-Expose-Headers: thread-id, thread-title");
	get_response_obj()->json([], ['thread-id' => $result[0]->id, 'thread-title' => $result[0]->title]);

} catch (\Exception $e){
	throw $e;
}