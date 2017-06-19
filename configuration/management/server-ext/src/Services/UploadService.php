<?php

namespace App\Services;
use App\Core\Settings;
use App\Models\UploadTagMaster;
use App\Models\UploadTagAccountsHistory;
use App\Models\UploadTagAccounts;
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use PHPExcel_Style_NumberFormat;



class UploadService {


	public static function handleSecuritazation($rowData){

		echo "date".$rowData[3];
		if ($rowData[3] !=null && $rowData[3] !=="") {
            $rowData[3] = PHPExcel_Style_NumberFormat::toFormattedString($rowData[3],'YYYY-MM-DD' );
	    }

	    echo $rowData[1]." ".$rowData[2]." ". $rowData[3]."\n";

	    $UploadTagMaster = new UploadTagMaster();
	    $UploadTagAccountsHistory = new UploadTagAccountsHistory();
	    $UploadTagAccounts = new UploadTagAccounts();

		$UploadTagMasterdata = $UploadTagMaster::select('id','funder_name','remarks','effective_date')
						->where('funder_name', $rowData[1])
						->where('remarks', $rowData[2])
	      				->where('effective_date', $rowData[3])
	                    ->first();


	    if ($UploadTagMasterdata==null){
	    	$UploadTagMaster->funder_name = $rowData[1];
	    	$UploadTagMaster->remarks = $rowData[2];
	    	$UploadTagMaster->effective_date = $rowData[3];
	    	$UploadTagMaster->save();
	    	echo "New Data inserted"."\n";
	    }

	    $tag_id = $UploadTagAccounts::select('tag_id')
				  ->where('account_number', $rowData[0])
	  			  ->get();
	  	
	  	if(sizeof($tag_id)>0){
	      	echo $tag_id[0]['tag_id'];
	      	$UploadTagAccountsHistory->tag_id = $tag_id[0]['tag_id'];
	    	$UploadTagAccountsHistory->account_number = $rowData[0];
	    	$UploadTagAccountsHistory->save();
	    	$UploadTagMasterdata = $UploadTagMaster->select('id','funder_name','remarks','effective_date')
						->where('funder_name', $rowData[1])
						->where('remarks', $rowData[2])
	      				->where('effective_date', $rowData[3])
	                    ->first();

	    	$update = $UploadTagAccounts::where('account_number', '=', $rowData[0])
		    		  ->update(['tag_id' => $UploadTagMasterdata->id]);

		    

		    // echo "\n".$UploadTagMasterdata[0]['id']." Final Update : "."\n";
		     var_dump($UploadTagMasterdata->id);
		     var_dump($update);
	  	}
	}
}