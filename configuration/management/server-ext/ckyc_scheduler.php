<?php
include_once("bootload.php");

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Database\Capsule\Manager as DB;
use EllipseSynergie\ApiResponse\Contracts\Response;
use App\Services\Csv;
use App\Core\Settings;
/*
    Create url for api call for image download
*/
$settings = Settings::getInstance()->getSettings();
$ImageApi = $settings['perdix']['v8_url'] . "/api/stream";

/*
    Utility function 
        createPipeFile:- toCreatePipe sepearator file ,
        rrmdir        :- recusrsively remove dir , 
        rcopy         :- recursively copy dir ,
        writeError    :- writing error to customer_external_interface tbale in response_message table
*/
function createPipeFile($path, $fileName, $data) {
    try{
        $filePath = $path . "/" . $fileName . ".txt"; //nomenclature of fileName to be decided
        if(count($data) > 0) {
            // reset the array keys
            $data = array_values($data);

            $pipeFile = fopen($filePath, "w");	
            $pipeHeader = array_keys($data[0]);	// get the headers from the array
            fputcsv($pipeFile, $pipeHeader, '|', " ");
            foreach($data as $val) {
                fputcsv($pipeFile, $val, '|', " ");
            }
            fclose($pipeFile);
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

function writeError( $customer_id, $processing_status, $error) {
    DB::table('customer_external_interface')
    ->where('customer_id', $customer_id)
    ->update(['response_message' => $error,
              'processing_status' => $processing_status,
              'response_status' => NULL
    ]);
}

/* 
    create folder Directories if not already present 
*/
$DIR= getcwd();
$outgoingTempDir  =  $DIR.DIRECTORY_SEPARATOR."cersai".DIRECTORY_SEPARATOR."outgoing_temp";
$outgoingDir      =  $DIR.DIRECTORY_SEPARATOR."cersai".DIRECTORY_SEPARATOR."outgoing";
$trackwizTempDir  =  $DIR.DIRECTORY_SEPARATOR."cersai".DIRECTORY_SEPARATOR."incoming_temp" ;
$trackwizDir      =  $DIR.DIRECTORY_SEPARATOR."cersai".DIRECTORY_SEPARATOR."incoming" ; 

try{
    if (!is_dir($outgoingTempDir)) {
        echo "creating outgoing temporary directory \n";
        mkdir($outgoingTempDir, 0777, true);
    }
}catch(Exception $e){
    echo "unable to create outgoing Temp Directory \n";
}

/* 
    1)getting all data from customer_External _Inteface table where process_status = Pending ,
    and response status != success and interface type = ckyc 
*/ 

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

/* for loop on customer data to extract customerId and fetching customer data on it , 
*/

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

        $customerFolderDir = $outgoingTempDir.DIRECTORY_SEPARATOR.$interface_data['customer_id'];
        if (!is_dir($customerFolderDir)) {
            mkdir($customerFolderDir, 0777, true);
        }
        createPipeFile($customerFolderDir, $interface_data['customer_id'], $customer_dataArray);

    /*
        for now we are showing front image but we neeed to conver front and back to pdf 
        for addrss proof image id nad identiy proof image id ,  
    */

        $imageIds = array($customer_dataArray[0]['photo_image_id'], $customer_dataArray[0]['address_proof_image_id'], $customer_dataArray[0]['identity_proof_image_id'],$customer_dataArray[0]['identity_proof_reverse_image_id'], $customer_dataArray[0]['address_proof_reverse_image_id']);
        foreach($imageIds as $imageId){
            if(null ==$imageId){
                continue;
            }
            $photoImageUrl = $ImageApi.'/'.$imageId;
            $photoImagename = array_keys($customer_dataArray[0], $imageId)[0];
            $photoImage = $customerFolderDir.DIRECTORY_SEPARATOR.$photoImagename;
            file_put_contents($photoImage, file_get_contents($photoImageUrl));
        }
/*   updating ProcessingStatus in customer_external_interface table
*/    if($interface_data['response_status'] == 'FAILURE' && $customer_dataArray[0]['version']>$interface_data['customer_version']){
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
    }
}

/*  
    move content from temp to incomng for trackwizz and delete the temporary folder
*/
try{
    if (!is_dir($outgoingDir)) {
        mkdir($outgoingDir, 0777, true);
    }
    rcopy($outgoingTempDir, $outgoingDir);
    rrmdir($outgoingTempDir); 

} catch(Exception $e){
    echo "unable to copy and remove directory or making outgoing directory \n";
} 
 
/* Looking for outgoing folder 
*/ 
try{     
    if(is_dir($trackwizDir)){
        $files = new DirectoryIterator($trackwizDir);
        if($files){
            if (!is_dir($trackwizTempDir)) {
                mkdir($trackwizTempDir, 0777, true);
            }
            rcopy($trackwizDir, $trackwizTempDir);
            rrmdir($trackwizDir); 
            $fileTemp = new DirectoryIterator($trackwizTempDir);
            foreach($fileTemp as $file){
                $is_file = $file->isFile();
                if($is_file){
                    $inputFileName = $trackwizTempDir.DIRECTORY_SEPARATOR.$file->getFilename();
                    $ext = pathinfo($inputFileName, PATHINFO_EXTENSION);
                    if($ext == "xlsx"){
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
                                    ->where('customer_id', $customer_id)
                                    ->update(['response_status' => $customer_integration_status]);
                                } 
                            }catch(Exception $e){
                                echo "Uanble to process xlx response file from trackwizz " .$e."\n";
                                writeError($GLOBALS['customer_id'], "RESPONSEFAILURE", $e);
                            }
                        }
                    } elseif($ext == "txt"){
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
        }
    }
    rrmdir($trackwizTempDir);
    
} catch(Exception $e){
    echo "some error occured in response reading part \n";
}