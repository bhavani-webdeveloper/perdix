<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class Customer extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'customer';
    const TABLE_NAME = 'customer';
    //public $timestamps = false;
}