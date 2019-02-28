<?php
ob_start();
// Setting up config for PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
//require(dirname(__DIR__).'../../config/config.php');
// error_reporting(0);
include_once("bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\RequestOptions as MULTIPART;
use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Support\Facades\Storage;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\ScheduleDetails;
use App\Services\PerdixService;
use App\Core\Settings;
use App\Models\Customer;

$response = get_response_obj();

$perdixService= new PerdixService();
$perdixService->login();
$settings = Settings::getInstance()->getSettings();
$api_url = $settings['perdix']['v8_url'];

$authHeader = "Bearer ". $settings['perdix']['token'];
$url = $settings['perdix']['v8_url'] ;
$filePath=$settings['perdix']['disbursement_base_dir'];

$account_id = $_GET['account_id'];

function getScheduleDataByAccountID($account_id)
{
     global $url;
     global $authHeader;

     $client = new GuzzleClient();
     $reqRes = $client->request('GET', $url."/api/loanaccounts/show/accountId?accountId=".$account_id, [
                'headers' => [
                'Authorization' => $authHeader
            ],
            'connect_timeout' => 3600,
            'timeout' => 3600
        ]);
     $responseBody = $reqRes->getBody()->getContents();
     $parsedArr = \GuzzleHttp\json_decode($responseBody);
     return $parsedArr;
}
$schedule = getScheduleDataByAccountID($account_id);

$tenure = $schedule->tenureMagnitude;
try{
    DB::beginTransaction();
    ScheduleDetails::query()->truncate();
    for( $i = 0; $i<$tenure; $i++)
    {
        $value1 = $schedule->repaymentSchedule[$i]->accountId;
        $value2 = $schedule->repaymentSchedule[$i]->sequenceNum;
        $value3 = $schedule->repaymentSchedule[$i]->valueDateStr;
        $value4 = $schedule->repaymentSchedule[$i]->part1;
        $value5 = $schedule->repaymentSchedule[$i]->part2;
        $value6 = $schedule->repaymentSchedule[$i]->amount1;
        $value7 = $schedule->repaymentSchedule[$i]->amount2;
        $value8 = $schedule->repaymentSchedule[$i]->description;

        $scheduleDetail= new ScheduleDetails();
        $scheduleDetail->seq_id =$value2;
        $scheduleDetail->account_number =$value1;
        $scheduleDetail->demand_date = $value3;
        $scheduleDetail->normal_interest = $value4;
        $scheduleDetail->principle = $value5;
        $scheduleDetail->amount = $value6;
        $scheduleDetail->balance = $value7;
        $scheduleDetail->type = $value8;
        $scheduleDetail->save();
    }
    DB::commit();
    ob_end_clean();
    $response->setStatusCode(200)->json(["message" => 'Inserted sucessfully'.$tenure]);
    return;
}
catch (Exception $e){
    ob_end_clean();
    $response->setStatusCode(500)->json(["error" => $e->getMessage()]);
    return;
}
?>
