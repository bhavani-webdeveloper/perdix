<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class DisbursementReportDetail extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'putb_disbursement_upload_details';
    const TABLE_NAME = 'putb_disbursement_upload_details';
    public $timestamps = false;
}