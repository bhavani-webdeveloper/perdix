<?php
require __DIR__.'/../bootload.php';
use Illuminate\Database\Capsule\Manager as DB;
use Crunz\Schedule;
use App\Services\Log;

$schedule = new Schedule();

// Get DB names from env file
$bi_db = $settings['bi_db']['database'];
$encore_db = $settings['encore_db']['database'];
$db = $settings['db']['database'];
$log = new Log();

try {
	try {
		// Fetch schedule details from the table for cron trigger
		$getReport = DB::connection('bi_db')->table("report_scheduled_config as rsc")
						->join("report_master as rm", "rm.report_name", "=", "rsc.report_name")
						->select("rsc.id", "rsc.cron_expr")
						->where([["rsc.report_trigger", 'cron'], ["rsc.is_active", 1]])
						->get()->toArray();

		$cronScheduleFile = __DIR__ . "/../cronScheduler.php";		
		$eventScheduleFile = __DIR__ . "/../eventScheduler.php";	

		forEach($getReport as $report) {
			$schedule->run("/usr/bin/php $cronScheduleFile ".$report->id)->cron($report->cron_expr);
		}

		// event trigger
		$schedule->run("/usr/bin/php $eventScheduleFile")->everyMinute();

		// Trigger mail for schedule error
		$schedule
		->onError(function(){
			throw new \Exception("Cron job is throwing error");
		});
	} catch(\Illuminate\Database\QueryException $e) {
		throw $e;	
	}
} catch(\Exception $e) {
	$log->reportLog(json_encode(["reason"=>$e->getMessage()]), "report_schedule_task");
}

return $schedule;