<?php
/**
 * Created by PhpStorm.
 * User: Shahal.Tharique
 * Date: 25-09-2016
 * Time: 18:18
 */
 
namespace App\Models;

class RepaymentReminder extends \Illuminate\Database\Eloquent\Model {
    protected $table = 'repayment_reminder';
    const TABLE_NAME = 'repayment_reminder';
    protected $guarded = [
        
    ];
    protected $fillable = [
        
    ];
    public $timestamps = false;
}