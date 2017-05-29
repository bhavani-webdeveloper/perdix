<?php

include_once("bootload.php");
use App\Core\Settings;
use App\Services\PerdixService;
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\LoanUploadDetail;
use App\Models\LoanProcessUploadMaster;
use App\Models\Customer;

$perdixService= new PerdixService();
$perdixService->login();
$settings = Settings::getInstance()->getSettings();

$authHeader = "Bearer ". $settings['perdix']['token'];
$url = $settings['perdix']['v8_url'] . "/api/individualLoan";

$baseUrl = $settings['perdix']['individual_loan_upload_path'];

$tempToBeProcessed = $baseUrl . DIRECTORY_SEPARATOR . "to_be_processed" . DIRECTORY_SEPARATOR;
$tempWipDir = $baseUrl . DIRECTORY_SEPARATOR . "wip" . DIRECTORY_SEPARATOR;
$tempRejectedDir = $baseUrl . DIRECTORY_SEPARATOR . "rejected" . DIRECTORY_SEPARATOR;
$tempCompletedDir = $baseUrl . DIRECTORY_SEPARATOR . "completed" . DIRECTORY_SEPARATOR;

$files = new DirectoryIterator($tempToBeProcessed);


foreach ($files as $file) {
    if ($file->isFile()) {
        $source = $tempToBeProcessed . $file->getFilename();
        $dest = $tempWipDir . $file->getFilename();
        copy($source, $dest);
        unlink($source);
        $inputFileName = $tempWipDir . $file->getFilename();
        $ext = pathinfo($inputFileName, PATHINFO_EXTENSION);
        echo $ext . "\n";
        if ($ext != "xlsx") {
            $source = $tempWipDir . $file->getFilename();
            $dest = $tempRejectedDir . $file->getFilename();
            copy($source, $dest);
            unlink($source);
            continue;
        }
        try {
            $inputFileType = PHPExcel_IOFactory::identify($inputFileName);
            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
            $objPHPExcel = $objReader->load($inputFileName);

            $sheet = $objPHPExcel->getSheet(0);
            $highestRow = $sheet->getHighestRow();
            $highestColumn = $sheet->getHighestColumn();
            echo $highestColumn . "\n";

            if ($highestColumn != "AA") {
                $source = $tempWipDir . $file->getFilename();
                $dest = $tempRejectedDir . $file->getFilename();
                copy($source, $dest);
                unlink($source);
                continue;
            }

            $loanProcessUploadMaster = new LoanProcessUploadMaster();
            $loanProcessUploadMaster->filename = $inputFileName;
            $loanProcessUploadMaster->total_records = ($highestRow - 1);
            $loanProcessUploadMaster->failed_records = 0;
            $loanProcessUploadMaster->status = 'PROCESSING';
            $loanProcessUploadMaster->save();

            $failedCount = 0;
            $IdGenerated = $loanProcessUploadMaster->id;
            //var_dump($loanProcessUploadMaster->toArray());

            echo "File Upload for : " . $inputFileName . "\n";

            for ($row = 2; $row <= $highestRow; $row++) {
                echo "File Upload for : " . $file->getFilename() . "\n";
                $matrixData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row,
                    NULL,
                    TRUE,
                    FALSE);

                $rowData = $matrixData[0];

                $customerTb = new Customer();

                $oldCustomerIds = array(
                    'applicant' => $rowData[3],
                    'co-applicant1' => $rowData[5],
                    'co-applicant2' => $rowData[6],
                    'guarantor1' => $rowData[7],
                    'guarantor2' => $rowData[8],
                    'customer' => $rowData[4]
                );

                $pCustomers = Customer::select('id', 'urn_no', 'old_customer_id')
                    ->whereIn('old_customer_id', array_values($oldCustomerIds))
                    ->whereNotNull('old_customer_id')
                    ->get();

                $pCustMapping = [];
                foreach($pCustomers as $c){
                    $pCustMapping[$c->old_customer_id] = $c->toArray();
                }

                $loanCustomerRelations = array();

                if (array_key_exists($oldCustomerIds['applicant'], $pCustMapping)){
                    $loanCustomerRelations[] = [
                        'customerId' => $pCustMapping[$oldCustomerIds['applicant']]['id'],
                        'relation' => 'Applicant'
                    ];
                }

                if ($oldCustomerIds['co-applicant1']!=null && array_key_exists($oldCustomerIds['co-applicant1'], $pCustMapping)){
                    $loanCustomerRelations[] = [
                        'customerId' => $pCustMapping[$oldCustomerIds['co-applicant1']]['id'],
                        'relation' => 'Co-Applicant'
                    ];
                }

                if ($oldCustomerIds['co-applicant2']!=null && array_key_exists($oldCustomerIds['co-applicant2'], $pCustMapping)){
                    $loanCustomerRelations[] = [
                        'customerId' => $pCustMapping[$oldCustomerIds['co-applicant2']]['id'],
                        'relation' => 'Co-Applicant'
                    ];
                }

                if ($oldCustomerIds['guarantor1']!=null && array_key_exists($oldCustomerIds['guarantor1'], $pCustMapping)){
                    $loanCustomerRelations[] = [
                        'customerId' => $pCustMapping[$oldCustomerIds['guarantor1']]['id'],
                        'relation' => 'Guarantor'
                    ];
                }

                if ($oldCustomerIds['guarantor2']!=null && array_key_exists($oldCustomerIds['guarantor2'], $pCustMapping)){
                    $loanCustomerRelations[] = [
                        'customerId' => $pCustMapping[$oldCustomerIds['guarantor2']]['id'],
                        'relation' => 'Guarantor'
                    ];
                }

                $scheduledStartDate = new DateTime($rowData[15]);
                $disbursementDate = new DateTime($rowData[13]);
                $moratoriumPeriodInDays = $scheduledStartDate->diff($disbursementDate)->format("%a");

                $loanData = array(
                    'productCode' => $rowData[0],
                    'partnerCode' => $rowData[1],
                    'oldAccountNO' => $rowData[2],
                    'applicant' => $pCustMapping[$oldCustomerIds['applicant']]['urn_no'],
                    'customerId' => $pCustMapping[$oldCustomerIds['customer']]['id'],
                    'loanApplicationDate' => $rowData[9],
                    'tenure' => $rowData[10],
                    'loanPurpose1' => $rowData[11],
                    'loanPurpose2' => $rowData[12],
                    'loanDisbursementDate' => $rowData[13],
                    'disbursedAmountInPaisa' => $rowData[14],
                    'moratoriumPeriodInDays' => $moratoriumPeriodInDays,
                    'firstRepaymentDate' => $rowData[16],
                    "INTERESTRATE" => $rowData[17],
                    // 'FIXEDINTEREST'    => $rowData[18],
                    'frequency' => $rowData[22],
                    'processingFeePercentage' => $rowData[23],
                    'processingFeeInPaisa' => $rowData[24],
                    // 'FEECOMPONENT1'    => $rowData[25],
                    // 'FEECOMPONENT2'    => $rowData[26]
                    "documentTracking" => "PENDING",
                    "loanAmountRequested" => $rowData[14],
                    "isRestructure" => false,
                    "psychometricCompleted" => "N",
                    "loanCustomerRelations" => $loanCustomerRelations
                );

                $loanSave = array(
                    'loanAccount' => $loanData,
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
                    echo "Loan Process Success : " . $responseBody . "\n" . "\n";
                } catch (Exception $e) {
                    echo "File Exception Captured : " . $inputFileName . "\n";
                    echo json_encode($loanSave);
                    $loanUploadDetail = new LoanUploadDetail();
                    $loanUploadDetail->master_id = $IdGenerated;
                    $loanUploadDetail->customer_id = $loanData["customerId"];
                    $loanUploadDetail->account_number = $loanData["oldAccountNO"];
                    $loanUploadDetail->is_processed = true;
                    $loanUploadDetail->status = 'FAILED';
                    $loanUploadDetail->request_json = json_encode($loanSave);
                    $loanUploadDetail->error_response = $parsedArr;
                    $loanUploadDetail->save();

                    $failedCount++;
                }


            };
            $loanProcessUploadMaster->id = $IdGenerated;
            $loanProcessUploadMaster->failed_records = $failedCount;
            $loanProcessUploadMaster->status = 'PROCESSED';
            $loanProcessUploadMaster->save();
            var_dump($loanProcessUploadMaster->toArray());
            $source = $tempWipDir . $file->getFilename();
            $dest = $tempCompletedDir . $file->getFilename();
            copy($source, $dest);
            unlink($source);

        } catch (Exception $e) {
            $source = $tempWipDir . $file->getFilename();
            $dest = $tempRejectedDir . $file->getFilename();
            copy($source, $dest);
            unlink($source);
            continue;
            //throw $e;
        }
    }
}

   