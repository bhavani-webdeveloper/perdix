<?php

require '_init.php';

header("Access-Control-Request-Method: PUT");

$UPDATE_QUERY = "
UPDATE ".DB_SCHEMA.".user_roles SET user_id = ?, role_id = ? WHERE id = ?
";

$INSERT_QUERY = "
INSERT INTO ".DB_SCHEMA.".user_roles (user_id, role_id, created_at, last_edited_at) values (?, ?, now(), now())
";

try {
	$data = json_decode(file_get_contents('php://input'), true);
	if ($_SERVER['REQUEST_METHOD'] === 'PUT' && !empty($data['user_id']) && !empty($data['role_id']) && !empty($data['user_role_id'])) {
		$stmt = $connection->prepare($UPDATE_QUERY);
		$stmt->bind_param('sdd', $data['user_id'], $data['role_id'], $data['user_role_id']);
		$stmt->execute();
		$stmt->close();
		echo json_encode($data);
	} else if ($_SERVER['REQUEST_METHOD'] === 'PUT' && !empty($data['user_id']) && !empty($data['role_id']) && empty($data['user_role_id'])) {
		$stmt = $connection->prepare($INSERT_QUERY);
		$stmt->bind_param('sd', $data['user_id'], $data['role_id']);
		$stmt->execute();
		$stmt->close();
		$data['user_role_id'] = $connection->insert_id;
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
