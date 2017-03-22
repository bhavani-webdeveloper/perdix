<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;
/**
 * Created by PhpStorm.
 * User: Shahal.Tharique
 * Date: 25-09-2016
 * Time: 18:18
 */

class Repayment extends \Illuminate\Database\Eloquent\Model{

    protected $table = 'ipmtb_repayment_details';
    const TABLE_NAME = 'ipmtb_repayment_details';
    protected $guarded = [
        'batchId',
        'id',
        'batchStatus',
        'demandDate',
        'branchId'
    ];

    protected $fillable = [
        'transactionId','valueDate','transactionDate','systemDateAndTime','accountId','entityId','sequenceNum','transactionName','part1','part2','part3','part4','part5','part6','amount1','amount2','amount3','description','userId','customerName','status','responseCode','payeeAccountId','param1','param2','instrument','reference'
    ];


    public $timestamps = false;

    public static function populateWithEntries($parsedArr, $query, $instrument){
        self::where('demandDate', $query['demandDate'])
            ->where('instrument', $instrument)
            ->delete();
        foreach ($parsedArr as $repayment){
            $repData = new Repayment();
            $repData->fill($repayment);
            $repData->demandDate = $query['demandDate'];
//            $repData->branchId = $query['branchId'];
            $repData->instrument = $instrument;
            $repData->save();
        }
        
        /* To update the branchId */
        $sql = 'UPDATE `ipmtb_repayment_details` Repayment set branchId = (select Loan.branch_id from loan_accounts Loan where Loan.account_number = Repayment.accountId) where demandDate = :demandDate and instrument = :ach';
        $affected = DB::update($sql, [$query['demandDate'], $instrument]);
    }
}