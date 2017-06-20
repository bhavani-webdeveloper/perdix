<?php

include_once("bootload.php");
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Models\UploadTagMaster;
use App\Models\UploadTagAccountsHistory;
use App\Models\UploadTagAccounts;
use App\Services\PerdixService;
use App\Services\UploadService;
use App\Core\Settings;


# AUTHENTICATION
$perdixService = new PerdixService();
$loggedInUser = $perdixService->accountInfo();

var_dump($_FILES);
# GET FILE
if (0 < $_FILES['file']['error']) {
    echo 'Error: ' . $_FILES['file']['error'] . '<br>';
} else {
    if (move_uploaded_file($_FILES['file']['tmp_name'], __DIR__ . '/uploads/' . $_FILES['file']['name'])) {
        $outjson = array(
            "POST_PARAMS" => $_POST,
            "filename" => $_FILES['file']['name']
        );
        // echo json_encode($outjson);
        // print_r($outjson);
    }
}

$upload_name = isset($_GET['upload_name']) ? $_GET['upload_name'] : '';

$inputFileName = __DIR__ . '/uploads/' . $_FILES['file']['name'];
try {
    $inputFileType = PHPExcel_IOFactory::identify($inputFileName);
    $objReader = PHPExcel_IOFactory::createReader($inputFileType);
    $objPHPExcel = $objReader->load($inputFileName);
} catch (Exception $e) {
    die('Error loading file "' . pathinfo($inputFileName, PATHINFO_BASENAME) . '": ' . $e->getMessage());
}
$sheet = $objPHPExcel->getSheet(0);
$highestRow = $sheet->getHighestRow();
$highestColumn = $sheet->getHighestColumn();
echo $highestColumn . "\n";

$UploadTagMaster = new UploadTagMaster();
$date; 
$dateForDB;
if($upload_name == "PAR"){

        $baseName = basename($inputFileName,".xlsx");
        $fileNameSplit = explode("_", $baseName);
        echo "date: ".$fileNameSplit[1]."\n";
        echo DateTime::createFromFormat('dmY', $fileNameSplit[1])->format('dMY')."\n";
        if(sizeof($fileNameSplit) == 2 && DateTime::createFromFormat('dmY', $fileNameSplit[1])->format('dmY') === $fileNameSplit[1]){

            $date = DateTime::createFromFormat('dmY', $fileNameSplit[1]);
            $dateForDB = DateTime::createFromFormat('dmY', $fileNameSplit[1])->format('Y-m-d');
        } else {
            throw new Exception("There is no date in file Name: ".$inputFileName);
        }
}

for ($row = 2; $row <= $highestRow; $row++) {
	$matrixData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row,
	                    NULL,
	                    TRUE,
	                    FALSE);

	$rowData = $matrixData[0];

	switch ($upload_name) {
		case 'SECURITIZATION':
			UploadService::handleSecuritazation($rowData);
			break;
		case 'PAR':
			UploadService::handleParUpload($rowData, $row, $date, $dateForDB);
			break;
		default:
			# code...
			break;
	}

}

echo "Done";