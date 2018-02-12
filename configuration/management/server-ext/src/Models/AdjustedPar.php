<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class AdjustedPar extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'adjusted_par';
    const TABLE_NAME = 'adjusted_par';
    protected $connection = 'bi_db';
    public $timestamps = false;
}



