<?php
ini_set('error_reporting', '0');

include("FormConnect.php");

// creates a compressed zip file 
function create_zip($files = array(),$file_path='', $destination = '',$overwrite = false) {
	//if the zip file already exists and overwrite is false, return false
	if(file_exists($destination) && !$overwrite) { return false; }
	//vars
	$valid_files = array();
	//if files were passed in...
	if(is_array($files)) {
		//cycle through each file
		foreach($files as $file) {
			//make sure the file exists
			if(file_exists($file_path.$file)) {
				$valid_files[] = $file;
			}
		}
	}
	//if we have good files...
	if(count($valid_files)) {
		//create the archive
		$zip = new ZipArchive();
		if($zip->open($destination,$overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
			return false;
		}
		//add the files
		foreach($valid_files as $file) {
			$zip->addFile($file_path.$file,$file);
		}
		//debug
		//echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;
		
		//close the zip -- done!
		$zip->close();
		
		//check to make sure the file exists
		return file_exists($destination);
	}
	else
	{
		return false;
	}
}


	$files_to_zip = "";
	$file_time = date('YmdHis');

	$form_record_code = $_GET['record_id'];

	$folder_name = date('YMd');
	
	//$customer_folder_name = $form_record_code.'_'.date('YMDHis');
	$customer_folder = $form_record_code.'_'.date('YMDHis');
	
	$jsp_form_link = "http://34.195.76.73:8080/forms/";
	$folder_path = "/opt/mount_point/nginx/management/forms/temp-forms/temp/";
	
	if (!file_exists($folder_path.$customer_folder)) {
		$old_umask = umask(0);
		mkdir($folder_path.$customer_folder, 0777);
		umask($old_umask);
	}	
	
	
	$get_all_form_names = mysqli_query($connection, "
	(SELECT 
     DOC.`forms_key` AS `FormKeys`,
     DOC.`document_name` AS `FormNames`,
     LOAN.AccountNumber AS `AccountNumber`
     FROM financialForms.`loan_account_documents` DOC
    LEFT JOIN (SELECT id, account_number as `AccountNumber`, `product_code` 
	    FROM financialForms.loan_accounts where id = '$form_record_code') LOAN
    ON DOC.product_code = LOAN.product_code
    LEFT JOIN financialForms.guarantor_details GUARANTOR_1 ON LOAN.id = GUARANTOR_1.loan_id
    WHERE DOC.`product_code` IN
        (SELECT product_code as `table_product_id` 
         FROM financialForms.loan_accounts 
         WHERE id = '$form_record_code')
    AND DOC.`download_required` = 1
    AND DOC.`forms_key` <> IF(GUARANTOR_1.gua_customer_id IS NULL, 'guarantor_agreement', '')
    ORDER BY DOC.id ASC)");
	
	if(mysqli_error($connection))
	{
		//echo 'Parent -> '.mysqli_error($connection);
		exit();
	}
	$individual_forms = "";
	$j = 0;
	
	while($stored_forms = mysqli_fetch_assoc($get_all_form_names))
	{
		$individual_forms[$stored_forms['FormKeys']] = str_replace(' ', '_', $stored_forms['FormNames']);
		
		if($j == 0)
		$AccountNumber = $stored_forms['AccountNumber'];
		
		$j++;
	}
	
	foreach($individual_forms AS $FormKeys => $FormNames)
	{
		$DownloadFileName = $FormNames."_".$AccountNumber.".PDF";
		$DownloadContent = file_get_contents($jsp_form_link."formPrint.jsp?form_name=".$FormKeys."&record_id=".$form_record_code); 
        
		file_put_contents($folder_path.$customer_folder."/".$DownloadFileName, $DownloadContent);
				
		$files_to_zip[] = $DownloadFileName;	
	}
	
	$attachment_zip_file = $AccountNumber;
	
	$files_folder_path = $folder_path.$customer_folder.'/';
	$zipping_folder_path = $folder_path.'/';
	
	create_zip($files_to_zip, $files_folder_path , $zipping_folder_path.$attachment_zip_file.".zip");
	
	foreach($files_to_zip AS $file_names)
	unlink($files_folder_path.$file_names);
	
	rmdir($folder_path.$customer_folder);
	
	header('Location: downloadIt.php?file='.$attachment_zip_file.'&file_type=zip');
?>
