<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class ReportParameterMapping extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'report_parameter_mapping';
    const TABLE_NAME = 'report_parameter_mapping';
    public $timestamps = false;
}
