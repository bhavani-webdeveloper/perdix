<?php

include_once("bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\LoanUploadDetail;
use App\Models\LoanProcessUploadMaster;
use App\Models\Customer;

$authHeader= "Bearer 11a2617b-49fd-4533-a0a2-f8c45f17df67";
$url = $settings['perdix']['v8_url'] . "/api/individualLoan";

// $fi = new FilesystemIterator("C:\Users\anchit.raj\Desktop\TESTExcelLoan", FilesystemIterator::SKIP_DOTS);
// printf("There were %d Files", iterator_count($fi));

$tempDir = "C:\\Users\\anchit.raj\\Desktop\\TESTExcelLoan\\";
$tempWipDir = "C:\\Users\\anchit.raj\\Desktop\\WIP\\";
$files = new DirectoryIterator("C:\Users\anchit.raj\Desktop\TESTExcelLoan");

foreach ($files as $file) {
	if ($file->isFile()) {
		$source = $tempDir.$file->getFilename();
		$dest = $tempWipDir.$file->getFilename();
	    copy($source, $dest);
	    unlink( $source );

	}
}

foreach (new DirectoryIterator("C:\Users\anchit.raj\Desktop\WIP") as $file) {
  if ($file->isFile()) {
      $inputFileName = $tempWipDir.$file->getFilename(); 
      try {
      	$inputFileType = PHPExcel_IOFactory::identify($inputFileName);
    	$objReader = PHPExcel_IOFactory::createReader($inputFileType);
    	$objPHPExcel = $objReader->load($inputFileName);

    	$sheet = $objPHPExcel->getSheet(0);
		$highestRow = $sheet->getHighestRow();
		$highestColumn = $sheet->getHighestColumn();

		$loanProcessUploadMaster = new LoanProcessUploadMaster();
        $loanProcessUploadMaster->filename = $inputFileName;
        $loanProcessUploadMaster->total_records = ($highestRow-1);
        $loanProcessUploadMaster->failed_records = 0;
        $loanProcessUploadMaster->status = 'PROCESSING';
        $loanProcessUploadMaster->save();

        $failedCount = 0;		
		$IdGenerated = $loanProcessUploadMaster->id;
		//var_dump($loanProcessUploadMaster->toArray());

      	echo "File Upload for : " .$inputFileName."\n";

		for ($row = 2 ; $row <= $highestRow; $row++){
			echo "File Upload for : ".$file->getFilename()."\n";	
	   		$rowData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row,
	        NULL,
	        TRUE,
	        FALSE);
   			echo $rowData[0][4];

   			$customerTb = new Customer();
   			$id = $customerTb::where('old_customer_id',$rowData[0][4])->select('id')->get();
   			$urn = $customerTb::where('old_customer_id',$rowData[0][3])->select('urn_no')->get();

   			echo $urn[0]["urn_no"]."\n"."\n";
   			echo $id[0]["id"]."\n"."\n";

		     $loanData = array(
				'productCode' => $rowData[0][0],
				'partnerCode'    =>  $rowData[0][1],
				'oldAccountNO'  =>  $rowData[0][2],
				'applicant' =>  $urn[0]["urn_no"],
				'customerId' => $id[0]["id"],
				// 'coApplicant'    => $rowData[0][5],
				// 'COAPPLICANT2ID'    => $rowData[0][6],
				// 'guarantors'    => $rowData[0][7],
				// 'GUARANTOR2ID'    => $rowData[0][8],
				'loanApplicationDate'    => $rowData[0][9],
				'tenure'    => $rowData[0][10],
		        'loanPurpose1'    => $rowData[0][11],
		        'loanPurpose2'    => $rowData[0][12],	
		        'loanDisbursementDate'    => $rowData[0][13],
		        'disbursedAmountInPaisa'    => $rowData[0][14],
		        // 'SCHEDULESTARTDATE'    => $rowData[0][15],
		        'firstRepaymentDate'    => $rowData[0][16],
		        "INTERESTRATE" => $rowData[0][17],
		        // 'FIXEDINTEREST'    => $rowData[0][18],
		        // 'RELATIONSHIPTYPEOFAPPLICANT'    => $rowData[0][19],
		        // 'RELATIONSHIPTYPEOFCOAPPLICANT1'    => $rowData[0][20],
		        // 'RELATIONSHIPTYPEOFCOAPPLICANT2'    => $rowData[0][21],
		        'frequency'    => $rowData[0][22],
		        'processingFeePercentage'    => $rowData[0][23],
		        'processingFeeInPaisa'    => $rowData[0][24],
		        // 'FEECOMPONENT1'    => $rowData[0][25],
		        // 'FEECOMPONENT2'    => $rowData[0][26]
		        "documentTracking" =>  "PENDING",
    			"loanAmountRequested" =>  $rowData[0][14],
    			"isRestructure" =>  false,
    			"psychometricCompleted" =>  "N"
				);

			$loanSave  = array(
				'loanAccount'    =>  $loanData,
				'loanProcessAction' => "SAVE"
				);

			try {
				$client = new GuzzleClient();
				$reqRes = $client->request('POST', $url, [
					'headers' => [
						'Authorization' => $authHeader,
						'content-type' => 'application/json'
					],
					'body' => json_encode($loanSave),
					'connect_timeout' => 3600,
					'timeout' => 3600
				]);
				$responseBody = $reqRes->getBody()->getContents();
				$parsedArr = \GuzzleHttp\json_decode($responseBody, true);

				$loanUploadDetail = new LoanUploadDetail();
	        	$loanUploadDetail->master_id = $IdGenerated;
	        	$loanUploadDetail->customer_id = $loanData["customerId"];
	        	$loanUploadDetail->account_number = $loanData["oldAccountNO"];
	        	$loanUploadDetail->is_processed = true;
	        	$loanUploadDetail->status = 'SUCCESS';
	        	$loanUploadDetail->request_json = "NA";
	        	$loanUploadDetail->error_response = "NA";
	        	$loanUploadDetail->save();
				echo "Loan Process Success : " .$responseBody."\n"."\n";
			} catch (Exception $e) {
				echo "File Exception Captured : " .$inputFileName."\n";	
				echo json_encode($loanSave);
				throw $e;
				$loanUploadDetail = new LoanUploadDetail();
	        	$loanUploadDetail->master_id = $IdGenerated;
	        	$loanUploadDetail->customer_id = $loanData["customerId"];
	        	$loanUploadDetail->account_number = $loanData["oldAccountNO"];
	        	$loanUploadDetail->is_processed = true;
	        	$loanUploadDetail->status = 'FAILED';
	        	$loanUploadDetail->request_json = json_encode($loanSave);
	        	$loanUploadDetail->error_response = "";
	        	$loanUploadDetail->save();	

				$failedCount++;
			}

			
		};	
		$loanProcessUploadMaster->id = $IdGenerated;
      	$loanProcessUploadMaster->failed_records = $failedCount;
        $loanProcessUploadMaster->status = 'PROCESSED';
        $loanProcessUploadMaster->save();
        var_dump($loanProcessUploadMaster->toArray());

      } catch (Exception $e) {
      	throw $e;
      }
  }
}

   