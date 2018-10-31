<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class KycUploadDetail extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'putb_kyc_upload_details';
    const TABLE_NAME = 'putb_kyc_upload_details';
    public $timestamps = false;
}