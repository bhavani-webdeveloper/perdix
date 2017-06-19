<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class UploadTagMaster extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'tag_master';
    const TABLE_NAME = 'tag_master';
    public $timestamps = false;
}