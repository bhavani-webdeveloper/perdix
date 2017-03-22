<?php

namespace App\Models;

use Illuminate\Database\Capsule\Manager as DB;
/**
 * Created by PhpStorm.
 * User: Karthik.Anandan
 * Date: 09-03-2017
 * Time: 10:12
 */

class MessageParticipants extends \Illuminate\Database\Eloquent\Model{

    protected $table = 'mstb_participants';
    const TABLE_NAME = 'mstb_participants';
    protected $guarded = [
        'id',
        'message_thread_id'
    ];

    protected $fillable = [
        'participant','participant_name','last_read_at','is_read'
    ];


    public $timestamps = false;

    public static function createParticipant($input, $message_thread_id, $username){
        $response = [];
        foreach ($input['messageThreads']['messageParticipants'] as $messageParticipants) {
            $repData = new MessageParticipants();
            $repData->fill($messageParticipants);
            $repData->message_thread_id = $message_thread_id;
            if($repData->participant==$username){
                $repData->is_read=true;    
            } else {
                $repData->is_read=false;
            }
            $repData->save();
            $response[]=$repData->toArray();
        }
        return $response;
    }

    public static function addParticipant($message_thread_id, $participant, $participantName){
        // $response = [];
        $repData = new MessageParticipants();
        $repData->message_thread_id = $message_thread_id;
        $repData->participant = $participant;
        $repData->participant_name = $participantName;
        $repData->is_read=false;
        $repData->save();
        return $repData;
        // $response[]=$repData->toArray();
        // return $response;
    }

    public static function archiveParticipant($messageThreadId){

        $sql = 'insert into `mstb_participants_snapshot`(participant_id, message_thread_id, participant, participant_name, last_read_at, is_read) select id as participant_id, message_thread_id, participant, participant_name, last_read_at, is_read from mstb_participants where message_thread_id = :threadId';
        $insertAffected = DB::update($sql, [$messageThreadId]);

        if($insertAffected >0){
            $sql = 'delete from `mstb_participants` where message_thread_id = :threadId';
            $deleteAffected = DB::update($sql, [$messageThreadId]);
        }
        return true;
    }

}