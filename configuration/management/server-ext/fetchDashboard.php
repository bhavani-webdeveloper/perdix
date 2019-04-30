<?php

use App\Services\DashboardService;

$response = get_response_obj();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);



try {
    include_once "bootload.php";
    $requestData = json_decode(rtrim(file_get_contents('php://input'), "\0"), true);
    $dashboardName = $requestData['dashboardName'];
    $parameter = $requestData['parameters'];
    $ds = new DashboardService();
    $dashArr = $ds->process($dashboardName, $parameter);
    $response->setStatusCode(200)->json($dashArr);
} catch (App\Exception\VisualizationException $e){
    if ($e->getStatusCode() == "404"){
        $response->errorNotFound($e->getMessage());    
    } else {
        $response->errorInternalError($e->getMessage());    
    }
    $response->errorInternalError($e->getMessage());
} catch (\Exception $e){
    $response->errorInternalError($e->getMessage());
}



?>
