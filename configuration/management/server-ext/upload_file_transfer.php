<?php

include_once("bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Services\PerdixService;
use App\Core\Settings;

// $perdixService= new PerdixService();
// $perdixService->login();
$settings = Settings::getInstance()->getSettings();

// $authHeader = "Bearer ". $settings['perdix']['token'];
// $url = $settings['perdix']['v8_url'] . "/api/enrollments";

//echo $authHeader;
$upload_name = isset($_GET['upload_name']) ? $_GET['upload_name'] : '';

$baseUrl = "";

if ($upload_name == 'CUSTOMER') {
  $baseUrl = $settings['perdix']['customer_upload_path'];
}
if ($upload_name == 'LOAN') {
  $baseUrl = $settings['perdix']['individual_loan_upload_path'];
}
if ($upload_name == 'LOANCOLLECTION') {
  $baseUrl = $settings['perdix']['loan_collection_upload_path'];
}
if ($upload_name == 'DISBURSEMENT') {
  $baseUrl = $settings['perdix']['disbursement_base_dir'];
}

$tempToBeProcessed = $baseUrl . DIRECTORY_SEPARATOR . "to_be_processed" . DIRECTORY_SEPARATOR;
// echo $tempToBeProcessed;
$upload_name = isset($_GET['upload_name']) ? $_GET['upload_name'] : '';

$status = "Check";

//var_dump($_FILES);

if (0 < $_FILES['file']['error']) {
     // echo 'Error: ' . $_FILES['file']['error'] . '<br>';
} 
else {
      if (move_uploaded_file($_FILES['file']['tmp_name'], $tempToBeProcessed.$_FILES['file']['name'])) {
              $outjson = array(
                  "POST_PARAMS" => $_POST,
                  "filename" => $_FILES['file']['name']
              );
              move_uploaded_file($_FILES['file']['tmp_name'], $tempToBeProcessed.$_FILES['file']['name']);

              $status = "Success";
      }
      else {
        $status = "Fail";
      }
}

$response = get_response_obj();
$response->setStatusCode(200)->json(['stats' => ['File uplode: ' => 1, $status]]);







