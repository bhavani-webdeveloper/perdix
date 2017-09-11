<?php
$url_file = $_GET["file"];
$url_file_type = $_GET["file_type"];
$url_folder_name = $_GET["folder_name"];

$url_file_name = $url_file.".".$url_file_type;

$folder_path = "/opt/mount_point/nginx/management/forms/temp-forms/temp/";
$folder_name = date('YMd').'/';

$file_name = $folder_path.$url_file_name;

if(isset($url_folder_name))
$file_name = $folder_path.$url_folder_name.'/'.$url_file_name;

if (file_exists($file_name))
{
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header("Content-Type: application/force-download");
    header('Content-Disposition: attachment; filename=' . urlencode(basename($file_name)));
    // header('Content-Transfer-Encoding: binary');
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
?>
