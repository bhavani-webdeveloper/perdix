<?php
// http://devkinara.perdix.in:8081/management/server-ext/repayment_reminder.php?fromDate=03-09-2016&noOfDays=2
include_once("bootload.php");
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use Illuminate\Validation\Rule;
use App\Models\RepaymentReminder;

$response = get_response_obj();

// Get value 
$queryString = $_SERVER['QUERY_STRING'];
// $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$query = [];
parse_str($queryString, $query);

// Get DB names from env file
$bi_db = $settings['bi_db']['database'];
$encore_db = $settings['encore_db']['database'];
$db = $settings['db']['database'];


$fromDate = date("Y-m-d", strtotime($query['fromDate']));
$toDate = date("Y-m-d", strtotime("{$fromDate} +{$query['noOfDays']} days")); // Get today from fromDate

$details = [];
// Fetching the repayment details depends on the given date range
try {
    $currentDate = DB::table("$encore_db.banks")->select("current_working_date")->get();
    $currentDate = $currentDate->toArray();
    $futTable = "fut__".strtoupper(date("dMY", strtotime("{$currentDate[0]->current_working_date} -1 days")));

    $totalCount = 0;

    $repaymentReminder = DB::table("$bi_db.$futTable as fut")
        ->join("$db.loan_accounts as l", 'l.account_number', '=', 'fut.ACCOUNT_NO')
        ->join("$db.customer as c", 'c.id', '=', 'l.customer_id')
        ->whereBetween('fut.INSTALLMENT_DATE', [$fromDate, $toDate])
        ->select('l.bank_id', 'l.branch_id', 'c.centre_id', 'l.customer_id', 'fut.URN as customer_urn', 'fut.CUSTOMER_NAME as customer_name', 'l.id as loan_id', 'l.account_number', 'fut.DEMAND_NO as installment_number', 'fut.INSTALLMENT_AMOUNT as installment_amount', 'fut.INSTALLMENT_DATE as installment_date', DB::raw('NOW() as `created_at`'), DB::raw("'SYSTEM' as `created_by`"), DB::raw("0 as `version`"), DB::raw('NOW() as `last_edited_at`'), DB::raw("'SYSTEM' as `last_edited_by`"), DB::raw("'No Status' as `reminder_status`") )
        ->havingRaw("(select count(account_number) from $db.repayment_reminder where account_number = `fut`.`ACCOUNT_NO` and installment_date = `fut`.`INSTALLMENT_DATE`) = 0")
        ->orderBy('fut.INSTALLMENT_DATE')
        ->chunk(500, function ($reminderData) use (&$totalCount) {
            $details = json_encode($reminderData);
            $details = json_decode($details, true);
            RepaymentReminder::insert($details);
            $totalCount = $totalCount + count($details);
        });

    return $response->setStatusCode(200)->json(['status' => 'completed', 'count' => $totalCount]);

} catch(\Illuminate\Database\QueryException $ex){
    echo $ex->getMessage();
    return $response->setStatusCode(500);
}
?>