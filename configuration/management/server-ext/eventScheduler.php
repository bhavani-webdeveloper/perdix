<?php
include_once("bootload.php");
use Illuminate\Database\Capsule\Manager as DB;
use App\Scheduler\SchedulerFactory;
use App\Services\Log;

$log = new Log();

try {
	try
 	{
		// Fetch schedule details from the table
		$getReport = DB::connection("bi_db")->table("report_scheduled_config as rsc")
						->join("report_master as rm", "rm.report_name", "=", "rsc.report_name")
						->join("report_event_schedule as res", 'res.event_name', '=', 'rsc.event_name')
						->select("rsc.*", DB::raw('if(rm.file_extension="", "xlsx", rm.file_extension) as file_extension'), "res.id as event_id", "res.event_name")
						->where([["rsc.is_active", "=", 1],["rsc.report_trigger", "=", 'event'],['res.status', '=', 'pending']])
						->get()->toArray();

		if(count($getReport) > 0) {
			$startDate = date("Y-m-d H:i:s");
			$eventId = array();
			foreach ($getReport as $report) {
				$eventId[] = $report->event_id;
				$scheduler = SchedulerFactory::getInstance($report);
				$scheduler->schedule();
			}
			$eventId = array_unique($eventId);
			$endDate = date("Y-m-d H:i:s");

			// update event status to the table
			DB::connection("bi_db")->table("report_event_schedule")->where("status", "pending")->update(["started_at"=>$startDate,"completed_at"=>$endDate,"status"=>"completed"]);
		} 
	} catch(\Illuminate\Database\QueryException $e) {
		throw $e;
	}
} catch(\Exception $e) {
	$log->reportLog(json_encode(["reason"=>$e->getMessage()]), "report_schedule_event");
}