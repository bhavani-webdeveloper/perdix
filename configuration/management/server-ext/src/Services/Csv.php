<?php
namespace App\Services;

class Csv {
	public function create($path, $fileName, $data) {
		$filePath = $path . "/" . $fileName . ".csv";
		if(count($data) > 0) {
			// reset the array keys
			$data = array_values($data);

			$csv = fopen($filePath, "w");	
			$csvHeader = array_keys($data[0]);	// get the headers from the array
			fputcsv($csv, $csvHeader);
			foreach($data as $val) {
				fputcsv($csv, $val);
			}
			fclose($csv);
		}
	} 
}