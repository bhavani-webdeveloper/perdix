<?php

include_once("bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\UploadTagMaster;
use App\Models\UploadTagAccountsHistory;
use App\Models\UploadTagAccounts;
use App\Services\PerdixService;
use App\Services\UploadService;
use App\Core\Settings;

try {
	# AUTHENTICATION
	$perdixService = new PerdixService();
	$cacheClearOut = $perdixService->clearAllCache();
	$response = get_response_obj();
	$response->setStatusCode(200)->json(['message' => 'Cache clear success, http response : ' . $cacheClearOut->getStatusCode()]);
} catch (Exception $e) {
	$response = get_response_obj();
	$response->setStatusCode(500)->json(['error'=> $e->getMessage()]);
    throw $e;
}