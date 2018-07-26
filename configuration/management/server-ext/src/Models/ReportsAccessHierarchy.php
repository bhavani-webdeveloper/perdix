<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class ReportsAccessHierarchy extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'reports_access_hierarchy';
    const TABLE_NAME = 'reports_access_hierarchy';
    protected $connection = 'bi_db';
    public $timestamps = false;
}