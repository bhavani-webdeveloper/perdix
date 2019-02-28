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
use App\Models\KycUploadMaster;
use App\Models\KycUploadDetail;
use App\Models\KycUploadProofMaster;
use App\Services\PerdixService;
use App\Core\Settings;
use App\Models\Customer;


$perdixService= new PerdixService();
$perdixService->login();
$settings = Settings::getInstance()->getSettings();
$api_url = $settings['perdix']['v8_url'];

$authHeader = "Bearer ". $settings['perdix']['token'];
$url = $settings['perdix']['v8_url'] . "/api/enrollments";
$fileUploadUrl = $api_url."/api/files/upload?category=Customer&subCategory=AGEPROOF";
$filePath=$settings['perdix']['partner_upload_path'];

$address_proof = collect([]);
$identity_proof = collect([]);
$proofTypeNames = KycUploadProofMaster::all();
foreach ($proofTypeNames as $proofTypeName){
    if("address_proof"==$proofTypeName->type)
        $address_proof->put($proofTypeName->name, $proofTypeName->filename);
    else  if("identity_proof"==$proofTypeName->type)
        $identity_proof->put($proofTypeName->name, $proofTypeName->filename);
}
//echo $authHeader;
print_r($identity_proof);
print_r($address_proof);

if ( 0777  !== (fileperms($filePath) & 0777)) {
    die( "<br/> file is not writable and it has the following file permissions : $filePath" );
} 


//$baseUrl = $settings['perdix']['customer_upload_path'];

function formatValidation($extension){
    return ( strcasecmp("pdf",$extension)==0 || 
                strcasecmp("tif",$extension)==0 || 
                    strcasecmp("tiff",$extension)==0 ||
                        strcasecmp("jpg",$extension)==0 ||
                            strcasecmp("jpeg",$extension)==0 );
}

function sizeValidation($path){
    $MAX_SIZE=20971520;
    return filesize($path)<$MAX_SIZE;
}

function validation($type, $path) {
    if(!file_exists($path))
        return false;
    $extension= pathinfo($path, PATHINFO_EXTENSION);
    $basename=pathinfo($path, PATHINFO_BASENAME);
    $filename= str_replace('.'.$extension, '', $basename);
    return formatValidation($extension) ;
}

function getFileByType($type, $customer){
    global $address_proof;
    global $identity_proof;
    global $filePath;
    $absolutepath="";
    $path = $filePath . DIRECTORY_SEPARATOR .$customer['partner_code']. DIRECTORY_SEPARATOR . $customer['customer_partner_number']. DIRECTORY_SEPARATOR ;
    //echo "<br/> Path : ".$path;
    switch ($type) {
        case "Photo":
            $absolutepath = $path."Photo.*";
            break;
        case "address_proof": 
            $absolutepath =  $path .$address_proof->get($customer[$type]).".*";
            break;
        case "identity_prof": 
            $absolutepath =  $path .$identity_proof->get($customer[$type]).".*";
            break;
    }
    //echo "<br/> absolutepath : ".$absolutepath;
    $isFormatMissmatch=false;
    foreach(glob($absolutepath) as $filename){
        if(validation($type,$filename)){
            return $filename;
        }
    }
    throw new PDOException($type.' Not found Or File format is Mismatch');
}

function uploadFile ($path)  {
    global $authHeader;
    global $fileUploadUrl;
    try {
        $client = new GuzzleClient();
        $reqRes = $client->request('POST', $fileUploadUrl, [
            'headers' => [
                'Authorization' => $authHeader
            ],
            'multipart' => [
                [
                    'name'     => 'file',
                    'contents' => file_get_contents($path),
                    'filename' => $path
                ]
            ],
        ]);
        $responseBody = $reqRes->getBody()->getContents();
        $parsedArr = \GuzzleHttp\json_decode($responseBody, true);
        //echo "<br/> success" . "\n";
        return $parsedArr['fileId'];

    } catch (Exception $e) {
        throw new PDOException('File Uploading is Failed : '.$e);
    }
    return;

}


