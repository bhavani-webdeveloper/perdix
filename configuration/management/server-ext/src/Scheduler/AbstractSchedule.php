<?php
namespace App\Scheduler;
use Illuminate\Database\Capsule\Manager as DB;
use App\Services\BulkReportDownload;
use App\Services\SftpFileUpload;
use App\Services\SendMail;
use App\Services\FolderConfig;
use App\Core\Settings;

abstract class AbstractSchedule {
	public function queryParameter($query=null) {
		$settings = Settings::getInstance()->getSettings();
		// Get DB names from env file
		$dbList = array('bi_db'=>$settings['bi_db']['database'],'encore_db'=>$settings['encore_db']['database'], 'perdix_db'=>$settings['db']['database']);

		if($query) {
			// Fetch query list
			try {
				$query = str_replace(array_keys($dbList), array_values($dbList), $query);

				$parameter = DB::select($query);
				return $parameter;
			} catch(\Illuminate\Database\QueryException $e) {
				throw $e;				
			}
		} else {
			throw new \Exception("Parameter query is not null");
		}
	}

	protected function generateReport($parameter, $report) {				
		$bulkDownload = new BulkReportDownload();
		$sendMail = new SendMail();	
		// get mail sender details 
		$settings = Settings::getInstance()->getSettings();
		$senderName = $settings['mail_sender']['name'];
		$senderMail = $settings['mail_sender']['mail'];

		$parameter = json_decode(json_encode($parameter), true); // convert obj to array
		$emailList = array_unique(array_column($parameter, 'email')); // get list of parameter mail ID
		$zipFiles = array();

		// Check the trigger is available
		if((!empty($report->sftp_host) && !empty($report->sftp_username) && !empty($report->sftp_password) && !empty($report->sftp_path) && !empty($report->sftp_port)) || !empty($report->email) || count($emailList)>0) { 
			if(count($emailList)>0) {
				foreach($emailList as $email) { // checking with mail variables
					$filterParam = array_filter($parameter, function($item) use($email) {
						return $item['email'] == $email;	
					});

					$bulkFolder = $bulkDownload->bulkReport($report->report_name, $report->file_extension, $filterParam, $report->legend_file);

					if(!empty($email)) {
						$sendMail->send($email, "Scheduled report", "Schedule report is attached to this mail. Please find the attachment", $senderMail, $senderName, array(0=>$bulkFolder));
					}
					$zipFiles[] = $bulkFolder;
				}
			} else {
				$bulkFolder = $bulkDownload->bulkReport($report->report_name, $report->file_extension, $parameter, $report->legend_file);

				$zipFiles[] = $bulkFolder;
			}
		} else {
			throw new \Exception("Please provide one of trigger(SFTP, email, email parameter)");			
		}

		// Send mail 
		if(!empty($report->email)) {
			$sendMail->send($report->email, "Scheduled report", "Schedule report is attached to this mail. Please find the attachment", $senderMail, $senderName, $zipFiles);
		}
		if(!empty($report->sftp_host) && !empty($report->sftp_username) && !empty($report->sftp_password) && !empty($report->sftp_path) && !empty($report->sftp_port)) {
			// upload file to SFTP folder
			$this->uploadGeneratedReport($zipFiles, $report);
		}

		// remove the folder and zip files from tmp directory
		$this->removeGeneratedFiles($zipFiles);

	}

	protected function uploadGeneratedReport($zipFiles, $report) {
		try {
			$sftp = new SftpFileUpload($report->sftp_host, $report->sftp_username, $report->sftp_password, $report->sftp_port);
			foreach($zipFiles as $zipFile) {
				$sftp->fileUpload($zipFile, $report->sftp_path.'/'.basename($zipFile));
			} 
		} catch(\Exception $e) {			
			$this->removeGeneratedFiles($zipFiles);
			throw $e;
		}
	}

	protected function removeGeneratedFiles($zipFiles) {	
		$folder = new FolderConfig();
		forEach($zipFiles as $zipFile) {
			$folder->removeDir(trim($zipFile, ".zip"));
			$folder->removeFile($zipFile);
		}
	}
	
	abstract protected function schedule();
}