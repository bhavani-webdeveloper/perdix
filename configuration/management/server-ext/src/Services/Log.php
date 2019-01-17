<?php

namespace App\Services;
use Illuminate\Database\Capsule\Manager as DB;

class Log {
	public function reportLog($log, $module = NULL, $status='Failed') {
		DB::connection("bi_db")->table('report_log')->insert(['module'=>$module, 'log'=>$log,'status'=>$status]);
	}
}