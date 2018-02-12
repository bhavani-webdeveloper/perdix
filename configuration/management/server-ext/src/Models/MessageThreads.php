<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;
/**
 * Created by PhpStorm.
 * User: Karthik.Anandan
 * Date: 09-03-2017
 * Time: 10:12
 */

class MessageThreads extends \Illuminate\Database\Eloquent\Model{

    protected $table = 'mstb_threads';
    const TABLE_NAME = 'mstb_threads';
    protected $guarded = [
        'id'
    ];

    protected $fillable = [
        'title','reference_no', 'reference_type'
    ];


    public $timestamps = false;

    public static function createThread($input, $username){
        $repData = new MessageThreads();
        $repData->fill($input['messageThreads']);
        $repData->created_at = date('Y-m-d H:i:s');
		$repData->created_by = $username;
        $repData->save();
        return $repData->toArray();
    }

    public static function archiveMessageThread($messageThreadId){

        $sql = 'insert into `mstb_threads_snapshot`(thread_id, title, reference_no, reference_type, is_closed, closed_at, created_by, created_at) select id as thread_id, title, reference_no, reference_type, is_closed, closed_at, created_by, created_at from mstb_threads where id = :threadId';
        $insertAffected = DB::update($sql, [$messageThreadId]);

        if($insertAffected >0){
            $sql = 'delete from `mstb_threads` where id = :threadId';
            $deleteAffected = DB::update($sql, [$messageThreadId]);
        }
        return true;
    }



}