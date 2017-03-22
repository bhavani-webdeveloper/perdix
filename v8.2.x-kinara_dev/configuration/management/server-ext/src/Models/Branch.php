<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;
/**
 * Created by PhpStorm.
 * User: Shahal.Tharique
 * Date: 25-09-2016
 * Time: 18:18
 */

class Branch extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'branch_master';
    const TABLE_NAME = 'branch_master';
    protected $guarded = [
        
    ];
    protected $fillable = [
        
    ];
    public $timestamps = false;
}