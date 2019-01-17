<?php
namespace App\Scheduler;
use App\Scheduler\CronSchedule;
use App\Scheduler\EventSchedule;

class SchedulerFactory {
	public static function getInstance($report = null) {

		// Mapping the scheduler type with namespace
		$schedulerList = array('cron' => 'App\Scheduler\CronSchedule', 'event' => 'App\Scheduler\EventSchedule' );

		if(!is_object($report) || !array_key_exists($report->report_trigger, $schedulerList)) {
			throw new \Exception("Invalid schedule type");			
		} else {
			$className = $schedulerList[$report->report_trigger];
			if(class_exists($className)) {
				return new $className($report); // return the object
			} else {
				throw new \Exception("$className schedule type is not exist");				
			}
		}
	}
}
