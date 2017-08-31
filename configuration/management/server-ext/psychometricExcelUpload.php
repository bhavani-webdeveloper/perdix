<?php

include_once("bootload.php");

define('UPLOAD_PATH', 'uploads');

function loadUploadWebPage($sql) {
	header('Content-Type: text/html');
	ob_start();
?><!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.1/css/materialize.min.css">
	<link href="http://materializecss.com/css/ghpages-materialize.css" type="text/css" rel="stylesheet" media="screen,projection">
	<title>Psychometric Excel Upload</title>
</head>
<body>
<div class="container">
	<div class="row">
		<div class="col s12">
			<h2 class="header"></h2>
			<div class="row">
				<div class="col s12 l6">
					<form name="psyForm" action="" method="POST" enctype="multipart/form-data">
						<div class="card">
							<div class="card-image">
								<img src="https://static1.squarespace.com/static/51623c20e4b01df404d682ae/51623c21e4b01df404d682b5/53c67f34e4b0de38981841b5/1498151380351/?format=1500w">
								<span class="card-title">Psychometric Excel Bulk Upload</span>
							</div>
							<div class="card-content">
								<div class="file-field input-field">
									<div class="btn">
										<span>Choose Questions Excel</span>
										<input type="file" name="excelFile">
									</div>
									<div class="file-path-wrapper">
										<input class="file-path validate" type="text" placeholder="No file chosen">
									</div>
								</div>
								<div class="file-field input-field">
									<div class="btn">
										<span>Choose Images Zip</span>
										<input type="file" name="imagesZip">
									</div>
									<div class="file-path-wrapper">
										<input class="file-path validate" type="text" placeholder="No file chosen">
									</div>
								</div>
							</div>
							<div class="card-action">
								<a href="#" id="genBtn" onClick="showProgress();psyForm.submit();">Generate SQL</a>
								<?php if (!empty($sql)) { ?><a href="<?= $sql ?>" onClick="">Download SQL</a><?php } ?>
							</div>
						</div>
					</form>
					<div class="progress" style="display: none"><div class="indeterminate"></div></div>
				</div>
			</div>
		</div>
	</div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.1/js/materialize.min.js"></script>
<script>
	$(document).ready(function() {
		Materialize.updateTextFields();
		selectText('selectable');
		$('#genBtn').hide();
		$('input[name=excelFile],input[name=imagesZip]').change(function() {
			if ($('input[name=excelFile]').val() && $('input[name=imagesZip]').val()) {
				$('#genBtn').show();
			} else {
				$('#genBtn').hide();
			}
		});
	});
	function showProgress() {
		$('.progress').show();
	}
	function selectText(containerid) {
		if (!document.getElementById(containerid)) {
			return;
		}
		if (document.selection) {
			var range = document.body.createTextRange();
			range.moveToElementText(document.getElementById(containerid));
			range.select();
		} else if (window.getSelection) {
			var range = document.createRange();
			range.selectNode(document.getElementById(containerid));
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
		}
	}
</script>
</body>
</html><?php
	$out = ob_get_contents();
	ob_end_clean();
	return $out;
}

function getImageTag($imageContents, $mime) {
	return '<img src="data:'.$mime.';base64,'.base64_encode($imageContents).'">';
}

function insertQuestionSQL($id, $category, $difficulty, $type, $paired, $linked, $link_order, $pictorial, $active) {
	if (empty($paired)) {
		$paired = 'NULL';
	}
	if (empty($linked)) {
		$linked = 'NULL';
	}
	if (empty($link_order)) {
		$link_order = 'NULL';
	}
	return "INSERT INTO `ps_question`(`id`, `category`, `difficulty`, `type`, `paired`, `linked`, `link_order`, `pictorial`, `active`) VALUES ($id, $category, '$difficulty', '$type', $paired, $linked, $link_order, $pictorial, $active);\n";
}

function insertQuestionLangSQL($id, $question_id, $lang_code, $question_text) {
	$question_text = str_replace("'", "\\'", $question_text);
	return "INSERT INTO `ps_question_lang`(`id`, `question_id`, `lang_code`, `question_text`) VALUES ($id, $question_id, '$lang_code', '$question_text');\n";
}

