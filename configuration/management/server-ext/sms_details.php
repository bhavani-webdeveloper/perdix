<?php

// Setting up config for PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// error_reporting(0);

// http://devkinara.perdix.in:8081/management/server-ext/repayment_reminder.php?fromDate=03-09-2016&noOfDays=2
include_once("bootload.php");
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use Illuminate\Validation\Rule;
use App\Models\RepaymentReminder;

$sms_template_path = $settings['paths']['sms_template_path'];

$dotEnv =  new Dotenv\Dotenv($sms_template_path,'smsTemplate.txt');
$dotEnv->load();

$repaymentReminderHistory = DB::table('global_settings')->where('name', 'repaymentReminderHistory')->first();
//echo $repaymentReminderHistory->value;
$frequencies= explode(",", $repaymentReminderHistory->value);

foreach ($frequencies as $frequency) {
    echo "<br/>frequency : $frequency";
    try{
        $fromDate = date("Y-m-d", time());
        $toDate = date('Y-m-d', strtotime($fromDate. ' + '.$frequency.' days')); 
        $reminders = DB::table('repayment_reminder as r')
            ->join("customer as c", 'c.id', '=', 'r.customer_id')
            ->select('r.customer_id', 'r.loan_id','r.installment_number','r.installment_amount','r.installment_date','c.mobile_phone')
            ->where('r.installment_date', $toDate)
            ->get();

        foreach ($reminders as $reminder) {
            echo "<br/>reminder : ";
            $out_going_message = getenv('regular_repayment'.$frequency);
            $installment_amount =number_format($reminder->installment_amount,2);
            $out_going_message=str_replace('INSTALLMENT_AMOUNT', $installment_amount ,  $out_going_message);
            $out_going_message=str_replace('INSTALLMENT_DATE',	$reminder->installment_date, $out_going_message);
            $dbArray =      ['customer_id' => $reminder->customer_id,
            'version' => 1, 
            'product_transaction_id' => $reminder->loan_id.$reminder->installment_number,
            'mobile_no' => $reminder->mobile_phone,
            'created_by' => 'System',
            'created_at' => $fromDate,
            'sms_type' => 'Transactional',
            'transaction_ref_no' => $reminder->mobile_phone,
            'out_going_message' => $out_going_message,
            'text_message'=>$out_going_message];

            DB::table('sms_scheduler_details')->insert($dbArray); 
            print_r($dbArray); 
        }
    }catch(Exception $e){
        print_r($e);
    }
}

?>