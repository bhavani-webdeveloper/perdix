#!/usr/bin/php
<?php
include_once("bootload.php");
use Illuminate\Database\Capsule\Manager as DB;
use App\Services\Log;

$log = new Log();
// Fetching the repayment details depends on the given date range
try {
    $currentDate = DB::connection("encore_db")->table("banks")->select("current_working_date")->get();
    $currentDate = $currentDate->toArray();
    $startDate = date("Y-m-d H:i:s");

    if(isset($currentDate[0]->current_working_date)) {
        $currentWorkingDate = $currentDate[0]->current_working_date;
        $eventIdetifier = date("Y-m-d");
        
        $parameter = json_encode(["currentDate"=>$currentWorkingDate]);

        $eventList[] = array("event_parameter"=>$parameter, "event_name"=>"EOD", "event_identifier"=>$eventIdetifier);
        if($currentWorkingDate == date("Y-m-t", strtotime($currentWorkingDate))) {
            $eventList[] = array("event_parameter"=>$parameter, "event_name"=>"EOM", "event_identifier"=>$eventIdetifier);
        }

        if($currentWorkingDate == date("Y-12-t", strtotime($currentWorkingDate))) {
            $eventList[] = array("event_parameter"=>$parameter, "event_name"=>"EOY", "event_identifier"=>$eventIdetifier);
        }

        $insert = DB::connection("bi_db")->table("report_event_schedule")->insert($eventList);
        $log->reportLog(json_encode(["startDate"=>$startDate, "endDate"=>date("Y-m-d H:i:s")]), "ETL_event_schedule", "Completed");
    }
} catch(\Illuminate\Database\QueryException $e){
    $log->reportLog(json_encode(['reason'=>$e->getMessage()]), "ETL_event_schedule");
}
