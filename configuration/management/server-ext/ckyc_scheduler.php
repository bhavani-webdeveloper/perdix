<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once("bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Services\Csv;
use App\Core\Settings;

$settings = Settings::getInstance()->getSettings();
define('PERDIX_FILE_STREAM_API', $settings['perdix']['v8_url']."/api/stream");
define('CKYC_BASE_DIR', getenv('TRACKWIZZ_DIR'));
define('CKYC_OUTGOING_DIR', CKYC_BASE_DIR.DIRECTORY_SEPARATOR."outgoing");
define('CKYC_OUTGOING_TEMP_DIR', CKYC_BASE_DIR.DIRECTORY_SEPARATOR."outgoing_temp");
define('CKYC_INCOMING_DIR', CKYC_BASE_DIR.DIRECTORY_SEPARATOR."incoming");
define('CKYC_INCOMING_HISTORY_DIR', CKYC_BASE_DIR.DIRECTORY_SEPARATOR."incoming_history");
define('CKYC_INCOMING_TEMP_DIR', CKYC_BASE_DIR.DIRECTORY_SEPARATOR."incoming_temp");

Class Ckyc {
    public static $p2c_filename = [
        "aadhar card"=>"AadharCard",
        "voter card"=>"VoterID",
        "driving licence"=>"DrivingLicence",
        "passport"=>"Passport",
        "ration card"=>"RationCard",
        "water bill"=>"Utilitybill2m",
        "gas bill"=>"Utilitybill2m",
        "pan card"=>"PAN"
    ];
    public static $p2c_id_proof = [
        'Pan Card' => 'PAN',
        'Aadhar Card' => 'AadharCard',
        'Voter Card' => 'VoterID',
        'Ration Card' => 'OthersPOACKYCInd',
        'Driving Licence' => 'DrivingLicence',
        'Gas Bill' => 'OthersPOICKYCInd',
        'Passport' => 'Passport'
    ];
    public static $p2c_address_proof = [
        'Pan Card' => 'OthersPOACKYCInd',
        'Aadhar Card' => 'AadharCard',
        'Voter Card' => 'VoterID',
        'Ration Card' => 'OthersPOACKYCInd',
        'Driving Licence' => 'DrivingLicence'
    ];
    public static function CKYC_PERDIX_FIELD_MAP() { return [
        'TransactionID' => '',
        'SourceSystemName' => 'Perdix',
        'SourceSystemCustomerCode' => '@urn_no',
        'IsSmallCustomer' => 'No',
        'EkycOTPbased' => 'No',
        'ImageGenerationType' => '',
        'TransactionType' => 'New',
        'SourceSystemCustomerCreationDate' => function($c) { return date("d-M-Y", strtotime($c->created_at)); },
        'ModificationDate' => '',
        'UniqueGlobalCustomerCode' => '',
        'ConstitutionType' => '01',
        'Prefix' => function($c) { return $c->gender == 'FEMALE'? ($c->marital_status == 'MARRIED'? 'Mrs': 'Ms'): 'Mr'; },
        'FirstName' => '@first_name',
        'MiddleName' => '',
        'LastName' => '',
        'MaidenPrefix' => '',
        'MaidenFirstName' => '',
        'MaidenMiddleName' => '',
        'MaidenLastName' => '',
        'FatherPrefix' => 'Mr',
        'FatherFirstName' => '@father_first_name',
        'FatherMiddleName' => '',
        'FatherLastName' => '',
        'SpousePrefix' => '',
        'SpouseFirstName' => '',
        'SpouseMiddleName' => '',
        'SpouseLastName' => '',
        'MotherPrefix' => 'Mrs',
        'MotherFirstName' => '@mother_name',
        'MotherMiddleName' => '',
        'MotherLastName' => '',
        'Gender' => function($c) { return $c->gender == 'FEMALE'? 'F': 'M'; },
        'MaritalStatus' => function($c) {
            switch ($c->marital_status) {
                case 'MARRIED': return '01';
                case 'UNMARRIED': case 'SINGLE': return '02';
                case 'DIVORCED': case 'SEPARATED': case 'WIDOWER': return '03';
            }
            return '';
        },
        'Citizenship' => 'IN',
        'OccupationType' => function($c) {
            switch ($c->employment_status) {
                case 'Salaried': return 'O-02';
                case 'SELF EMPLOYED': case 'SELFEMPLOYED': return 'O-01';
            }
            return '';
        },
        'DateofBirth' => function($c) { return date("d-M-Y", strtotime($c->date_of_birth)); },
        'ResidentialStatus' => '01',
        'EmailId' => '',
        'KYCDateOfDeclaration' => function($c) { return date("d-M-Y", strtotime($c->created_at)); },
        'KYCPlaceOfDeclaration' => 'Chennai',
        'KYCVerificationDate' => function($c) { return date("d-M-Y", strtotime($c->created_at)); },
        'KYCEmployeeName' => 'Yuvaraj Sivakumar',
        'KYCEmployeeDesignation' => 'Associate Vice President',
        'KYCVerificationBranch' => 'Chennai',
        'KYCEmployeeCode' => 'C0134',
        'PermanentCKYCAddType' => '01',
        'PermanentCountry' => 'IN',
        'PermanentPin' => '@pincode',
        'PermanentAddressLine1' => function($c) { return join(',', array_filter([$c->door_no,$c->street,$c->post_office,$c->landmark,$c->locality,$c->district,$c->state])); },
        'PermanentAddressLine2' => '',
        'PermanentAddressLine3' => '',
        'PermanentDistrict' => '',
        'PermanentCity' => '@village_name',
        'PermanentState' => '',
        'PermanentAddressProof' => function($c) { return Ckyc::$p2c_address_proof[$c->address_proof]; },
        'CorrespondenceGlobalCountry' => 'IN',
        'CorrespondenceGlobalPin' => '@pincode',
        'CorrespondenceGlobalAddressLine1' => function($c) { return join(',', array_filter([$c->door_no,$c->street,$c->post_office,$c->landmark,$c->locality,$c->district,$c->state])); },
        'CorrespondenceGlobalAddressLine2' => '',
        'CorrespondenceGlobalAddressLine3' => '',
        'CorrespondenceGlobalDistrict' => '',
        'CorrespondenceGlobalCity' => '@village_name',
        'CorrespondenceGlobalState' => '',
        'JurisdictionOfResidence' => 'IN',
        'CountryOfBirth' => '',
        'BirthCity' => '',
        'TaxIdentificationNumber' => '',
        'TaxResidencyAddressLine1' => '',
        'TaxResidencyAddressLine2' => '',
        'TaxResidencyAddressLine3' => '',
        'TaxResidencyPin' => '',
        'TaxResidencyDistrict' => '',
        'TaxResidencyCity' => '',
        'TaxResidencyState' => '',
        'TaxResidencyCountry' => 'IN',
        'ResidentialSTDCode' => '',
        'ResidentialTelephoneNumber' => '',
        'OfficeSTDCode' => '',
        'OfficeTelephoneNumber' => '',
        'MobileISD' => '',
        'MobileNumber' => '@mobile_phone',
        'FaxSTD' => '',
        'FaxNumber' => '',
        'CKYCID' => '',
        'PassportNumber' => function($c) { return $c->identity_prof == 'Passport'? $c->identity_prof_no: ''; },
        'PassportExpiryDate' => '',
        'VoterIdCard' => function($c) { return $c->identity_prof == 'Voter Card'? $c->identity_prof_no: ''; },
        'PAN' => function($c) { return $c->identity_prof == 'Pan Card'? $c->identity_prof_no: ''; },
        'DrivingLicenseNumber' => '',
        'DrivingLicenseExpiryDate' => '',
        'Aadhaar' => function($c) { return $c->identity_prof == 'Aadhar Card'? $c->identity_prof_no: ''; },
        'AadhaarVaultReferenceNumber' => '',
        'AadhaarToken' => '',
        'AadhaarVirtualId' => '',
        'NREGA' => '',
        'CKYCPOIOtherCentralGovtID' => '',
        'CKYCPOIS01IDNumber' => '',
        'CKYCPOIS02IDNumber' => '',
        'ProofOfIDSubmitted' => function($c) { return Ckyc::$p2c_id_proof[$c->identity_prof]; },
        'CustomerDemiseDate' => '',
        'Minor' => 'No',
        'SourcesystemRelatedPartyode' => '',
        'RelatedPersonType' => '',
        'RelatedPersonPrefix' => '',
        'RelatedPersonFirstName' => '',
        'RelatedPersonMiddleName' => '',
        'RelatedPersonLastName' => '',
        'RelatedPersonCKYCID' => '',
        'RelatedPersonPassportNumber' => '',
        'RelatedPersonPassportExpiryDate' => '',
        'RelatedPersonVoterIdCard' => '',
        'RelatedPersonPAN' => '',
        'RelatedPersonDrivingLicenseNumber' => '',
        'RelatedPersonDrivingLicenseExpiryDate' => '',
        'RelatedPersonAadhaar' => '',
        'RelatedPersonAadhaarVaultReferenceNumber' => '',
        'RelatedPersonAadhaarToken' => '',
        'RelatedPersonAadhaarVirtualId' => '',
        'RelatedPersonNREGA' => '',
        'RelatedPersonCKYCPOIOtherCentralGovtID' => '',
        'RelatedPersonCKYCPOIS01IDNumber' => '',
        'RelatedPersonCKYCPOIS02IDNumber' => '',
        'RelatedPersonProofOfIDSubmitted' => '',
        'SourceSystemSegment' => '',
        'AppRefNumberforImages' => '',
        'HolderforImages' => '',
        'BranchCode' => ''
    ];}
}

function prepare_ckyc_data($data) {
    $ckycData = [];
    $header = [];
    foreach (Ckyc::CKYC_PERDIX_FIELD_MAP() as $key => $value) {
        $header[] = $key;
    }
    $ckycData[] = join('|', $header);
    foreach ($data as $c) {
        $row = [];
        foreach (Ckyc::CKYC_PERDIX_FIELD_MAP() as $key => $value) {
            if (is_callable($value)) {
                $row[] = $value($c);
            } else if (strpos($value, '@') === 0) {
                $row[] = $c->{substr($value, 1)};
            } else {
                $row[] = $value;
            }
        }
        $ckycData[] = join('|', $row);
    }
    return join("\n", $ckycData);
}

function write_file($path, $content, $writeMode = 'w') {
    $myfile = fopen($path, $writeMode) or die("Unable to open file '$path' for writing");
    fwrite($myfile, $content);
    fclose($myfile);
    echo "Wrote to file: $path\n";
}

function rrmdir($dir) {
    if (is_dir($dir)) {
      $files = scandir($dir);
      foreach ($files as $file)
      if ($file != "." && $file != "..") rrmdir("$dir/$file");
      rmdir($dir);
    }
    else if (file_exists($dir)) unlink($dir);
} 

function rcopy($src, $dst) {
    if (is_dir($src)) {
        if(!is_dir($dst))
            mkdir($dst);
      $files = scandir($src);
      foreach ($files as $file)
      if ($file != "." && $file != "..") rcopy("$src/$file", "$dst/$file"); 
    }
    else if (file_exists($src)) copy($src, $dst);
}

function rdeleteContent($dir){
    $di = new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS);
    $ri = new RecursiveIteratorIterator($di, RecursiveIteratorIterator::CHILD_FIRST);
    foreach ( $ri as $file ) {
        $file->isDir() ?  rmdir($file) : unlink($file);
    }

}

