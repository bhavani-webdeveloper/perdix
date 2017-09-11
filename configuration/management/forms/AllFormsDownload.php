<?php
// ini_set('error_reporting', '-1');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// REQUIRED FILES
include("config.php");
include("functions.php");

$files_to_zip = array();

// GET GROUP ID 
$form_record_code = $_GET['record_id'];
$customer_folder = $form_record_code.'_'.date('YMDHis'); // FOLDER NAME

// DOWNLOAD ALL FORMS TO CORRESPONDING CUSTOMER FOLDER
$get_all_form_names = mysqli_query($connection, "SELECT JLG.group_code, ACC.id, ACC.account_number FROM financialForms.jlg_groups JLG INNER JOIN financialForms.jlg_account_details JLG_ACC ON JLG.group_code = JLG_ACC.group_code INNER JOIN financialForms.loan_accounts ACC ON ACC.account_number = JLG_ACC.account_number WHERE JLG.id = $form_record_code");

if(mysqli_error($connection)) {
	echo mysqli_error($connection);
	exit();
}

if(mysqli_num_rows($get_all_form_names) == 0) {
	echo "Record not found";
	exit();
}
// CREATE NEW DIRECTORY FOR DOWNLOAD ALL PDF FILES
createFolder($folder_path, $customer_folder);

while($stored_forms = mysqli_fetch_assoc($get_all_form_names)) {
	if(count($files_to_zip) == 0) {
		$DownloadFileName = $stored_forms['group_code'].".PDF";;
		$DownloadContent = file_get_contents($jsp_form_link."formPrint.jsp?form_name=jlg_group&record_id=".$form_record_code); 
		file_put_contents($folder_path.$customer_folder."/".$DownloadFileName, $DownloadContent);
		chmod($folder_path.$customer_folder."/".$DownloadFileName, 0777); 
		$files_to_zip[] = $DownloadFileName;
	}
	$DownloadFileName = $stored_forms['account_number'].".PDF";;
	$DownloadContent = file_get_contents($jsp_form_link."formPrint.jsp?form_name=jlg_member&record_id=".$stored_forms['id']); 
	file_put_contents($folder_path.$customer_folder."/".$DownloadFileName, $DownloadContent);
	chmod($folder_path.$customer_folder."/".$DownloadFileName, 0777); 
	$files_to_zip[] = $DownloadFileName;
}

// ZIP THE CUSTOMER FOLDER
$files_folder_path = $folder_path.$customer_folder.'/';
$filename = $folder_path."/".$customer_folder.".zip";
create_zip($files_to_zip, $files_folder_path , $filename);
download($filename);
rmdir_recursive($folder_path.$customer_folder);
?>
