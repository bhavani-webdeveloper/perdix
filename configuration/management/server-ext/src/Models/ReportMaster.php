<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class ReportMaster extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'report_master';
    const TABLE_NAME = 'report_master';
    protected $connection = 'bi_db';
    public $timestamps = false;
}