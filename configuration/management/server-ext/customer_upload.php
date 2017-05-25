<?php

include_once("bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\CustomerUploadMaster;
use App\Models\CustomerUploadDetail;
	

$authHeader= "Bearer 28c0ea89-8bdb-42fe-b3f8-6989dc2f7c04";
$url = $settings['perdix']['v8_url'] . "/api/enrollments";

$tempDir = "C:\\Users\\anchit.raj\\Desktop\\TESTExcel\\";
$files = new DirectoryIterator("C:\Users\anchit.raj\Desktop\TESTExcel");
$tempWipDir = "C:\\Users\\anchit.raj\\Desktop\\CustomerWIP\\";

foreach ($files as $file) {
	if ($file->isFile()) {
		$source = $tempDir.$file->getFilename();
		$dest = $tempWipDir.$file->getFilename();	
	    copy($source, $dest);
	    unlink( $source );
	}
}

foreach (new DirectoryIterator("C:\Users\anchit.raj\Desktop\CustomerWIP") as $file) {
  if ($file->isFile()) {
      $inputFileName = $tempWipDir.$file->getFilename() ;	
      try {
      	$inputFileType = PHPExcel_IOFactory::identify($inputFileName);
    	$objReader = PHPExcel_IOFactory::createReader($inputFileType);
    	$objPHPExcel = $objReader->load($inputFileName);

    	$sheet = $objPHPExcel->getSheet(0);
		$highestRow = $sheet->getHighestRow();
		$highestColumn = $sheet->getHighestColumn();

	    $customerUploadMaster = new CustomerUploadMaster();
        $customerUploadMaster->filename = $inputFileName;
        $customerUploadMaster->total_records = ($highestRow-1);
        $customerUploadMaster->failed_records = 0;
        $customerUploadMaster->status = 'PROCESSING';
        $customerUploadMaster->save();
        $failedCount = 0;		
		$IdGenerated = $customerUploadMaster->id;
		var_dump($customerUploadMaster->toArray());

      	echo "File Upload for : " .$inputFileName."\n";

		for ($row = 2 ; $row <= $highestRow; $row++){
	   		$rowData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row,
	        NULL,
	        TRUE,
	        FALSE);
   			echo $rowData[0][4];

		     $customerData = array(
				'partnerCode' => $rowData[0][0],
				'firstName'    =>  $rowData[0][1],
				'customerType'  =>  $rowData[0][2],
				'oldCustomerId' =>  $rowData[0][3],
				'dateOfBirth' =>  $rowData[0][4],
				'gender'    => $rowData[0][5],
				'maritalStatus'    => $rowData[0][6],
				'panNo'    => $rowData[0][7],
				'aadhaarNo'    => $rowData[0][8],
				'identityProof'    => $rowData[0][9],
				'identityProofNo'    => $rowData[0][10],
		        'addressProof'    => $rowData[0][11],
		        'addressProofNo'    => $rowData[0][12],	
		        'businessConstitution'    => $rowData[0][13],
		        'companyOperatingSince'    => $rowData[0][14],
		        'registrationType'    => $rowData[0][15],
		        'registrationNumber'    => $rowData[0][16],
		        'doorNo'    => $rowData[0][17],
		        'street'    => $rowData[0][18],
		        'landmark'    => $rowData[0][19],
		        'state'    => $rowData[0][20],
		        'district'    => $rowData[0][21],
		        'landLineNo'    => $rowData[0][22],
		        'mobilePhone'    => $rowData[0][23]
				
				);

			$customerSave  = array(
				'customer'    =>  $customerData,
				'enrollmentAction' => "SAVE"
				);

			try {
				$client = new GuzzleClient();
				$reqRes = $client->request('POST', $url, [
					'headers' => [
						'Authorization' => $authHeader,
						'content-type' => 'application/json'
					],
					'body' => json_encode($customerSave),
					'connect_timeout' => 3600,
					'timeout' => 3600
				]);
				$responseBody = $reqRes->getBody()->getContents();
				$parsedArr = \GuzzleHttp\json_decode($responseBody, true);
				
				$CustomerUploadDetail = new CustomerUploadDetail();
	        	$CustomerUploadDetail->master_id = $IdGenerated;
	        	$customerUploadDetail->customer_id = $customerData["oldCustomerId"];
	        	$customerUploadDetail->customer_name = $customerData["firstName"];
	        	$CustomerUploadDetail->is_processed = true;
	        	$CustomerUploadDetail->status = 'SUCCESS';
	        	$CustomerUploadDetail->request_json = 'NA';
	        	$CustomerUploadDetail->error_response = 'NA';
	        	$CustomerUploadDetail->save();
	        	
			} catch (Exception $e) {
				echo "File Exception Captured : " .$inputFileName."\n";
				$customerUploadDetail = new CustomerUploadDetail();
	        	$customerUploadDetail->master_id = $IdGenerated;
	        	$customerUploadDetail->customer_id = $customerData["oldCustomerId"];
	        	$customerUploadDetail->customer_name = $customerData["firstName"];
	        	$customerUploadDetail->is_processed = true;
	        	$customerUploadDetail->status = 'FAILED';
	        	$customerUploadDetail->request_json = json_encode($customerSave);
	        	$customerUploadDetail->error_response = '';
	        	$customerUploadDetail->save();	
	        	var_dump($customerUploadDetail->toArray());
	        	$failedCount++;

	        	json_encode($customerSave);
			}
		};	

      	$customerUploadMaster->failed_records = $failedCount;
        $customerUploadMaster->status = 'PROCESSED';
        $customerUploadMaster->save();

      } catch (Exception $e) {
      	throw $e;
      }
     
  }
}

