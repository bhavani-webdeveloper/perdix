<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;
/**
 * Created by PhpStorm.
 * User: Karthik.Anandan
 * Date: 09-03-2017
 * Time: 10:12
 */

class Messages extends \Illuminate\Database\Eloquent\Model{

    protected $table = 'mstb_messages';
    const TABLE_NAME = 'mstb_messages';
    protected $guarded = [
        'id',
        'message_thread_id',
        'participant_id'
    ];

    protected $fillable = [
        'message','created_at'
    ];


    public $timestamps = false;

    public static function addMessage($message, $messageThreadId, $userId, $username){
        $repData = new Messages();
        $repData->message_thread_id = $messageThreadId;
        $repData->participant_id = $userId;
        $repData->message = $message;
        $repData->created_at = date('Y-m-d H:i:s');
        $repData->save();
        
        /* To update the branchId */
        $sql = 'UPDATE `mstb_participants` MessageParticipants set is_read = false where message_thread_id = :threadId and participant != :participant';
        $affected = DB::update($sql, [$messageThreadId, $username]);

        return $repData->toArray();
    }

    public static function archiveMessages($messageThreadId){

        $sql = 'insert into `mstb_messages_snapshot`(message_id, message_thread_id, participant_id, message, created_at) select id as message_id, message_thread_id, participant_id, message, created_at from mstb_messages where message_thread_id = :threadId';
        $insertAffected = DB::update($sql, [$messageThreadId]);

        if($insertAffected >0){
            $sql = 'delete from `mstb_messages` where message_thread_id = :threadId';
            $deleteAffected = DB::update($sql, [$messageThreadId]);
        }
        return true;
    }

}