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


// var_dump($_GET);
// die();
#AUTHENTICATION
$auth_token = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
if($auth_token=='') 
{
	$url_user_id = isset($_GET['user_id']) ? $_GET['user_id'] : ''; 
	$auth_token = isset($_GET['auth_token']) ? 'Bearer '.$_GET['auth_token'] : '';
}
// $auth_server = getenv('PERDIX_V8_BASE_URL').'/api/account';
// echo $auth_token;
// die();
// $req = new HttpRequest(, "GET");
// $req->headers["Authorization"] = $auth_token;
// $req->headers["Accept"] = "application/json, text/plain, */*";
// $req->send();
// $auth_array = (array) json_decode($req->getResponseBody());
// $user_id = isset($auth_array['login']) ? $auth_array['login'] : '';
// $branch_id = isset($auth_array['branchId']) ? $auth_array['branchId'] : '';

// #ERROR AND ACCESS LOG

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
// var_dump($auth_array);
// die();
$user_id = isset($auth_array['login']) ? $auth_array['login'] : '';
$branch_id = isset($auth_array['branchId']) ? $auth_array['branchId'] : '';
if(isset($auth_array['error']) OR !isset($auth_array['login'])) {$error = isset($auth_array['error']) ? $auth_array['error'] : 'unknown error';}
elseif (isset($_GET['user_id']) AND $url_user_id!=$user_id){$error='user_id token mismatch';}
else {$error='';}

if($error!='')
{echo $error; die();}

$parameters = [];
$count = 0;

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

if($result = $connection->query("SELECT rpm.patch_name, 
    pm.parameter, pm.name, 
    IFNULL(rpm.type, pm.type) as 'type', 
    IFNULL(rpm.query, pm.query) as 'query',
	pm.default_query as 'default_query',
    rpm.operators, rpm.required  FROM $perdix_db.patch_parameter_master pm LEFT JOIN $perdix_db.patch_parameter_mapping rpm 
    ON rpm.parameter = pm.parameter"))
{
    while($obj = $result->fetch_object()){
    	$data = [];
        $data['patch_name'] = $obj->patch_name;
    	$data['parameter'] = $obj->parameter;
    	$data['name'] = $obj->name;
    	$data['type'] = $obj->type;
        $data['operators'] = json_decode($obj->operators, true);
		$data['titleMap'] = [];
        $data['required'] = $obj->required;
    	if($obj->query != NULL){

    		$query = $obj->query;

    		eval("\$query = \"$query\";");
    		$valResult = $connection->query($query);
    		$val = []; $i = 0;
    		while($valObj = $valResult->fetch_object()){
    			$val[$i]['name'] = $valObj->name;
    			$val[$i++]['value'] = $valObj->value;
    		}
			$valResult->close();
    		$data['titleMap'] = $val;
		}
		if ($obj->default_query != NULL){
			$data['defaultValue'] = [];
			$val = []; $i = 0;
			$dynamic_query = $obj->default_query;
			eval("\$dynamic_query = \"$dynamic_query\";");
			try{
				$valResult = $connection->query($dynamic_query);
				if ($valResult){
				while($valObj = $valResult->fetch_object()){
					$val[$i]['name'] = $valObj->name;
					$val[$i++]['value'] = $valObj->value;
				}
				$valResult->close();
				if (!empty($val)){
					$data['defaultValue'] = $val;
				}
			}
			} catch (PDOException $e){

			}
		}
    	$parameters[$count++] = $data;
    }
}

echo json_encode($parameters);


$result->close();
$connection->close();
// ob_end_flush();

?>