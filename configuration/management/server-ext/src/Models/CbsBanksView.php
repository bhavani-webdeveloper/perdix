<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class CbsBanksView extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'cbs_banks';
    const TABLE_NAME = 'cbs_banks';
    public $timestamps = false;
    
    protected $connection = 'financialForms';
}
