<?php
header("Access-Control-Allow-Headers: Content-Type, accept, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT");
header("Access-Control-Request-Headers: Content-Type, accept");
header("Access-Control-Expose-Headers: X-Total-Count");
header('Content-Type: application/json');

if (!empty($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}

if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
    die();
}

include_once "../bootload.php";
// include 'functions/http.php';
// include 'functions/utils.php';

use GuzzleHttp\Client as GuzzleClient;
use EllipseSynergie\ApiResponse\Contracts\Response;

#AUTHENTICATION
$auth_token = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
if($auth_token=='') 
{
	$url_user_id = isset($_GET['user_id']) ? $_GET['user_id'] : ''; 
	$auth_token = isset($_GET['auth_token']) ? 'Bearer '.$_GET['auth_token'] : '';
}
// if ($auth_token == '') {
//     $url_user_id = isset($_GET['user_id']) ? $_GET['user_id'] : '';
//     $auth_token = isset($_GET['auth_token']) ? 'Bearer ' . $_GET['auth_token'] : '';
// }
// $req = new HttpRequest($auth_server, "GET");
// $req->headers["Authorization"] = $auth_token;
// $req->headers["Accept"] = "application/json, text/plain, */*";
// $req->send();
try{
    $client = new GuzzleClient();
    $reqRes = $client->request('GET',getenv('PERDIX_V8_BASE_URL').'/api/account', [
        'headers' => [
            'Authorization' => $auth_token
        ],
        'connect_timeout' => 3600,
        'timeout' => 3600
    ]);


} catch (\Exception $e){
    throw $e;
}

$responseBody = $reqRes->getBody()->getContents();
$auth_array =  \GuzzleHttp\json_decode($responseBody, true);
// $user_id = isset($auth_array['login']) ? $auth_array['login'] : '';
// $branch_id = isset($auth_array['branchId']) ? $auth_array['branchId'] : '';

#ERROR AND ACCESS LOG
if (isset($auth_array['error']) OR !isset($auth_array['login'])) {
    $error = isset($auth_array['error']) ? $auth_array['error'] : 'unknown error';
} elseif (isset($_GET['user_id']) AND $url_user_id != $user_id) {
    $error = 'user_id token mismatch';
} else {
    $error = '';
}

// if ($error != '') {
//     echo $error;
//     require 'config/end.php';
//     die();
// }

$reports = [];
$count = -1;

define('DB_HOST', getenv('DB_HOST'));
define('DB_USER', getenv('DB_USER'));
define('DB_PASSWORD', getenv('DB_PASSWORD'));

    $perdix_db = getenv('DB_NAME');
    // $form_base_url = $_GET["forms_base_url"];
    // $folder_path = getenv('ALL_FORMS_BASE_DIR');
    // $folder_path = sys_get_temp_dir();

    try{
        try{
            $connection = new mysqli(DB_HOST, DB_USER, DB_PASSWORD);
        }catch(mysqli_sql_exception $e){
            throw $e;
        }
    }catch (Exception $e) {
        echo $e->getMessage();
        return;
    }

if ($result = $connection->query("SELECT rm.patch_name, rm.group, rm.patch_display_name, rpm.parameter  FROM $perdix_db.patch_master rm 
LEFT JOIN $perdix_db.patch_parameter_mapping rpm ON rpm.patch_name = rm.patch_name
WHERE rm.is_active=1 ORDER BY rm.patch_display_name, CASE rpm.parameter WHEN 'from_date' THEN 1 WHEN 'to_date' THEN 2 ELSE IF (rpm.required, 3, 4) END")
) {
    $data = [];
    $p = 0;
    $currentReport = '';
    while ($obj = $result->fetch_object()) {
        if ($currentReport != $obj->patch_name) {
            $count++;
            $data = [];
            $p = 0;
            $currentReport = $obj->patch_name;
            $data["group"] = $obj->group;
            $data["name"] = $obj->patch_display_name;
            $data["value"] = $obj->patch_name;
            if ($obj->parameter != NULL){
                $data["parameters"][$p++] = $obj->parameter;
                $data["parameterized"] = true;
            }
            else {
                $data["parameters"] = [];
                $data["parameterized"] = false;
            }
            $reports[$count] = $data;
        } else {
            $reports[$count]["parameters"][$p++] = $obj->parameter;
        }
    }
}

echo json_encode($reports);

$result->close();
unset($obj);
unset($data);

$connection->close();
// ob_end_flush();

?>