function updateInterfaceById($id, $processing_status, $response_status, $response_message) {
    DB::table('customer_external_interface')->where('id', $id)->update([
        'processing_status' => $processing_status,
        'response_status' => $response_status,
        'response_message' => $response_message
    ]);
}

function updateInterfaceByCustomerId($customer_id, $processing_status, $response_status, $response_message) {
    DB::table('customer_external_interface')
    ->where('customer_id', $customer_id)
    ->where('interface_type', 'CKYC')
    ->update([
        'processing_status' => $processing_status,
        'response_status' => $response_status,
        'response_message' => $response_message
    ]);
}

function recreate_directory($dir) {
    try {
        if (is_dir($dir)) {
            rrmdir($dir);
        }
        mkdir($dir, 0777, true);
        return true;
    } catch (Exception $e) {
        echo $e;
        return false;
    }
}

function download_customer_file($customer_id, $file_name, $file_id) {
    if ($file_id) {
        echo "    Downloading $customer_id $file_name: $file_id\n";
        file_put_contents(CKYC_OUTGOING_TEMP_DIR.DIRECTORY_SEPARATOR.$customer_id.DIRECTORY_SEPARATOR.$file_name, file_get_contents(PERDIX_FILE_STREAM_API.'/'.$file_id));
    }
}

