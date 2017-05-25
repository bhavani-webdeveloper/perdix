<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class LoanUploadDetail extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'putb_loan_upload_details';
    const TABLE_NAME = 'putb_loan_upload_details';
    public $timestamps = false;
}