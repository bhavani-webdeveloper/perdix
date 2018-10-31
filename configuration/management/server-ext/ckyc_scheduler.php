<?php
include_once("bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Services\Csv;
use App\Core\Settings;

$settings = Settings::getInstance()->getSettings();
$GLOBALS['ImageApi'] = $settings['perdix']['v8_url'] . "/api/stream";

/*
    Utility function 
        createPipeFile:- toCreatePipe sepearator file ,
        rrmdir        :- recusrsively remove dir , 
        rcopy         :- recursively copy dir ,
        writeError    :- writing error to customer_external_interface table in response_message table,
        validateCustomer_Data :- to validate the customer data and chnage data accordingly before sending to trackwizz
*/
function createPipeFile($data) {
    try{
        if(count($data) > 0) {
            // reset the array keys
            $tabledata = array_values($data);
            if($GLOBALS['pipeHeader']){
                $pipeHeader = array_keys($tabledata[0]);	// get the headers from the array
                fputcsv($GLOBALS['pipeFile'], $pipeHeader, '|', " ");
                $GLOBALS['pipeHeader']=false;
                createPipeFile($data);
            }else{
                foreach($tabledata as $val) {
                    fputcsv($GLOBALS['pipeFile'], $val, '|', " ");
                }
            }
        }
    }catch (Exception $e){
        echo "Error creating pipe file \n";
    }
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

function writeError( $customer_id, $processing_status, $error) {
    DB::table('customer_external_interface')
    ->where('customer_id', $customer_id)
    ->update(['response_message' => $error,
              'processing_status' => $processing_status,
              'response_status' => NULL
    ]);
}

function validateCustomerData($data){
    echo "validating data \n";
    if(null !=$data[0]['gender'])
        $data[0]['gender'] = $GLOBALS['VALID_CUSTOMER_DATA']['gender'][strtolower($data[0]['gender'])];
    if(null != $data[0]['marital_status'])
        $data[0]['marital_status'] = $GLOBALS['VALID_CUSTOMER_DATA']['marital_status'][strtolower($data[0]['marital_status'])];
    if(null !=$data[0]['address_proof'])
        $data[0]['address_proof'] = $GLOBALS['VALID_CUSTOMER_DATA']['address_proof'][strtolower($data[0]['address_proof'])];
    if(null != $data[0]['identity_prof'])
        $data[0]['identity_prof'] = $GLOBALS['VALID_CUSTOMER_DATA']['identity_prof'][strtolower($data[0]['identity_prof'])];
    return $data ;
}

/* 
    create folder Directories if not already present 
*/
$DIR= getenv('TRACKWIZZ_DIR');// from .env
$GLOBALS['outgoingDir']      =  $DIR.DIRECTORY_SEPARATOR."cersai".DIRECTORY_SEPARATOR."outgoing";
$GLOBALS['outgoingTempDir']  =  $DIR.DIRECTORY_SEPARATOR."cersai".DIRECTORY_SEPARATOR."outgoing_temp";
$GLOBALS['trackwizDir']      =  $DIR.DIRECTORY_SEPARATOR."cersai".DIRECTORY_SEPARATOR."incoming" ;
$GLOBALS['trackwizHistDir']  =  $DIR.DIRECTORY_SEPARATOR."cersai".DIRECTORY_SEPARATOR."incomingHistory" ;
$GLOBALS['trackwizTempDir']  =  $DIR.DIRECTORY_SEPARATOR."cersai".DIRECTORY_SEPARATOR."incoming_temp" ;
$GLOBALS['VALID_CUSTOMER_DATA']=array(
    "gender"=>array(
        "male"=>"M",
        "female"=>"F"
    ),
    "occupation_type"=>array(
        "salaried"=>"Others - Self Employed",
        "selfemployed"=>"Others - Professional"
    ),
    "marital_status"=>array(
        "married"=>01,
        "unmarried"=>02,
        "divorced"=>03,
        "single"=>02,
        "separated"=>03,
        "widower"=>03
    ),
    "address_proof"=>array(
        "aadhar card"=>"AadharCard",
        "voter card"=>"VoterID",
        "driving licence"=>"DrivingLicence",
        "passport"=>"Passport",
        "ration card"=>"OthersPOACKYCInd",
        "pan card"=>"OthersPOICKYCInd"
    ),
    "identity_prof"=>array(
        "aadhar card"=>"AadharCard",
        "voter card"=>"VoterID",
        "driving licence"=>"DrivingLicence",
        "passport"=>"Passport",
        "ration card"=>"OthersPOACKYCInd",
        "gas bill"=>"OthersPOICKYCInd",
        "pan card"=>"PAN"
    ),
);
$GLOBALS['IMAGEPROOF']=array(
    "aadhar card"=>"AadharCard",
    "voter card"=>"VoterID",
    "driving licence"=>"DrivingLicence",
    "passport"=>"Passport",
    "ration card"=>"RationCard",
    "water bill"=>"Utilitybill2m",
    "gas bill"=>"Utilitybill2m",
    "pan card"=>"PAN"
);

/*
    1) Getting parameter from cmd for ckyc_scheduler , it wil be either a)incoming or b)outgoing
*/
$val = getopt(null, ["parameter:"]);

if($val['parameter']=="Incoming"){
    fetchIncomingData();

}else if($val['parameter']=="Outgoing"){
    prepareOutgoingData();
}else {
    echo "php File called without parameter , so by default reading response from trackwizz \n";
    fetchIncomingData();
}

function prepareOutgoingData() {
    try{
        if (!is_dir($GLOBALS['outgoingTempDir'])) {
            echo "creating outgoing temporary directory \n";
            mkdir($GLOBALS['outgoingTempDir'], 0777, true);
        }else {
            rrmdir($GLOBALS['outgoingTempDir']);
            mkdir($GLOBALS['outgoingTempDir'], 0777, true);
        }
        $GLOBALS['filePath']         =  $GLOBALS['outgoingTempDir'].DIRECTORY_SEPARATOR."customerData.txt";
        $GLOBALS['pipeFile'] = fopen($GLOBALS['filePath'], 'a') or die('Cannot open file:  '.$GLOBALS['filePath']);
        $GLOBALS['pipeHeader'] = true;
    }catch(Exception $e){
        echo "unable to create outgoing Temp Directory \n";
    }
    
    $customer_interface_data = DB::table("customer_external_interface")->select('*')
    ->where([
        ['processing_status', '=', 'PENDING'],
        ['response_status', '=', NULL],
        ['interface_type', '=', 'CKYC'] 
    ])
    ->orWhere([
        ['processing_status', '=', 'RESPONSECOMPLETE'],
        ['response_status', '=', 'FAILURE'],
        ['interface_type', '=', 'CKYC']
    ])
    ->get();
    $customer_interface_dataArray = json_decode($customer_interface_data, true);
    echo "customer interface data fetched \n";
    
    foreach ($customer_interface_dataArray as $interface_data) {
        try{
            $customer_data = DB::table("customer")->select('*')
            ->where([
                ['id', '=', $interface_data['customer_id']]
            ])
            ->get();
            $customer_dataArray = json_decode($customer_data, true);
            echo "customer data fetched for " . $interface_data['customer_id'] . "\n";
    
            if($interface_data['response_status']=='FAILURE' && $customer_dataArray[0]['version']<=$interface_data['customer_version']){
                echo "skipping customer " . $interface_data['customer_id'] . "\n";
                continue;
            }
            if($interface_data['response_status'] == 'FAILURE' && $customer_dataArray[0]['version']>$interface_data['customer_version']){
                DB::table('customer_external_interface')
                ->where('customer_id', $interface_data['customer_id'])
                ->update(['processing_status' => "RETRY_INITIATED"
                ]);
                    
            }
            $customer_dataArray = validateCustomerData($customer_dataArray);
            createPipeFile($customer_dataArray);
            $customerFolderDir = $GLOBALS['outgoingTempDir'].DIRECTORY_SEPARATOR.$interface_data['customer_id'];
            if (!is_dir($customerFolderDir)) {
                mkdir($customerFolderDir, 0777, true);
            }
    
        /*
            for now we are showing front image but we neeed to conver front and back to pdf 
            for addrss proof image id nad identiy proof image id ,  
        */
            
            $imageIds = array($customer_dataArray[0]['photo_image_id'], $customer_dataArray[0]['address_proof_image_id'], $customer_dataArray[0]['identity_proof_image_id']);
            foreach($imageIds as $imageId){
                if(null ==$imageId){
                    continue;
                }
                $photoImageUrl = $GLOBALS['ImageApi'].'/'.$imageId;
                $photoImagename = array_keys($customer_dataArray[0], $imageId)[0];
                switch($photoImagename){
                    case "address_proof_image_id":
                            $photoImagename=$GLOBALS['IMAGEPROOF'][strtolower($customer_dataArray[0]['address_proof'])];
                            break;
                    case "identity_proof_image_id":
                            $photoImagename=$GLOBALS['IMAGEPROOF'][strtolower($customer_dataArray[0]['identity_prof'])];
                            break;
                    case "photo_image_id":
                            $photoImagename="customer_photo";
                            break;
                    default : echo "No image is there \n";
                }
                $photoImage = $customerFolderDir.DIRECTORY_SEPARATOR.$photoImagename;
                file_put_contents($photoImage, file_get_contents($photoImageUrl));
            }
    /*   updating ProcessingStatus in customer_external_interface table
    */  
            if($interface_data['response_status'] == 'FAILURE' && $customer_dataArray[0]['version']>$interface_data['customer_version']){
                echo " inserting new record for case of failure \n";
                DB::table('customer_external_interface')->insert(
                    ['version' => NULL,
                     'customer_id'=> $interface_data['customer_id'],
                     'customer_version'=> $interface_data['customer_version'],
                     'processing_status'=> "REQUESTCOMPLETE",
                     'response_status'=>"FAILURE",
                     'interface_type'=>$interface_data['interface_type'],
                     'response_time' => $interface_data['response_time'],
                     'loan_amount' => $interface_data['loan_amount'],
                     'loan_purpose'=> $interface_data['loan_purpose'],
                     'response_message'=>date('Y-m-d H:i:s'),
                     'created_by'=> "SYSTEM",
                     'created_at'=>date('Y-m-d H:i:s'),
                     'last_edited_by'=>"SYSTEM",
                     'last_edited_at'=>date('Y-m-d H:i:s')
                    ]
                );
                    
            }else{
                DB::table('customer_external_interface')
                ->where('customer_id', $interface_data['customer_id'])
                ->update(['processing_status' => "REQUESTCOMPLETE",
                        'response_status' => NULL
                ]);
            }
    
        }catch(Exception $e) {
            echo $e . "\n";
            writeError($interface_data['customer_id'], "REQUESTFAILURE", $e);
            fclose($GLOBALS['pipeFile']);
        }
    }
    
    /*  
        move content from temp to incomng for trackwizz and delete the temporary folder
    */
    try{
        if (!is_dir($GLOBALS['outgoingDir'])) {
            mkdir($GLOBALS['outgoingDir'], 0777, true);
        }else {
            rdeleteContent($GLOBALS['outgoingDir']);
        }
        rcopy($GLOBALS['outgoingTempDir'], $GLOBALS['outgoingDir']);
        rrmdir($GLOBALS['outgoingTempDir']); 
    
    } catch(Exception $e){
        echo "unable to copy and remove directory or making outgoing directory \n";
    } 
    fclose($GLOBALS['pipeFile']);

};

function fetchIncomingData() {
        /* Looking for Incoming folder 
        */ 
    try{     
        if(is_dir($GLOBALS['trackwizDir'])){
            $files = new DirectoryIterator($GLOBALS['trackwizDir']);
            if($files){
                if (!is_dir($GLOBALS['trackwizTempDir'])) {
                    mkdir($GLOBALS['trackwizTempDir'], 0777, true);
                }
                $GLOBALS['trackwizHistDir'] ;
                rcopy($GLOBALS['trackwizDir'], $GLOBALS['trackwizTempDir']);
                $fileTemp = new DirectoryIterator($GLOBALS['trackwizTempDir']);
                foreach($fileTemp as $file){
                    $is_file = $file->isFile();
                    if($is_file){
                        $inputFileName = $GLOBALS['trackwizTempDir'].DIRECTORY_SEPARATOR.$file->getFilename();
                        $ext = pathinfo($inputFileName, PATHINFO_EXTENSION);
                        if($ext == "xlsx"){
                            echo "reading xlsx response file \n";
                            $inputFileType = PHPExcel_IOFactory::identify($inputFileName);
                            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
                        
                            $objPHPExcel = $objReader->load($inputFileName);
                            $sheet = $objPHPExcel->getSheet(0);
                            $highestRow = $sheet->getHighestRow();
                            $highestColumn = $sheet->getHighestColumn();
                            for ($row = 2; $row <= $highestRow; $row++) {
                                try{
                                    $matrixData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row,
                                                    NULL,
                                                    TRUE,
                                                    FALSE);
                                    $rowData = $matrixData[0];
                                    $customer_urn = $rowData[2];
                                    $customer_integration_status = $rowData[115];
                                    if($customer_integration_status == 'Rejected'){
                                        $customer_integration_status = "FAILURE";
                                    }
                                    $customerId = DB::table("customer")->select('id')
                                    ->where([
                                        ['urn_no', '=',$customer_urn]
                                    ])
                                ->get();
                                    $customerId = json_decode($customerId, true);
                                    if(null != $customerId){
                                        $customer_id=$customerId[0]['id'];
                                        $GLOBALS['customer_id'] = $customer_id;
                                        DB::table('customer_external_interface')
                                        ->where([['customer_id', $customer_id],
                                                ['processing_status', '=', 'REQUESTCOMPLETE']
                                            ])
                                        ->update(['response_status' => $customer_integration_status,
                                                  'processing_status' => "RESPONSECOMPLETE",
                                        ]);
                                    } 
                                }catch(Exception $e){
                                    echo "Uanble to process xlx response file from trackwizz " .$e."\n";
                                    writeError($GLOBALS['customer_id'], "RESPONSEFAILURE", $e);
                                }
                            }
                        } elseif($ext == "txt"){
                            echo "Reading response txt file \n";
                            $finacleFile = fopen($inputFileName, "r") or die("Unable to open file!");
                            $fileData = fread($finacleFile, filesize($inputFileName));
                            // print_r($fileData);
                            // list($RecordType, $sourceSystem, $sourceSystemCustomerCode, $CKYCAccType, $CKYCnumber)=explode('|', $fileData);
                            //     $vars = explode('|', $fileData);
                            //     print_r($vars); 
                            $lines = explode('|', $fileData);
                            for($i=0; $i < sizeof($lines); $i+=5){
                                try{
                                    if($lines[$i] != 200)
                                        continue;
                                    $urn_no = $lines[$i+2];
                                    $GLOBALS['urn_no'] = $urn_no;
                                    $ckyc_no = $lines[$i+4];
                                    DB::table('customer')
                                    ->where('urn_no', $urn_no)
                                    ->update(['CKYC' => $ckyc_no]); 
                            } catch(Exception $e){
                                    echo "unable to process txt file " .$e ."\n";
                                    $customerId = DB::table("customer")->select('id')
                                    ->where([
                                        ['urn_no', '=',$GLOBALS['urn_no']]
                                    ])
                                    ->get();
                                    $customerId = json_decode($customerId, true);
                                    if(null != $customerId){
                                        $customer_id=$customerId[0]['id'];
                                        writeError($customer_id, "RESPONSEFAILURE", $e);
                                    } 
                                }   
                            }
                        } 
                    }
                }
                if (!is_dir($GLOBALS['trackwizHistDir'])) {
                    mkdir($GLOBALS['trackwizHistDir'], 0777, true);
                }
                $subHistoryFolder = $GLOBALS['trackwizHistDir'].DIRECTORY_SEPARATOR.date('Y-m-d');
                    if (!is_dir($subHistoryFolder)) {
                        mkdir($subHistoryFolder, 0777, true);
                    }
                rcopy($GLOBALS['trackwizDir'],$subHistoryFolder);
                rdeleteContent($GLOBALS['trackwizDir']);
                rrmdir($GLOBALS['trackwizTempDir']);
            }
        }
    
    } catch(Exception $e){
        echo "some error occured in response reading part \n";
    }

}