function insertQuestionOptSQL($id, $question_id, $option_score, $linked_option_id, $option_key) {
	return "INSERT INTO `ps_question_options`(`id`, `question_id`, `option_score`, `linked_option_id`, `option_key`) VALUES ($id, $question_id, $option_score, $linked_option_id, '$option_key');\n";
}

function insertQuestionLangOptSQL($id, $question_lang_id, $option_id, $option_text) {
	$option_text = str_replace("'", "\\'", $option_text);
	return "INSERT INTO `ps_question_lang_options`(`id`, `question_lang_id`, `option_id`, `option_text`) VALUES ($id, $question_lang_id, $option_id, '$option_text');\n";
}

function excelToSQL($file, $imageZipFile) {
	if (strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) !== 'xlsx') {
		return null;
	}
	if (strtolower(pathinfo($imageZipFile['name'], PATHINFO_EXTENSION)) !== 'zip') {
		return null;
	}

	$imagesZip = zip_open($imageZipFile['tmp_name']);
	$imagesMap = [];
	if ($imagesZip) {
		while ($image = zip_read($imagesZip)) {
			$imageName = zip_entry_name($image);
			if (zip_entry_open($imagesZip, $image, "r")) {
				$imageContents = zip_entry_read($image, zip_entry_filesize($image));
				$imagesMap[$imageName] = getImageTag($imageContents, 'image/'.pathinfo($imageName, PATHINFO_EXTENSION));
				zip_entry_close($image);
			}
		}
		zip_close($imagesZip);
	}

	$inputFileType = PHPExcel_IOFactory::identify($file['tmp_name']);
	$objReader = PHPExcel_IOFactory::createReader($inputFileType);
	$objReader->setReadDataOnly(true);
	$excelFile = $objReader->load($file['tmp_name']);

	$parameterSheet = $excelFile->getSheetByName('parameter');
	$parameterHighestRow = $parameterSheet->getHighestRow();
	$parameterHighestColumn = $parameterSheet->getHighestColumn();
	$parameterHighestColumnNum = PHPExcel_Cell::columnIndexFromString($parameterHighestColumn);
	if ($parameterHighestColumnNum < 2) {
		echo "parameter sheet doesn't have required no. of columns";
		return null;
	}
	$parameterMatrix = $parameterSheet->rangeToArray('A2:B'.$parameterHighestRow, NULL, TRUE, FALSE);
	$parameterMap = [];
	foreach ($parameterMatrix as $v) {
		$parameterMap[$v[1]] = $v[0]; // 'Integrity' => 1
	}

	$questionSQL = "-- ps_question\n";
	$questionLangSQL = "\n\n-- ps_question_lang\n";
	$questionOptionsSQL = "\n\n-- ps_question_options\n";
	$questionsLangOptionsSQL = "\n\n-- ps_question_lang_options\n";

	$questionSheet = $excelFile->getSheetByName('question');
	$questionHighestRow = $questionSheet->getHighestRow();
	$questionHighestColumn = $questionSheet->getHighestColumn();
	$questionHighestColumnNum = PHPExcel_Cell::columnIndexFromString($questionHighestColumn);
	if ($questionHighestColumnNum < 9) {
		echo "question sheet doesn't have required no. of columns";
		return null;
	}
	$questionMatrix = $questionSheet->rangeToArray('A2:I'.$questionHighestRow, NULL, TRUE, FALSE);
	foreach ($questionMatrix as $v) {
		$x = $parameterMap[$v[1]];
		$questionSQL .= insertQuestionSQL($v[0], $x, $v[2], $v[3], $v[4], $v[5], $v[6], $v[7], $v[8]);
	}

	$questionLangSheet = $excelFile->getSheetByName('question_lang');
	$questionLangHighestRow = $questionLangSheet->getHighestRow();
	$questionLangHighestColumn = $questionLangSheet->getHighestColumn();
	$questionLangHighestColumnNum = PHPExcel_Cell::columnIndexFromString($questionLangHighestColumn);
	if ($questionLangHighestColumnNum < 4) {
		echo "question_lang sheet doesn't have required no. of columns";
		return null;
	}
	$questionLangMatrix = $questionLangSheet->rangeToArray('A2:D'.$questionLangHighestRow, NULL, TRUE, FALSE);
	$questionLangMap = [];
	foreach ($questionLangMatrix as $i => $v) {
		$v[4] = $i+1; // AUTO_INCREMENT id
		$questionLangMap[$v[0].'-'.$v[1]] = $v; // question_id-lang_code => $questionLang
		if ($v[3] == 1 && isset($imagesMap[$v[2]])) {
			$v[2] = $imagesMap[$v[2]];
		}
		$questionLangSQL .= insertQuestionLangSQL($v[4], $v[0], $v[1], $v[2]);
	}

	$questionOptSheet = $excelFile->getSheetByName('question_options');
	$questionOptHighestRow = $questionOptSheet->getHighestRow();
	$questionOptHighestColumn = $questionOptSheet->getHighestColumn();
	$questionOptHighestColumnNum = PHPExcel_Cell::columnIndexFromString($questionOptHighestColumn);
	if ($questionOptHighestColumnNum < 5) {
		echo "question_options sheet doesn't have required no. of columns";
		return null;
	}
	$questionOptMatrix = $questionOptSheet->rangeToArray('A2:E'.$questionOptHighestRow, NULL, TRUE, FALSE);
	$questionOptMap = [];
	foreach ($questionOptMatrix as $i => $v) {
		$v[1] = strtoupper($v[1]);
		$v[4] = strtoupper($v[4]);
		$v[5] = $i+1; // AUTO_INCREMENT id
		$questionOptMap[$v[0].'-'.$v[1]] = $v; // question_id-option_key => $questionOpt
	}
	foreach ($questionOptMap as $i => $v) {
		$v[6] = 0;
		if (!empty($v[3]) && !empty($v[4])) {
			$v[6] = $questionOptMap[$v[3].'-'.$v[4]][5]; // linked_option_id
		}
		$questionOptionsSQL .= insertQuestionOptSQL($v[5], $v[0], $v[2], $v[6], $v[1]);
	}

	$questionLangOptSheet = $excelFile->getSheetByName('question_lang_options');
	$questionLangOptHighestRow = $questionLangOptSheet->getHighestRow();
	$questionLangOptHighestColumn = $questionLangOptSheet->getHighestColumn();
	$questionLangOptHighestColumnNum = PHPExcel_Cell::columnIndexFromString($questionLangOptHighestColumn);
	if ($questionLangOptHighestColumnNum < 5) {
		echo "question_lang_options sheet doesn't have required no. of columns";
		return null;
	}
	$questionLangOptMatrix = $questionLangOptSheet->rangeToArray('A2:E'.$questionLangOptHighestRow, NULL, TRUE, FALSE);
	$questionLangOptMap = [];
	foreach ($questionLangOptMatrix as $i => $v) {
		$v[1] = strtoupper($v[1]);
		$v[5] = $i+1; // AUTO_INCREMENT id
		$v[6] = $questionLangMap[$v[0].'-'.$v[2]][4];// question_lang_id
		$v[7] = $questionOptMap[$v[0].'-'.$v[1]][5];// option_id
		if ($v[4] == 1 && isset($imagesMap[$v[3]])) {
			$v[3] = $imagesMap[$v[3]];
		}
		$questionsLangOptionsSQL .= insertQuestionLangOptSQL($v[5], $v[6], $v[7], $v[3]);
	}

	$sql = "DELETE FROM ps_question_lang_options;\nDELETE FROM ps_question_options;\nDELETE FROM ps_question_lang;\nDELETE FROM ps_question;\n\n\n";
	$sql .= $questionSQL . $questionLangSQL . $questionOptionsSQL . $questionsLangOptionsSQL;
	return $sql;
}

if (!isset($_FILES['excelFile']) || !file_exists($_FILES['excelFile']['tmp_name']) || !is_uploaded_file($_FILES['excelFile']['tmp_name'])) {
	echo loadUploadWebPage('');
} else {
	$sql = excelToSQL($_FILES['excelFile'], $_FILES['imagesZip']);
	if (!empty($sql)) {
		$sqlFileName = UPLOAD_PATH.DIRECTORY_SEPARATOR."psy_bulk".date("_Y-m-d_").uniqid().".sql";
		$sqlFile = fopen(__DIR__.DIRECTORY_SEPARATOR.$sqlFileName, "w");
		fwrite($sqlFile, $sql);
		fclose($sqlFile);

		echo loadUploadWebPage($sqlFileName);
	}
}
