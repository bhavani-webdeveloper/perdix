<?php
include_once("bootload.php");
use Illuminate\Database\Capsule\Manager as DB;
use App\Scheduler\SchedulerFactory;
use App\Services\Log;

$log = new Log();

try {
	if(isset($argv[1])) {
		$reportId = $argv[1];
		try 
		{
			// Fetch schedule details from the table
			$getReport = DB::connection("bi_db")->table("report_scheduled_config as rsc")
							->join("report_master as rm", "rm.report_name", "=", "rsc.report_name")
							->select("rsc.*", DB::raw('if(rm.file_extension="", "xlsx", rm.file_extension) as file_extension'))
							->where("rsc.id", $reportId)
							->get()->toArray();	

			if(count($getReport) > 0) {
				$scheduler = SchedulerFactory::getInstance($getReport[0]);
				$scheduler->schedule();
			} else {
				throw new \Exception("Report is not exist for the given reprot ID $reportId");
			}
		} catch(\Illuminate\Database\QueryException $e) {
			throw $e;
		}
	} else {
		throw new \Exception("Kindly pass the report ID");
	}
} catch(\Exception $e) {
	$log->reportLog(json_encode(["reason"=>$e->getMessage()]), "report_schedule_cron");
}