function process_outgoing() {
    echo "Processing outgoing\n";
    recreate_directory(CKYC_OUTGOING_TEMP_DIR) or die("unable to create outgoing Temp Directory\n");

    $customer_external_interface = DB::select("SELECT cei.* FROM customer_external_interface cei, customer c WHERE cei.customer_id = c.id AND cei.interface_type = 'CKYC' AND (cei.processing_status = 'PENDING' OR cei.processing_status = 'RESPONSECOMPLETE' AND cei.response_status = 'FAILURE' AND cei.customer_version < c.version)");
    $customer_ids = [];
    $customer_interface_data = [];
    foreach ($customer_external_interface as $cei) {
        $customer_ids[] = $cei->customer_id;
        $customer_interface_data[$cei->customer_id] = $cei;
    }
    echo 'Customers to be processed: '.json_encode($customer_ids, true)."\n";

    $customer_data = DB::table("customer")->select('*')->whereIn('id', $customer_ids)->get();

    $piped_customer_text = prepare_ckyc_data($customer_data);
    $timestamp = (new DateTime())->format('Y-m-dH:i:s');
    write_file(CKYC_OUTGOING_TEMP_DIR.DIRECTORY_SEPARATOR."CustomerData_$timestamp.txt", $piped_customer_text);

    foreach ($customer_data as $customer) {
        echo "Processing customer: $customer->id\n";
        if (!recreate_directory(CKYC_OUTGOING_TEMP_DIR.DIRECTORY_SEPARATOR.$customer->urn_no)) {
            echo "Failed to create directory for customer id: $customer->id\n";
            continue;
        }
        /**
         * Showing only front image but we neeed to conver front and back to pdf for addrss proof image id nad identiy proof image id
         */
        download_customer_file($customer->id, 'customer_photo', $customer->photo_image_id);
        download_customer_file($customer->id, Ckyc::$p2c_filename[strtolower($customer->address_proof)], $customer->address_proof_image_id);
        download_customer_file($customer->id, Ckyc::$p2c_filename[strtolower($customer->identity_prof)], $customer->identity_proof_image_id);

        $interface_data = $customer_interface_data[$customer->id];
        try {
            /**
             * updating ProcessingStatus in customer_external_interface table
             */
            if ($interface_data->response_status == 'FAILURE') {
                updateInterfaceById($interface_data->id, 'RETRIED', $interface_data->response_status, $interface_data->response_message);
                echo " inserting new for failure\n";
                $now = date('Y-m-d H:i:s');
                DB::table('customer_external_interface')->insert([
                    'version' => NULL,
                    'customer_id' => $customer->id,
                    'customer_version' => $customer->version,
                    'processing_status' => "REQUESTCOMPLETE",
                    'response_status' => NULL,
                    'interface_type' => $interface_data->interface_type,
                    'response_time' => $now,
                    'loan_amount' => $interface_data->loan_amount,
                    'loan_purpose' => $interface_data->loan_purpose,
                    'response_message' => $now,
                    'created_by' => "SYSTEM",
                    'created_at' => $now,
                    'last_edited_by' => "SYSTEM",
                    'last_edited_at' => $now
                ]);
            } else {
                updateInterfaceById($interface_data->id, 'REQUESTCOMPLETE', NULL, NULL);
            }
        } catch (Exception $e) {
            echo $e . "\n";
            updateInterfaceById($interface_data->id, "REQUESTFAILURE", NULL, $e);
        }
    }
    
    /*  
        move content from temp to incomng for trackwizz and delete the temporary folder
    */
    try{
        if (!is_dir(CKYC_OUTGOING_DIR)) {
            mkdir(CKYC_OUTGOING_DIR, 0777, true);
        }else {
            rdeleteContent(CKYC_OUTGOING_DIR);
        }
        rcopy(CKYC_OUTGOING_TEMP_DIR, CKYC_OUTGOING_DIR);
        rrmdir(CKYC_OUTGOING_TEMP_DIR); 
    
    } catch(Exception $e){
        echo "unable to copy and remove directory or making outgoing directory \n";
    }
};

