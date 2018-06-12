<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class ReportMaster extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'report_master';
    const TABLE_NAME = 'report_master';
    public $timestamps = false;
}