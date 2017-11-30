<?php

namespace App\Models\Messaging;

class Message extends \Illuminate\Database\Eloquent\Model {
    protected $table = 'ms_message';
    const TABLE_NAME = 'ms_message';
    // protected $guarded = [];
    protected $fillable = [];
    public $timestamps = false;
}