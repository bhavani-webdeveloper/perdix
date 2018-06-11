<?php
include_once "bootload.php";
use Illuminate\Database\Capsule\Manager as DB;

$queryString = $_SERVER['QUERY_STRING'];
$key = $_GET["key"];

try {
    // reading the json
    $input = "  ";
    $str = file_get_contents('excel_upload_definition.json');
    $json = json_decode($str, true);

    if (!isset($json[$key])) {
        throw new Exception("key is not defined");
    }

    $tableName = $json[$key]['table'];
    $jsonColumns = $json[$key]['columns'];

    //reading excel File
    $inputFileType = PHPExcel_IOFactory::identify($_FILES['file']['tmp_name']);
    $objReader = PHPExcel_IOFactory::createReader($inputFileType);
    $objReader->setReadDataOnly(true);
    $excelFile = $objReader->load($_FILES['file']['tmp_name']);
    $sheet = $excelFile->getActiveSheet();
    $highestRow = $sheet->getHighestRow();
    $highestColumn = $sheet->getHighestColumn(1);
    $highestColumnNum = PHPExcel_Cell::columnIndexFromString($highestColumn);
    $excelColumns = $sheet->rangeToArray('A1:' . $highestColumn . '1', null, true, false);
    $rowData = $sheet->rangeToArray('A2:' . $highestColumn . $highestRow, null, true, false);

    $excelColumnIndex = [];
    for ($i = 0; $i < sizeOf($excelColumns[0]); $i++) {
        $excelColumnIndex[$excelColumns[0][$i]] = $i;
    }

    $colNames = [];
    $questions = [];
    for ($x = 0; $x < sizeOf($jsonColumns); $x++) {
        array_push($colNames, $jsonColumns[$x]['columnName']);
        array_push($questions, '?');
    }
    $insertTemplate = 'INSERT INTO ' . $tableName . '(' . join(', ', $colNames) . ') VALUES (' . join(', ', $questions) . ')';

    DB::beginTransaction();
    try {
        for ($n = 0; $n < sizeOf($rowData); $n++) {
            $values = [];
            for ($x = 0; $x < sizeOf($jsonColumns); $x++) {
                $val = '';
                if (isset($jsonColumns[$x]['fieldName'])) {
                    if (!isset($excelColumnIndex[$jsonColumns[$x]['fieldName']])) {
                        throw new Exception('Field "' . $jsonColumns[$x]['fieldName'] . '" is missing');
                    }
                    $idx = $excelColumnIndex[$jsonColumns[$x]['fieldName']];
                    $val = $rowData[$n][$idx];
                    if (isset($jsonColumns[$x]['required']) && $jsonColumns[$x]['required'] == true && empty($val)) {
                        throw new Exception('"' . $jsonColumns[$x]['fieldName'] . '" is required on row ' . ($n + 1));
                    }
                } else if (isset($jsonColumns[$x]['default'])) {
                    $val = $jsonColumns[$x]['default'];
                    if ($val == 'NULL') {
                        $val = null;
                    } else if ($val == 'NOW()') {
                        $val = Carbon\Carbon::now();
                    }
                } else {
                    throw new Exception("Excel field/default value not defined for column: " . $jsonColumns[$x]['columnName']);
                }
                array_push($values, $val);
            }
            $res1 = DB::insert($insertTemplate, $values);
        }
        if ($res1) {
            DB::commit();
            echo json_encode(["message" => 'Excel uploaded sucessfully']);
        } else {
            DB::rollback();
            throw new Exception('Row ' . ($n + 1) . ' failed');
        }
    } catch (Exception $dbe) {
        DB::rollback();
        throw $dbe;
    }
} catch (Exception $e) {
    die(json_encode(["error" => $e->getMessage()]));
}
