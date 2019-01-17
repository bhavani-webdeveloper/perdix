<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;

class LeadsSnapshot extends \Illuminate\Database\Eloquent\Model {

    protected $table = 'leads_snapshot';
    const TABLE_NAME = 'leads_snapshot';
    public $timestamps = false;
	protected $guarded = [        
    ];
    protected $fillable = [        
    ];
}