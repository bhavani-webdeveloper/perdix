<?php

include_once("bootload.php");
$download = $_GET["download"];
if(isset($download)){
    $url_file = $_GET["file"];
    $url_file_type = $_GET["file_type"];
    $url_folder_name = $_GET["folder_name"];

    $url_file_name = $url_file.".".$url_file_type;

    $folder_path = $_GET["folder_path"];
    // $folder_path = getenv('ALL_FORMS_BASE_DIR');
    $folder_name = date('YMd').'/';

    $file_name = $folder_path.'/'.$url_file_name;
    echo($file_name);
    if(isset($url_folder_name)) {
        $file_name = $folder_path.'/'.$url_folder_name.'/'.$url_file_name;
    }
    if (file_exists($file_name)) {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header("Content-Type: application/force-download");
        header('Content-Disposition: attachment; filename=' . urlencode(basename($file_name)));
        header('Content-Transfer-Encoding: binary');
        header('Expires: 0');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Pragma: public');
        header('Content-Length: ' . filesize($file_name));
        ob_clean();
        flush();
        readfile($file_name);
        unlink($file_name);
        exit;
    }
}

else{

    $show_log = false;
    if (isset($_GET['show_log'])) {
        $show_log = true;
    }

    if ($show_log) {
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);
    }


    mysqli_report(MYSQLI_REPORT_STRICT); // Traps all mysqli error

    define('DB_HOST', getenv('DB_HOST'));
    define('DB_USER', getenv('DB_USER'));
    define('DB_PASSWORD', getenv('DB_PASSWORD'));

    $perdix_db = getenv('DB_NAME');
    $form_base_url = "http://sit.perdix.co.in:8080/sit_kgfs_forms";
    // $folder_path = getenv('ALL_FORMS_BASE_DIR');
    $folder_path = sys_get_temp_dir();

    try{
        try{
            $connection = new mysqli(DB_HOST, DB_USER, DB_PASSWORD);
        }catch(mysqli_sql_exception $e){
            throw $e;
        }
    }catch (Exception $e) {
        echo $e->getMessage();
        return;
    }

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

    $record_id = $_GET['record_id'];
    $type = empty($_GET['type'])? 'INDV': $_GET['type'];

    $folder_name = date('YMd');

    $files_folder_path = $folder_path.'/'.$type.'_'.$record_id.'_'.date('YMDHis').'/';
    if (!file_exists($files_folder_path)) {
        $old_umask = umask(0);
        mkdir($files_folder_path, 0777);
        umask($old_umask);
    }

    $query = [];

    $query['INDV'] = "
    SELECT
        DOC.`forms_key` AS `forms_key`,
        DOC.`document_name` AS `document_name`,
        '$record_id' AS `record_id`,
        'pdf' AS `file_extn`
    FROM $perdix_db.`loan_account_documents` DOC
    LEFT JOIN (
        SELECT id, account_number as `AccountNumber`, `product_code` 
        FROM $perdix_db.loan_accounts where id = '$record_id') LOAN
        ON DOC.product_code = LOAN.product_code
    LEFT JOIN $perdix_db.guarantor_details GUARANTOR_1
        ON LOAN.id = GUARANTOR_1.loan_id
    WHERE DOC.`product_code` IN
        (SELECT product_code
        FROM $perdix_db.loan_accounts
        WHERE id = '$record_id')
        AND DOC.`download_required` = 1
    ORDER BY DOC.id ASC
    ";

    $query['JLG'] = "
    SELECT 'personal_information' AS `forms_key`, 'personal_information' AS `document_name`, GM.customer_id AS `record_id`, 'html' AS `file_extn`
    FROM $perdix_db.jlg_groups G
    JOIN $perdix_db.jlg_group_members GM
        ON G.id = GM.group_id
    WHERE
        G.id = $record_id
    UNION ALL
    SELECT 'loan_agreement', 'loan_agreement', GLA.loan_id, 'html'
    FROM $perdix_db.jlg_groups G
    JOIN $perdix_db.jlg_account_details GLA
        ON G.group_code = GLA.group_code
    WHERE
        G.id = $record_id
    LIMIT 0, 1
    UNION ALL
    SELECT 'loan_utilization_check_form', 'loan_utilization_check_form', GLA.loan_id, 'html'
    FROM $perdix_db.jlg_groups G
    JOIN $perdix_db.jlg_account_details GLA
        ON G.group_code = GLA.group_code
    WHERE
        G.id = $record_id
    LIMIT 0, 1
    UNION ALL
    SELECT 'loan_application_front', 'loan_application_front', '$record_id', 'html'
    UNION ALL
    SELECT 'loan_application_back', 'loan_application_back', '$record_id', 'html'
    UNION ALL
    SELECT 'insurance_receipt', 'insurance_receipt', '$record_id', 'html'
    UNION ALL
    SELECT 'GRT', 'GRT', GLA.loan_id, 'html'
    FROM $perdix_db.jlg_groups G
    JOIN $perdix_db.jlg_account_details GLA
        ON G.group_code = GLA.group_code
    WHERE
        G.id = $record_id
    LIMIT 0, 1
    UNION ALL
    SELECT 'CGT', 'CGT', GLA.loan_id, 'html'
    FROM $perdix_db.jlg_groups G
    JOIN $perdix_db.jlg_account_details GLA
        ON G.group_code = GLA.group_code
    WHERE
        G.id = $record_id
    LIMIT 0, 1
    UNION ALL
    SELECT 'sanction_letter', 'sanction_letter', GLA.loan_id, 'html'
    FROM $perdix_db.jlg_groups G
    JOIN $perdix_db.jlg_account_details GLA
        ON G.group_code = GLA.group_code
    WHERE
        G.id = $record_id
    LIMIT 0, 1
    UNION ALL
    SELECT 'appraisal_and_verification', 'appraisal_and_verification', GM.customer_id, 'html'
    FROM $perdix_db.jlg_groups G
    JOIN $perdix_db.jlg_group_members GM
        ON G.id = GM.group_id
    WHERE
        G.id = $record_id
    ";

    if ($show_log) echo "<pre>Query:\n".$query[$type]."\n\n";

    $get_all_form_names = mysqli_query($connection, $query[$type])
        or die(mysqli_error($connection));

    $individual_forms = [];
    for ($j = 0; $stored_forms = mysqli_fetch_assoc($get_all_form_names); $j++) {
        $f = [];
        $f['forms_key'] = $stored_forms['forms_key'];
        $f['document_name'] = str_replace(' ', '_', $stored_forms['document_name']);
        $f['record_id'] = $stored_forms['record_id'];
        $f['file_extn'] = $stored_forms['file_extn'];
        $individual_forms[] = $f;
        if ($show_log) {
            echo "forms_key=".$f['forms_key'];
            echo ",\tdocument_name=".$f['document_name'];
            echo ",\trecord_id=".$f['record_id'];
            echo ",\tfile_extn=".$f['file_extn']."\n";
        }
    }
    mysqli_free_result($get_all_form_names);
    mysqli_close($connection);

    foreach ($individual_forms as $f) {
        $DownloadFileName = $f['document_name']."_".$f['record_id'].'.'.$f['file_extn'];
        $form_url = $form_base_url."/formPrint.jsp?form_name=".$f['forms_key']."&record_id=".$f['record_id'];

        if ($show_log) echo "\nDownloading <a href='$form_url' target='_blank'>$DownloadFileName</a>";

        $DownloadContent = file_get_contents($form_url);

        file_put_contents($files_folder_path.$DownloadFileName, $DownloadContent);

        $files_to_zip[] = $DownloadFileName;
    }

    $attachment_zip_file = $type.'_'.$record_id;

    $zipping_folder_path = $folder_path;
    $output_filename = $zipping_folder_path.'/'.$attachment_zip_file.".zip";

    create_zip($files_to_zip, $files_folder_path, $output_filename);

    foreach($files_to_zip AS $file_name) {
        unlink($files_folder_path.$file_name);
    }
    rmdir($files_folder_path);

    if ($show_log) {
         echo "\n\n".'<a href="testAllFormsDownload.php?file='.$attachment_zip_file.'&file_type=zip$download=auto" onclick="this.style.display=\'none\'">Download ZIP</a></pre>';
    } else {
        header('Location: testAllFormsDownload.php?folder_path='.$folder_path.'&file='.$attachment_zip_file.'&file_type=zip&download=auto');
    }
}
?>