<?php

require '_init.php';

header("Access-Control-Request-Method: PUT");

$DELETE_QUERY = "
DELETE FROM ".DB_SCHEMA.".role_report_access WHERE role_id = ?
";

$INSERT_QUERY = "
INSERT INTO ".DB_SCHEMA.".role_report_access (role_id, report_name, config) values (?, ?, ?)
";

try {
	$data = json_decode(file_get_contents('php://input'), true);
	if ($_SERVER['REQUEST_METHOD'] === 'PUT' && !empty($data['role_id']) && count($data['reports']) > 0) {
		$stmt = $connection->prepare($DELETE_QUERY);
		$stmt->bind_param('d', $data['role_id']);
		$stmt->execute();
		$stmt->close();
		$stmt = $connection->prepare($INSERT_QUERY);
		$c = count($data['reports']);
		for ($i = 0; $i < $c; $i++) {
			$stmt->bind_param('dss', $data['role_id'], $data['reports'][$i]['report_name'], $data['reports'][$i]['config']);
			$stmt->execute();
		}
		$stmt->close();
		echo json_encode($data);
	} else {
		header("Status: 400 Bad Request");
		echo '{"error":"Invalid Request"}';
	}
} catch (Exception $e) {
	header("Status: 500 Failed to process");
	echo '{"error":"'.$e->getMessage().'"}';
}

require '_end.php';
