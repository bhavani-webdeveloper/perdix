<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class UploadTagAccountsHistory extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'tag_accounts_history';
    const TABLE_NAME = 'tag_accounts_history';
    public $timestamps = false;
}