<?php
include_once("bootload.php");

use App\Models\AdjustedPar;
use App\Models\CbsTableModel;
use App\Core\Settings;
use Illuminate\Database\Capsule\Manager as DB;

$baseUrl = $settings['perdix']['par_upload_path'];

$tempToBeProcessed = $baseUrl.DIRECTORY_SEPARATOR;

$files = new DirectoryIterator($tempToBeProcessed);
DB::enableQueryLog();
foreach ($files as $file) {
    //echo $tempToBeProcessed . $file->getFilename();
    if ($file->isFile()) {

        $inputFileName = $tempToBeProcessed . $file->getFilename();
        $ext = pathinfo($inputFileName, PATHINFO_EXTENSION);
        echo $ext . "\n";
        if ($ext != "xlsx") {
        	//echo $inputFileName;
        	continue;
        }

        if (strpos($inputFileName, 'PAR Upload Report') == false){
            //echo $inputFileName;
            continue;
        }
        $baseName = basename($inputFileName,".xlsx");
        $fileNameSplit = explode("_", $baseName);
                    echo "date: ".$fileNameSplit[1]."\n";
            echo DateTime::createFromFormat('dmY', $fileNameSplit[1])->format('dMY')."\n";
        if(sizeof($fileNameSplit) == 2 && DateTime::createFromFormat('dmY', $fileNameSplit[1])->format('dmY') === $fileNameSplit[1]){

            $date = DateTime::createFromFormat('dmY', $fileNameSplit[1]);
            $dateForDB = DateTime::createFromFormat('dmY', $fileNameSplit[1])->format('Y-m-d');
        } else {
            throw new Exception("There is no date in file Name: ".$inputFileName);
        }
        try {
            $inputFileType = PHPExcel_IOFactory::identify($inputFileName);
            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
            $objPHPExcel = $objReader->load($inputFileName);
            $sheet = $objPHPExcel->getSheet(0);
            $highestRow = $sheet->getHighestRow();
            $highestColumn = $sheet->getHighestColumn();
            echo $highestColumn . "\n";

            if ($highestColumn != "B") {
            	throw new Exception( $inputFileName." is not in proper format");
                die();
            }

            $cbsTableName;
            $CbsTableModel = new CbsTableModel($date);

            for ($row = 2; $row <= $highestRow; $row++) {
                $matrixData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row,
                    NULL,
                    TRUE,
                    FALSE);
                $rowData = $matrixData[0];
                if($rowData[0] == NULL) {
                	throw new Exception("The cell value of account_number or date column is empty in row No.".$row);
                }

                $cbsTableName = $CbsTableModel->getTable();
                echo $cbsTableName."\n";
                if($row == 2) {
                    $delRows = AdjustedPar::where('date' , '=', $dateForDB)->delete();
                    echo "deleted ".$delRows." rows in adjusted_par"."\n";
                    $r = $CbsTableModel->update(['AdjustedDelinquentDays' => NULL]);
                    echo "affected rows: ".$r."\n";
                }

                $createAdjustedPar = new AdjustedPar();
                $createAdjustedPar->account_number = $rowData[0];
                $createAdjustedPar->date = $dateForDB;
                $createAdjustedPar->AdjustedDelinquentDays = $rowData[1];
                $createAdjustedPar->save();
                $r1 = $CbsTableModel->where('AccountNumber', '=', $rowData[0])->update(['AdjustedDelinquentDays' => $rowData[1]]);
                //echo "row: ".$r1."\n";
            }
            //echo "row: ".$row."\n";
        }
        catch (Exception $e) {
            echo "fileName: ".$inputFileName.". Exception message: ".$e->getMessage();            
        }
    }
}