function getCustomer($id){
    global $url;
    global $authHeader;
    
    $client = new GuzzleClient();
	$reqRes = $client->request('GET', $url."/".$id, [
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

function saveCustomer($customer){
    global $url;
    global $authHeader;
    //var_dump($customer);
    //$customer->partnerCode="Kinara";
    $reqBody = (object) [
        'customer' => $customer,
        'enrollmentAction' => "PROCEED"];

    //var_dump(json_encode($reqBody)); 
    $client = new GuzzleClient();
    $reqRes = $client->request('PUT', $url, [
            'headers' => [
                'Authorization' => $authHeader,
                'content-type' => 'application/json'
            ],
            'body' => json_encode($reqBody),
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

$partners = array_filter(glob($filePath.'/*'), 'is_dir');

foreach ($partners as $partner) {

    echo "<br/><br/><br/>Parner Name  :  $partner";

    if($partner=="Internal")
        continue;

    $files = new DirectoryIterator($partner);

    echo "<br/> Search Excel Sheet File ";
    foreach ($files as $file) {
        //echo $partner . $file->getFilename();
        
        if ($file->isFile()) {
            echo "<br/>File Name : ".$file->getFilename();
            //echo "<br/> temp : ". $tempCompletedDir;
            $source = $partner . DIRECTORY_SEPARATOR . $file->getFilename();
            $dest = $tempWipDir . $file->getFilename();

            $extSource = pathinfo($source, PATHINFO_EXTENSION);
    
            if ($extSource == "txt" )
                continue;
            
            copy($source, $dest);
            $do =unlink($source);
            if($do=="1"){ 
                echo "<br/> The file was deleted successfully. : ".$file->getFilename(); 
            } else { 
                echo "<br/> There was an error trying to delete the file. : ".$file->getFilename(); 
            } 


            $inputFileName = $tempWipDir . $file->getFilename();
            echo "<br/>".$file." File Moved to ".$dest."<br/><br/>";
            //print_r( "<br/>inputFileName : ".$inputFileName);

            $ext = pathinfo($inputFileName, PATHINFO_EXTENSION);

            if ($ext != "xlsx" ) {
                $source = $tempWipDir .$file->getFilename();
                $dest = $tempRejectedDir . $file->getFilename();

                copy($source, $dest);
                unlink($source);
                echo "<br/><br/>".$file." File Moved to ".$dest;
                continue;
            }
            try {

                echo "Reading Excel sheet";
                $inputFileType = PHPExcel_IOFactory::identify($inputFileName);
                $objReader = PHPExcel_IOFactory::createReader($inputFileType);

                $objPHPExcel = $objReader->load($inputFileName);
                $sheet = $objPHPExcel->getSheet(0);
                $highestRow = $sheet->getHighestRow();
                $highestColumn = $sheet->getHighestColumn();


                $kycUploadMaster = new KycUploadMaster();
                $kycUploadMaster->filename = $inputFileName;
                $kycUploadMaster->total_records = ($highestRow - 1);
                $kycUploadMaster->failed_records = 0;
                $kycUploadMaster->status = 'PROCESSING';
                $kycUploadMaster->save();

                $failedCount = 0;
                $IdGenerated = $kycUploadMaster->id;
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

                        $customer = new Customer();
                        //$customer = $customer::where('old_customer_id', '=', $rowData[1])->firstOrFail();


                        $customer = $customer::join('customer_partner', function($join) {
                            $join->on('customer.id', '=', 'customer_partner.customer_id');
                          })
                          ->where('old_customer_id', '=', "".$rowData[1])
                          ->first([
                              'customer.id',
                              'customer.first_name',
                              'customer_partner.partner_code',
                              'customer.address_proof',
                              'customer.identity_prof',
                              'customer_partner.customer_partner_number'
                          ]);

                        //echo $customer;
                        $apiCustomer = getCustomer($customer['id']);
                        //print_r($customer);

                        echo "<br/><br/> Customer : ".$customer['id'];

                        $content=$content. PHP_EOL . PHP_EOL . "Customer : ".$rowData[1];
                        $path = $partner . DIRECTORY_SEPARATOR .$rowData[1];
                        if(!file_exists($path))
                            throw new PDOException($rowData[1].' Folder not Exist');

                        $photoPath = getFileByType("Photo",$customer);
                        echo "<br/>Customer Photo Path : ".$photoPath;
                        if($photoPath){
                            $apiCustomer->photoImageId = uploadFile($photoPath);
                            echo "<br/>Customer Photo ID : ".$apiCustomer->photoImageId;
                        }   
          
                        echo "<br/>Address Proof : ".$customer->address_proof;
                        $address_proof_path = getFileByType("address_proof",$customer);
                        echo "<br/>Customer Address Proof Path : ".$address_proof_path;
                        if($address_proof_path){
                            $apiCustomer->addressProofImageId =uploadFile($address_proof_path);
                            echo "<br/>Customer Address Proof ID : ".$apiCustomer->addressProofImageId;
                        }
                
                        echo "<br/>Identity Proof : ".$customer->identity_prof;
                        $identityPath = getFileByType("identity_prof",$customer);
                        echo "<br/>Customer Identity Proof Path : ".$identityPath;
                        if($identityPath){
                            $apiCustomer->identityProofImageId =uploadFile($identityPath);
                            echo "<br/>Customer Address Proof ID : ".$apiCustomer->identityProofImageId;
                        }
                
                        saveCustomer($apiCustomer);

                        $kycUploadDetail = new KycUploadDetail();
                        $kycUploadDetail->master_id = $IdGenerated;
                        $kycUploadDetail->customer_id = $customer["customer_partner_number"];
                        $kycUploadDetail->customer_name = $customer["first_name"];
                        $kycUploadDetail->is_processed = true;
                        $kycUploadDetail->status = 'SUCCESS';
                        $kycUploadDetail->request_json = 'NA';
                        $kycUploadDetail->error_response = 'NA';
                        $kycUploadDetail->save();
                        $content=$content. PHP_EOL . "Status : Success";
    
                    }catch(Exception $e1)
                    {
                        echo "<br/><br/> error ".$e1->getMessage();
                        $kycUploadDetail = new KycUploadDetail();
                        $kycUploadDetail->master_id = $IdGenerated;
                        $kycUploadDetail->customer_id = $customer["customer_partner_number"];
                        $kycUploadDetail->customer_name = $customer["first_name"];
                        $kycUploadDetail->is_processed = true;
                        $kycUploadDetail->status = 'FAILED';
                        $kycUploadDetail->request_json = json_encode($customer);
                        $kycUploadDetail->error_response = $e1->getMessage();
                        $kycUploadDetail->save();
                        //var_dump($customerUploadDetail->toArray());
                        $failedCount++;
                        $content=$content. PHP_EOL . "Status : Fails";
                        $content=$content. PHP_EOL . "Error  : ".$e1->getMessage();

                        //json_encode($customer);
                    }
                };
                // End LooP
                $kycUploadMaster->failed_records = $failedCount;
                $kycUploadMaster->status = 'PROCESSED';
                $kycUploadMaster->save();

                $tempPartnerCompleteDir=$tempCompletedDir .$rowData[0]. DIRECTORY_SEPARATOR;
                if (!is_dir($tempPartnerCompleteDir )) {
                    mkdir($tempPartnerCompleteDir, 0777, true);
                }

                $source = $tempWipDir . $file->getFilename();
                $dest = $tempPartnerCompleteDir .$file->getFilename();
                copy($source, $dest);
                unlink($source);
                echo "<br/><br/>".$file." File Moved to ".$dest;

                $reportFilepath = $partner . DIRECTORY_SEPARATOR . $file->getFilename();    
                $extension= pathinfo($reportFilepath, PATHINFO_EXTENSION);
                $reportFileName= str_replace('.'.$extension, '.txt', $reportFilepath);

                $fp = fopen($reportFileName,"w");
                if ($fp === false) {
                    echo "<br/> Fail to create file : '$reportFileName' ";
                }else if (fwrite($fp, $content)){       
                    echo "<br/> Log File Created : ". $reportFileName;
                }
                fclose($fp);


            } catch (Exception $e) {
                $source = $tempWipDir . $file->getFilename();
                $dest = $tempRejectedDir . $file->getFilename();
                copy($source, $dest);
                unlink($source);
                echo "<br/><br/>".$file." File Moved to ".$dest;
                continue;
                //throw $e;
            }

        }
    }

}

