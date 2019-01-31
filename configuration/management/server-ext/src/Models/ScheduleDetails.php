<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class ScheduleDetails extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'individual_loan_schedule';
    const TABLE_NAME = 'individual_loan_schedule';
    public $timestamps = false;
}