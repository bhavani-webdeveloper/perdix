<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class Leads extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'leads';
    const TABLE_NAME = 'leads';
    public $timestamps = false;
    protected $connection = 'financialForms';
}