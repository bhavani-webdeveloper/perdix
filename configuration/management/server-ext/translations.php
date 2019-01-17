<?php

include_once("bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Services\CacheService;

$response = get_response_obj();

$translationJson = CacheService::getCache('translations');
if (!$translationJson) {
	$translations = DB::table('translations')->select('label_code AS code', 'en', 'hi', 'ta')->get();
	$translationJson = $translations->toArray();
	CacheService::setCache('translations', $translationJson);
}
$response->setStatusCode(200)->json($translationJson);