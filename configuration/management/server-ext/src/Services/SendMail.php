<?php
namespace App\Services;

class SendMail {
	function send($to, $subject, $message, $senderMail, $senderName, $files = []) {
	    $from = $senderName." <".$senderMail.">"; 
	    $headers = "From: $from";
	    //$headers = "From: myplace@example.com\r\n";
		$headers .= "Reply-To: myplace2@example.com";
		$headers .= "Return-Path: myplace@example.com";
		//$headers .= "CC: sombodyelse@example.com\r\n";
		//$headers .= "BCC: hidden@example.com\r\n";

	    // boundary 
	    $semi_rand = md5(time()); 
	    $mime_boundary = "==Multipart_Boundary_x{$semi_rand}x"; 

	    // headers for attachment 
	    $headers .= "\nMIME-Version: 1.0\n" . "Content-Type: multipart/mixed;\n" . " boundary=\"{$mime_boundary}\""; 

	    // multipart boundary 
	    $message = "--{$mime_boundary}\n" . "Content-Type: text/html; charset=\"UTF-8\"\n" .
	    "Content-Transfer-Encoding: 7bit\n\n" . $message . "\n\n"; 

	    // preparing attachments
	    if(count($files) > 0){
	        for($i=0;$i<count($files);$i++){
	            if(is_file($files[$i])){
	                $message .= "--{$mime_boundary}\n";
	                $fp =    @fopen($files[$i],"rb");
	                $data =  @fread($fp,filesize($files[$i]));
	                @fclose($fp);
	                $data = chunk_split(base64_encode($data));
	                $message .= "Content-Type: application/octet-stream; name=\"".basename($files[$i])."\"\n" . 
	                "Content-Description: ".basename($files[$i])."\n" .
	                "Content-Disposition: attachment;\n" . " filename=\"".basename($files[$i])."\"; size=".filesize($files[$i]).";\n" . 
	                "Content-Transfer-Encoding: base64\n\n" . $data . "\n\n";
	            }
	        }
	    }

	    $message .= "--{$mime_boundary}--";
	    $returnpath = "-f" . $senderMail;

	    //send email
	    $mail = @mail($to, $subject, $message, $headers, $returnpath); 

	    //function return true, if email sent, otherwise return fasle
	    if($mail){ 
	    	return TRUE; 
	    } else { 
	    	throw new \Exception("Mail is not send to $to mail ID - ". error_get_last()['message']);
	    }
	}
}