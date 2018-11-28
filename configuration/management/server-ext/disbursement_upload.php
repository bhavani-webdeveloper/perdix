<?php


// Setting up config for PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// error_reporting(0);

include_once("bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\RequestOptions as MULTIPART;
use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Support\Facades\Storage;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\DisbursementReport;
use App\Models\DisbursementReportDetail;
use App\Models\KycUploadProofMaster;
use App\Services\PerdixService;
use App\Core\Settings;
use App\Models\Customer;


$perdixService= new PerdixService();
$perdixService->login();
$settings = Settings::getInstance()->getSettings();
$api_url = $settings['perdix']['v8_url'];

$authHeader = "Bearer ". $settings['perdix']['token'];
$url = $settings['perdix']['v8_url'] ;
$filePath=$settings['perdix']['disbursement_base_dir'];

$siteCode = DB::table('global_settings')->where('name', 'siteCode')->first();

echo "<br/> Tocken : ".$authHeader;
echo "<br/> Site Code : ".$siteCode->value;

// if ( 0777  !== (fileperms($filePath) & 0777)) {
//     die( "<br/> file is not writable and it has the following file permissions : $filePath" );
// } 


function activateLoanAccounts($id){
    global $url;
    global $authHeader;

    $client = new GuzzleClient();
	$reqRes = $client->request('GET', $url."/api/loanaccounts/activate/".$id, [
		    'headers' => [
			    'Authorization' => $authHeader
		    ],
		    'connect_timeout' => 3600,
		    'timeout' => 3600
	    ]);
}


function searchDisbursementByAccountNumber($param){
    global $url;
    global $authHeader;
    $client = new GuzzleClient();
	$reqRes = $client->request('GET', $url."/api/individualLoan/findDisbursement?currentStage=ReadyForDisbursement&".$param , [
		    'headers' => [
			    'Authorization' => $authHeader
		    ],
		    'connect_timeout' => 3600,
		    'timeout' => 3600
	    ]);
    $responseBody = $reqRes->getBody()->getContents();
    $parsedArr = \GuzzleHttp\json_decode($responseBody);
    return $parsedArr;
}

function getDisbursementListByLoanID($loan_id){
    global $url;
    global $authHeader;

    $client = new GuzzleClient();
	$reqRes = $client->request('GET', $url."/api/individualLoan/getDisbursementList?loanIdlist=".$loan_id, [
		    'headers' => [
			    'Authorization' => $authHeader
		    ],
		    'connect_timeout' => 3600,
		    'timeout' => 3600
	    ]);
    $responseBody = $reqRes->getBody()->getContents();
    $parsedArr = \GuzzleHttp\json_decode($responseBody);
    return $parsedArr;
}

function putDisbursement($api, $requestBody){
    global $url;
    global $authHeader;

    $client = new GuzzleClient();
    $reqRes = $client->request('PUT', $url."/api/individualLoan/".$api, [
            'headers' => [
                'Authorization' => $authHeader,
                'content-type' => 'application/json'
            ],
            'body' => json_encode($requestBody),
            'connect_timeout' => 3600,
            'timeout' => 3600
        ]);
    $responseBody = $reqRes->getBody()->getContents();
    $parsedArr = \GuzzleHttp\json_decode($responseBody, true);
    return $parsedArr;
}


$tempWipDir = $filePath . DIRECTORY_SEPARATOR . "Internal". DIRECTORY_SEPARATOR . "wip" . DIRECTORY_SEPARATOR;
$tempRejectedDir = $filePath . DIRECTORY_SEPARATOR . "Internal". DIRECTORY_SEPARATOR . "rejected" . DIRECTORY_SEPARATOR;
$tempCompletedDir = $filePath . DIRECTORY_SEPARATOR . "Internal". DIRECTORY_SEPARATOR . "completed" . DIRECTORY_SEPARATOR;


if (!is_dir($tempWipDir )) {
    mkdir($tempWipDir, 0777, true);
}
if (!is_dir($tempRejectedDir )) {
    mkdir($tempRejectedDir, 0777, true);
}
if (!is_dir($tempCompletedDir )) {
    mkdir($tempCompletedDir, 0777, true);
}

$files = new DirectoryIterator($filePath);

foreach ($files as $file) {

        //echo "<br/>". $file;

       // echo $partner . $file->getFilename();
        if ($file->isFile()) {
            echo "<br/>".$file;

            echo "<br/> temp : ". $tempCompletedDir;
            $source = $filePath . DIRECTORY_SEPARATOR . $file->getFilename();
            $dest = $tempWipDir . $file->getFilename();

            copy($source, $dest);
            $do =unlink($source);
            if($do=="1"){ 
                echo "<br/> The file was deleted successfully. : ".$source; 
            } else { 
                echo "<br/> There was an error trying to delete the file. : ".$source; 
            } 


            $inputFileName = $tempWipDir . $file->getFilename();
            echo "<br/>".$file." File Moved to ".$dest;
            //print_r( "<br/>inputFileName : ".$inputFileName);

            $ext = pathinfo($inputFileName, PATHINFO_EXTENSION);

            if ($ext != "xlsx" ) {
                $source = $tempWipDir .$file->getFilename();
                $dest = $tempRejectedDir . date("Y-m-d--H-i-s")."__". $file->getFilename();

                copy($source, $dest);
                unlink($source);
                echo "<br/>".$file." File Moved to ".$dest;
                continue;
            }
            try {
                $inputFileType = PHPExcel_IOFactory::identify($inputFileName);
                $objReader = PHPExcel_IOFactory::createReader($inputFileType);

                $objPHPExcel = $objReader->load($inputFileName);
                $sheet = $objPHPExcel->getSheet(0);
                $highestRow = $sheet->getHighestRow();
                $highestColumn = $sheet->getHighestColumn();


                //echo "<br/><br/>".$highestColumn;

                // if ($highestColumn != "G") {
                //     $source = $tempWipDir . $file->getFilename();
                //     $dest = $tempRejectedDir . $file->getFilename();
                //     copy($source, $dest);
                //     $do =unlink($source);
                //     if($do=="1"){ 
                //         echo "<br/> The file was deleted successfully. : ".$source; 
                //     } else { 
                //         echo "<br/> There was an error trying to delete the file. : ".$source; 
                //     } 
                //     continue;
                // }

                $disbursementReportMaster = new DisbursementReport();
                $disbursementReportMaster->filename =  $file->getFilename();
                $disbursementReportMaster->total_records = ($highestRow - 1);
                $disbursementReportMaster->failed_records = 0;
                $disbursementReportMaster->status = 'PROCESSING';
                $disbursementReportMaster->save();

                $failedCount = 0;
                $IdGenerated = $disbursementReportMaster->id;
                //var_dump($customerUploadMaster->toArray());

                //echo "<br/> File Upload for : " . $inputFileName . "\n";

                $content="";

                for ($row = 2; $row <= $highestRow; $row++) {
                     //echo '<br/> A' . $row . ':' . $highestColumn . $row;
                     $matrixData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row,
                         NULL,
                         TRUE,
                         FALSE);
                     $rowData = $matrixData[0];

                    try{


                        //echo "<br/>".$rowData;
                        //print_r($rowData);
                        $loanId = $rowData[1];
                        $accountNumber = $rowData[2];
                        $disbursementId = $rowData[6];
                        $modeOfDisbursement = $rowData[5];
                        $disbursementFromBankAccountNumber = $rowData[6];

                        activateLoanAccounts($rowData[2]);
                        $disbursementsSchedules=searchDisbursementByAccountNumber("accountNumber=".$accountNumber);
                        if(!$disbursementsSchedules[0])
                            throw new PDOException('Not Found Disbursement by account number : '.$accountNumber);

                        $loanAccountDisbursementSchedule = $disbursementsSchedules[0];

                        $disbursements = getDisbursementListByLoanID($loanId);  
                        if(!$disbursements[0])
                            throw new PDOException('Not Found Disbursement by loan ID : '.$loanId);
                        
                        $disbursement= $disbursements[0];
                    
                        $loanAccountDisbursementSchedule->accountNumber=  $disbursement->accountId;
                        $loanAccountDisbursementSchedule->feeAmountPayment =$disbursement->feeAmountPayment;
                        $loanAccountDisbursementSchedule->penalInterestDuePayment= $disbursement->penalInterestDuePayment;
                        $loanAccountDisbursementSchedule->normalInterestDuePayment =$disbursement->normalInterestDuePayment;
                        $loanAccountDisbursementSchedule->principalDuePayment = $disbursement->principalDuePayment;
                        $loanAccountDisbursementSchedule->linkedAccountNumber = $disbursement->linkedAccountNumber;

                        $loanAccountDisbursementSchedule->linkedAccountTotalFeeDue= ($disbursement->linkedAccountTotalFeeDue- $disbursement->linkedAccountPreclosureFee) ;
                        $loanAccountDisbursementSchedule->linkedAccountPreclosureFee =$disbursement->linkedAccountPreclosureFee;
                        $loanAccountDisbursementSchedule->linkedAccountPenalInterestDue = $disbursement->linkedAccountPenalInterestDue;
                        $loanAccountDisbursementSchedule->linkedAccountNormalInterestDue = $disbursement->linkedAccountNormalInterestDue;
                        $loanAccountDisbursementSchedule->linkedAccountTotalPrincipalDue = $disbursement->linkedAccountTotalPrincipalDue;

                        $loanAccountDisbursementSchedule->disbursementFromBankAccountNumber = $disbursementFromBankAccountNumber;
                        $loanAccountDisbursementSchedule->modeOfDisbursement = $modeOfDisbursement;
                        $loanAccountDisbursementSchedule->overrideStatus = "Requested";
                        $loanAccountDisbursementSchedule->firstRepaymentDate = $disbursement->firstRepaymentDate;
                        $loanAccountDisbursementSchedule->disbursementAmount = $disbursement->netDisbursementAmount;
                        $loanAccountDisbursementSchedule->modeOfDisbursement =  $modeOfDisbursement;

                        
                        $reqBodyForUpdate = (object) [
                            'disbursementProcessAction' => "SAVE",
                            "stage" => "DisbursementConfirmation",
                            "loanAccountDisbursementSchedule" =>$loanAccountDisbursementSchedule,
                        ];
                        putDisbursement("updateDisbursement", $reqBodyForUpdate);

                        $reqBodyForBatch= (object) [
                            "stage" => "DisbursementConfirmation",
                            "loanAccountDisbursementSchedules" => collect([$loanAccountDisbursementSchedule]),
                        ];
                        
                        putDisbursement("batchDisbursement", $reqBodyForBatch);


                        //echo json_encode($reqBody);
                        //updateDisbursement($reqBody);
                        //api calling     

                        //throw new PDOException('File is Failed : ');
                         $disbursementReportDetail = new DisbursementReportDetail();
                         $disbursementReportDetail->master_id = $IdGenerated;
                         $disbursementReportDetail->account_number = $rowData[2] ;
                         $disbursementReportDetail->partner_loan_id = $rowData[1] ;
                         $disbursementReportDetail->is_processed = true;
                         $disbursementReportDetail->status = 'SUCCESS';
                         $disbursementReportDetail->error_response = 'NA';
                         $disbursementReportDetail->save();
    
                    }catch(Exception $e1)
                    {
                        echo "<br/> errorMessage :  ".$e1->getMessage();
                        $disbursementReportDetail = new DisbursementReportDetail();
                        $disbursementReportDetail->master_id = $IdGenerated;
                        $disbursementReportDetail->account_number = $rowData[2] ;
                        $disbursementReportDetail->partner_loan_id = $rowData[1] ;
                        $disbursementReportDetail->is_processed = true;
                        $disbursementReportDetail->status = 'FAILED';
                        $disbursementReportDetail->error_response = $e1->getMessage();
                        $disbursementReportDetail->save();
                        $failedCount++;
                      
                    }
                 }
            //     // End LooP
                $disbursementReportMaster->failed_records = $failedCount;
                $disbursementReportMaster->status = 'PROCESSED';
                $disbursementReportMaster->save();

                if (!is_dir($tempCompletedDir )) {
                    mkdir($tempCompletedDir, 0777, true);
                }

                $source = $tempWipDir . $file->getFilename();
                $dest = $tempCompletedDir .$file->getFilename();
                copy($source, $dest);
                unlink($source);
                echo "<br/>".$file." File Moved to ".$dest;

        
             } catch (Exception $e) {
                echo "<br/>".$e;
                $source = $tempWipDir . $file->getFilename();
                $dest = $tempRejectedDir . $file->getFilename();
                copy($source, $dest);
                unlink($source);
                echo "<br/>".$file." File Moved to ".$dest;
                continue;
                //throw $e;
            }
    }
}