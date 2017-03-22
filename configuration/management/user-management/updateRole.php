<?php

require '_init.php';

header("Access-Control-Request-Method: PUT");

$UPDATE_QUERY = "
UPDATE ".DB_SCHEMA.".roles SET name = ?, access_level = ? WHERE id = ?
";

$INSERT_QUERY = "
INSERT INTO ".DB_SCHEMA.".roles (name, access_level) values (?, ?)
";

try {
	$data = json_decode(file_get_contents('php://input'), true);
	if ($_SERVER['REQUEST_METHOD'] === 'PUT' && !empty($data['role_id']) && !empty($data['role_name']) && !empty($data['role_access_level'])) {
		$stmt = $connection->prepare($UPDATE_QUERY);
		$stmt->bind_param('sdd', $data['role_name'], $data['role_access_level'], $data['role_id']);
		$stmt->execute();
		$stmt->close();
		// if ($connection->affected_rows != 1) {
		// 	header("Status: 500 Failed to process");
		// 	echo '{"error": "No roles found for the id"}';
		// } else {
		echo json_encode($data);
		// }
	} else if ($_SERVER['REQUEST_METHOD'] === 'PUT' && empty($data['role_id']) && !empty($data['role_name']) && !empty($data['role_access_level'])) {
		$stmt = $connection->prepare($INSERT_QUERY);
		$stmt->bind_param('sd', $data['role_name'], $data['role_access_level']);
		$stmt->execute();
		$stmt->close();
		$data['role_id'] = $connection->insert_id;
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
