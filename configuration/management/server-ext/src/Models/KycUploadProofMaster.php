<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class KycUploadProofMaster extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'putm_kyc_upload_proof_master';
    const TABLE_NAME = 'putm_kyc_upload_proof_master';
    public $timestamps = false;
}