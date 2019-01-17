<?php
namespace App\Scheduler;

use App\Scheduler\AbstractSchedule;
use App\Services\Log;

class EventSchedule extends AbstractSchedule {
	private $report;
	function __construct($report) {
		$this->report = $report;
	}

	public function schedule() {
		$log = new Log();
		$startDate = date("Y-m-d H:i:s"); // report process start time
		
		try {
	       // Download bulk report from server
			$parameter = $this->queryParameter($this->report->parameter);

			if(count($parameter)>0) {
				try {
					$this->generateReport($parameter, $this->report);

					// success log
					$logMessage = json_encode(["report_schedule_id"=>$this->report->id, "report_schedule_name"=>$this->report->report_name, "startDate"=>$startDate, "endDate"=>date("Y-m-d H:i:s")]);
					$log->reportLog($logMessage, 'report_schedule_event', 'Completed');

				} catch(\Exception $e) {
					throw $e;						
				}
			} else {
				throw new \Exception("Filter parameter is not available");			
			}
		} catch(\Exception $e) {
			$logMessage = json_encode(["report_schedule_id"=>$this->report->id, "report_schedule_name"=>$this->report->report_name, "startDate"=>$startDate, "endDate"=>date("Y-m-d H:i:s"), "reason"=>$e->getMessage()]);
			$log->reportLog($logMessage, 'report_schedule_event');

		}
	}
}