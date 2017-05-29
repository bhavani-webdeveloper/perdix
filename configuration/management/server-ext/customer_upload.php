<?php

include_once("bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\CustomerUploadMaster;
use App\Models\CustomerUploadDetail;
use App\Services\PerdixService;
use App\Core\Settings;

$perdixService= new PerdixService();
$perdixService->login();
$settings = Settings::getInstance()->getSettings();

$authHeader = "Bearer ". $settings['perdix']['token'];
$url = $settings['perdix']['v8_url'] . "/api/enrollments";

echo $authHeader;

$baseUrl = $settings['perdix']['customer_upload_path'];


$tempToBeProcessed = $baseUrl . DIRECTORY_SEPARATOR . "to_be_processed" . DIRECTORY_SEPARATOR;
$tempWipDir = $baseUrl . DIRECTORY_SEPARATOR . "wip" . DIRECTORY_SEPARATOR;
$tempRejectedDir = $baseUrl . DIRECTORY_SEPARATOR . "rejected" . DIRECTORY_SEPARATOR;
$tempCompletedDir = $baseUrl . DIRECTORY_SEPARATOR . "completed" . DIRECTORY_SEPARATOR;



$files = new DirectoryIterator($tempToBeProcessed);

foreach ($files as $file) {
    echo $tempToBeProcessed . $file->getFilename();
    if ($file->isFile()) {
        echo $tempCompletedDir;
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

            if ($highestColumn != "X") {
                $source = $tempWipDir . $file->getFilename();
                $dest = $tempRejectedDir . $file->getFilename();
                copy($source, $dest);
                unlink($source);
                continue;
            }

            $customerUploadMaster = new CustomerUploadMaster();
            $customerUploadMaster->filename = $inputFileName;
            $customerUploadMaster->total_records = ($highestRow - 1);
            $customerUploadMaster->failed_records = 0;
            $customerUploadMaster->status = 'PROCESSING';
            $customerUploadMaster->save();
            $failedCount = 0;
            $IdGenerated = $customerUploadMaster->id;
            //var_dump($customerUploadMaster->toArray());

            echo "File Upload for : " . $inputFileName . "\n";

            for ($row = 2; $row <= $highestRow; $row++) {
                $matrixData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row,
                    NULL,
                    TRUE,
                    FALSE);
                $rowData = $matrixData[0];
                echo $rowData[4];
                $enterprise = array(
                    'businessConstitution' => $rowData[13],
                    'registrationNumber' => $rowData[16],
                    'companyOperatingSince' => $rowData[14],
                    'registrationType' => $rowData[15]
                );
                $enterpriseRegistrations = array(
                    array(
                        'registrationNumber' => $rowData[16],
                        'registrationType' => $rowData[15]
                    )
                );
                $customerData = array(
                    'partnerCode' => $rowData[0],
                    'firstName' => $rowData[1],
                    'customerType' => $rowData[2],
                    'oldCustomerId' => $rowData[3],
                    'dateOfBirth' => $rowData[4],
                    'gender' => $rowData[5],
                    'maritalStatus' => $rowData[6],
                    'panNo' => $rowData[7],
                    'aadhaarNo' => $rowData[8],
                    'identityProof' => $rowData[9],
                    'identityProofNo' => $rowData[10],
                    'addressProof' => $rowData[11],
                    'addressProofNo' => $rowData[12],
                    'enterprise' => $enterprise,
                    'enterpriseRegistrations' => $enterpriseRegistrations,
                    'doorNo' => $rowData[17],
                    'street' => $rowData[18],
                    'landmark' => $rowData[19],
                    'state' => $rowData[20],
                    'district' => $rowData[21],
                    'landLineNo' => $rowData[22],
                    'mobilePhone' => $rowData[23]

                );

                $customerSave = array(
                    'customer' => $customerData,
                    'enrollmentAction' => "SAVE"
                );
                echo json_encode($customerSave);

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

                    echo "success" . "\n";
                    $customerUploadDetail = new CustomerUploadDetail();
                    $customerUploadDetail->master_id = $IdGenerated;
                    $customerUploadDetail->customer_id = $customerData["oldCustomerId"];
                    $customerUploadDetail->customer_name = $customerData["firstName"];
                    $customerUploadDetail->is_processed = true;
                    $customerUploadDetail->status = 'SUCCESS';
                    $customerUploadDetail->request_json = 'NA';
                    $customerUploadDetail->error_response = 'NA';
                    $customerUploadDetail->save();

                } catch (Exception $e) {
                    echo "File Exception Captured : " . $inputFileName . "\n";
                    $customerUploadDetail = new CustomerUploadDetail();
                    $customerUploadDetail->master_id = $IdGenerated;
                    $customerUploadDetail->customer_id = $customerData["oldCustomerId"];
                    $customerUploadDetail->customer_name = $customerData["firstName"];
                    $customerUploadDetail->is_processed = true;
                    $customerUploadDetail->status = 'FAILED';
                    $customerUploadDetail->request_json = json_encode($customerSave);
                    $customerUploadDetail->error_response = '';
                    $customerUploadDetail->save();
                    //var_dump($customerUploadDetail->toArray());
                    $failedCount++;

                    json_encode($customerSave);
                    //throw $e;
                }
            };

            $customerUploadMaster->failed_records = $failedCount;
            $customerUploadMaster->status = 'PROCESSED';
            $customerUploadMaster->save();

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

