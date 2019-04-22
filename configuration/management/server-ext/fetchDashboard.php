<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
use App\Services\DashboardService;
include_once "bootload.php";

$requestData = json_decode(rtrim(file_get_contents('php://input'), "\0"), true);

$dashboardName = $requestData['dashboardName'];
$parameter = $requestData['parameters'];

$ds = new DashboardService();

$ds->process($dashboardName, $parameter);
?>
