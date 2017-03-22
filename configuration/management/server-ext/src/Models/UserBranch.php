<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;
/**
 * Created by PhpStorm.
 * User: Shahal.Tharique
 * Date: 25-09-2016
 * Time: 18:18
 */

class UserBranch extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'user_branches';
    const TABLE_NAME = 'user_branches';
    protected $guarded = [
        
    ];

    protected $fillable = [
        
    ];

    public $timestamps = false;

    public function branch(){
        return $this->belongsTo('App\Models\Branch', 'branch_id', 'id')
            ->select(['id', 'branch_name', 'branch_code']);
    }
}