function process_incoming() {
    echo "Processing incoming \n";
    try{
        is_dir(CKYC_INCOMING_DIR) or die("Incoming directory is invalid, quit");
        $files = new DirectoryIterator(CKYC_INCOMING_DIR);
        $files or die("No files present under incoming directory, quit");
        if (!is_dir(CKYC_INCOMING_TEMP_DIR)) {
            mkdir(CKYC_INCOMING_TEMP_DIR, 0777, true);
        }
        rcopy(CKYC_INCOMING_DIR, CKYC_INCOMING_TEMP_DIR);
        $fileTemp = new DirectoryIterator(CKYC_INCOMING_TEMP_DIR);
        foreach ($fileTemp as $file) {
            echo "    Processing ".$file->getFilename()."\n";
            if (!$file->isFile()) {
                echo "        ".$file->getFilename()." is not a file, next\n";
                continue;
            }
            $inputFileName = CKYC_INCOMING_TEMP_DIR.DIRECTORY_SEPARATOR.$file->getFilename();
            $ext = pathinfo($inputFileName, PATHINFO_EXTENSION);
            if ($ext == "xlsx") {
                echo "        Reading excel file\n";
                $inputFileType = PHPExcel_IOFactory::identify($inputFileName);
                $objReader = PHPExcel_IOFactory::createReader($inputFileType);
            
                $objPHPExcel = $objReader->load($inputFileName);
                $sheet = $objPHPExcel->getSheet(0);
                $highestRow = $sheet->getHighestRow();
                $highestColumn = $sheet->getHighestColumn();
                for ($row = 2; $row <= $highestRow; $row++) {
                    try {
                        $matrixData = $sheet->rangeToArray("A$row:$highestColumn$row", null, true, false);
                        $rowData = $matrixData[0];
                        $customer_urn = $rowData[2];
                        $response_status = $rowData[115] == 'Rejected'? 'FAILURE': $rowData[115];
                        echo "            Updating URN: '$customer_urn' with status: $response_status\n";
                        $customer = DB::table("customer")->select('id')->where('urn_no', $customer_urn)->first();
                        if ($customer) {
                            echo "                Customer id: $customer->id\n";
                            DB::table('customer_external_interface')
                                ->where('customer_id', $customer->id)
                                ->where('interface_type', 'CKYC')
                                ->where('processing_status', 'REQUESTCOMPLETE')
                                ->update(['response_status' => $response_status, 'processing_status' => "RESPONSECOMPLETE"]);
                        } else {
                            echo "                Customer URN not found in Customer table\n";
                        }
                    } catch(Exception $e) {
                        echo "Uanble to process excel row:$row\n";
                        echo "$e\n";
                    }
                }
            } elseif ($ext == "txt") {
                echo "        Reading text file\n";
                $inputFile = fopen($inputFileName, "r") or die("Unable to open file!");
                $fileData = fread($inputFile, filesize($inputFileName));
                fclose($inputFile);
                foreach (preg_split("/((\r?\n)|(\r\n?))/", $fileData) as $line) {
                    $bits = explode('|', $line);
                    if ($bits[0] != '200') continue;
                    $customer_urn = $bits[2];
                    $ckyc_number = $bits[4];
                    echo "            Updating URN: '$customer_urn' with CKYC number: $ckyc_number\n";
                    if ($ckyc_number) {
                        DB::table('customer')->where('urn_no', $customer_urn)->update(['ckyc' => $ckyc_number]);
                    } else {
                        echo "            CKYC number is not prensent for URN: '$customer_urn'\n";
                        $customer = DB::table("customer")->select('id')->where('urn_no', $customer_urn)->get();
                        updateInterfaceByCustomerId($customer->id, "RESPONSEFAILURE", '', 'No CKYC number present in response');
                    }
                }
            }
        }
        if (!is_dir(CKYC_INCOMING_HISTORY_DIR)) {
            mkdir(CKYC_INCOMING_HISTORY_DIR, 0777, true);
        }
        $subHistoryFolder = CKYC_INCOMING_HISTORY_DIR.DIRECTORY_SEPARATOR.date('Y-m-d');
        if (!is_dir($subHistoryFolder)) {
            mkdir($subHistoryFolder, 0777, true);
        }
        rcopy(CKYC_INCOMING_DIR,$subHistoryFolder);
        rdeleteContent(CKYC_INCOMING_DIR);
        rrmdir(CKYC_INCOMING_TEMP_DIR);
    } catch(Exception $e){
        echo "some error occured in response reading part \n";
    }

}

if (!isset($_GET['mode']) || $_GET['mode'] == "Incoming") {
    process_incoming();
} else if($_GET['mode'] == "Outgoing") {
    process_outgoing();
} else {
    die('Error processing anything');
}