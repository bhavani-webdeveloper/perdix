<?php
namespace App\Services;
use App\Core\Settings;
use App\Services\PerdixService;
use App\Services\FolderConfig;
use Illuminate\Database\Capsule\Manager as DB;
use App\Services\Csv;

set_error_handler(function($errno, $errstr, $errfile, $errline, array $errcontext) {
    // error was suppressed with the @-operator
    if (0 === error_reporting()) {
        return false;
    }

    throw new \Extension($errstr);
});

class BulkReportDownload {
	private $authToken;
	private $biUrl;

	function __construct() {
		// Login the perdix server and get the token
		$perdixService= new PerdixService();
		$perdixService->login();

		// Get the base url from settingss
		$settings = Settings::getInstance()->getSettings();

		$this->authToken = $settings['perdix']['token'];
		$this->biUrl = $settings['bi_report']['bi_base_url']."/download.php";
	}

	public function bulkReport($reportName, $fileExtension, $parameter, $legendFile=1) {
		if(count($parameter)>0) {
			$folder = new FolderConfig();
			$csv = new csv();
			
			$fileDir = $this->zipNameFormat($reportName, $parameter[0]); // create folder 

			$baseUrl = $this->biUrl."?auth_token=".$this->authToken."&report_name=".$reportName."&";

			foreach($parameter as &$val) {
				$formatedReportName = $this->reportNameFormat($fileDir, $reportName, $fileExtension, $val); // format the report file name
				$downloadPath = $fileDir."/".$formatedReportName . "." . $fileExtension;
				$reportUrl = $baseUrl.http_build_query($val);

				// remove unwanted parameter from array
				unset($val['email']);
				unset($val['report_name_format']);
				unset($val['zip_name_format']);

				// insert report name for report parameter purpose
				$val = array("report_name"=>$formatedReportName) + $val;

				$this->reportDownload($reportUrl, $downloadPath);
			}
			
			// create csv for report name with parameter mapping
			if($legendFile) {
				$csv->create($fileDir, 'report_parameter_mapping', $parameter);
			}

			return $folder->createZip($fileDir);
		}
	}

	private function reportNameFormat($fileDir, $reportName, $fileExtension, $reportParameter) {
		$reportNameFormat = $reportName;
		if(array_key_exists("report_name_format", $reportParameter)) {
			$reportNameFormat = $reportParameter['report_name_format'];
			$replaceKey = array_keys($reportParameter);
			$replaceValue = array_values($reportParameter);

			array_walk($replaceKey, array($this, "reportNameKeyFormat"));
			$reportNameFormat = str_replace($replaceKey, $replaceValue, $reportNameFormat);
		}

		$count = 1;
		$reportNameCopy = $reportNameFormat;
		while (file_exists($fileDir."/".$reportNameFormat.".".$fileExtension)) {
			$reportNameFormat = $reportNameCopy . "_". $count;
			$count++;
		}
		return $reportNameFormat;
	}

	private function zipNameFormat($reportName, $parameter) {		
		$folder = new FolderConfig();
		if(array_key_exists("zip_name_format", $parameter)) {
			$fileDir = $parameter['zip_name_format'];
			$replaceKey = array_keys($parameter);
			$replaceValue = array_values($parameter);

			array_walk($replaceKey, array($this, "reportNameKeyFormat"));
			$fileDir = str_replace($replaceKey, $replaceValue, $fileDir);
			return $folder->createFolder($fileDir);
		}
		return $folder->createTempFolder($reportName."_".date("d-M-Y_H:i:s"), 0777, '_');
	}

	private function reportNameKeyFormat(&$item, $key) {
		$item = "{{".$item."}}";
	}

	public function reportDownload($reportUrl, $downloadPath) {
		//copy($reportUrl, $downloadPath);
		$downloadContent = file_get_contents($reportUrl);
		file_put_contents($downloadPath, $downloadContent);
	}
}