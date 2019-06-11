<?php

// error_reporting(0);

include_once("bootload.php");
include_once('../scoring/includes/db.php');
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\CustomerUploadMaster;
use App\Models\CustomerUploadDetail;
use App\Services\PerdixService;
use App\Core\Settings;

$perdixService= new PerdixService();
$perdixService->login();
$settings = Settings::getInstance()->getSettings();

if (isset($_GET)) {
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
    if ($_SERVER['REQUEST_METHOD'] == "GET") {
        $queryString = $_SERVER['QUERY_STRING'];
        $form_db = $settings['form_db']['database'];
        $authHeader = "Bearer " . $settings['perdix']['token'];
        //echo ($authHeader);
        $query = DB::connection("form_db")->table("form")->select('id','Output','table_query','query','form_name','perdix_form_name','table_investor_id','table_product_id','section_name','section_html','footer','Notes')->get();
        //parse_str($queryString, $query);
        //$query = "SELECT * FROM form";
        print_r($query);
    }
    if ($_SERVER['REQUEST_METHOD'] == "PUT") {
        //echo ("abtest");
    }
    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $requestData = json_decode(rtrim(file_get_contents('php://input'), "\0"), true);
        $pdf_renderer=$requestData['pdf_renderer'];
        $Output = $requestData['Output'];
        $table_query= $requestData['table_query'];
        $query=  $requestData['query'];
        $form_name=  $requestData['form_name'];
        print_r($Output);
        // print_r($requestData);
        // print_r($dashboardName);
       // $parameter = $requestData['parameters'];
       
       //=====
        // include_once('../includes/db.php');
        //echo ("posting data");
        // $ReceivedJson = json_decode(file_get_contents("php://input"));
        // $CreateResponse = $ReceivedJson[0];
        // print_r($ReceivedJson);
       // print_r($CreateResponse->name);
       
    $FormCreateSql="INSERT INTO form (id,Output,pdf_renderer,table_query,query,form_name,perdix_form_name) values(1000000,:Output,:pdf_renderer,:table_query,:query,:form_name,:perdix_form_name)";
   // $FormCreateSql="INSERT INTO form (id,Output,pdf_renderer)  values(1000000,:Output,:pdf_renderer)";
    //$form_db = ConnectDb();
    $form_db =  ConnectFormDb();
    $CreateForm = $form_db->prepare($FormCreateSql); 
    $CreateForm->bindParam("Output", $Output);
    $CreateForm->bindParam("pdf_renderer", $pdf_renderer);
    $CreateForm->bindParam("table_query",$table_query);
    $CreateForm->bindParam("query",$query);
    $CreateForm->bindParam("form_name",$form_name);
    
    $CreateForm->execute();
   // print_r($CreateForm);
}
}

//$query = DB::connection("form_db")->table("form")->select('id','Output','table_query','query','form_name','perdix_form_name','table_investor_id','table_product_id','section_name','section_html','footer','Notes')->get();

//parse_str($queryString, $query);

//$query = "SELECT * FROM form";

//print_r($query);

?>
