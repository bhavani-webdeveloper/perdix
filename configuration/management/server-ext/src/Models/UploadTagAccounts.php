<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class UploadTagAccounts extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'tag_accounts';
    const TABLE_NAME = 'tag_accounts';
    public $timestamps = false;

    protected $connection = 'bi_db';
}