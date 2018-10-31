<?php
// http://devkinara.perdix.in:8081/management/server-ext/repayment_reminder.php?fromDate=03-09-2016&noOfDays=2
include_once("bootload.php");
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use Illuminate\Validation\Rule;
use App\Models\RepaymentReminder;

//$sms_template_path = $settings['paths']['sms_template_path'];

$sms_template_path ="E:/php";
$dotEnv =  new Dotenv\Dotenv($sms_template_path,'smsTemplate.txt');
$dotEnv->load();

$repaymentReminderHistory = DB::table('global_settings')->where('name', 'repaymentReminderHistory')->first();print_r($repaymentReminderHistory);
//echo $repaymentReminderHistory->value;
$frequencies= explode(",", $repaymentReminderHistory->value);
foreach ($frequencies as $frequency) {
    try{
        $fromDate = date("Y-m-d", time());
        $toDate = date('Y-m-d', strtotime($fromDate. ' + '.$frequency.' days')); 
        $reminders = DB::table('repayment_reminder as r')
            ->join("customer as c", 'c.id', '=', 'r.customer_id')
            ->select('r.customer_id', 'r.loan_id','r.installment_number','r.installment_amount','r.installment_date','c.mobile_phone')
            ->where('r.installment_date', $toDate)
            ->get();

        foreach ($reminders as $reminder) {
            $out_going_message = getenv('regular_repayment'.$frequency);

            $out_going_message=str_replace('INSTALLMENT_AMOUNT', $reminder->installment_amount, $out_going_message);
            $out_going_message=str_replace('INSTALLMENT_DATE',	$reminder->installment_date, $out_going_message);

            DB::table('sms_details')->insert(
            ['customer_id' => $reminder->customer_id, 
            'product_transaction_id' => $reminder->loan_id.$reminder->installment_number,
            'mobile_no' => $reminder->mobile_phone,
            'transaction_date' => $fromDate,
            'created_by' => 'System',
            'created_at' => $fromDate,
            'sms_type' => 'Transactional',
            'transaction_ref_no' => $reminder->mobile_phone,
            'out_going_message' => $out_going_message]
            );  
        }
    }catch(Exception $e){
        print_r($e);
    }
}

?>