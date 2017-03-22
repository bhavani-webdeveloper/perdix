<?php

require '_init.php';
header("Access-Control-Request-Method: GET");

$QUERY = "
SELECT
	id,
	name,
	access_level
FROM ".DB_SCHEMA.".roles
";

try {
	if ($_SERVER['REQUEST_METHOD'] === 'GET') {
		$stmt = $connection->prepare($QUERY);
		$stmt->execute();
		$stmt->bind_result($id, $name, $access_level);
		$data = [];
		while ($stmt->fetch()) {
			array_push($data, array('id'=>$id, 'name'=>$name, 'accessLevel'=>$access_level));
		}
		$stmt->close();
		http_response_code(200);
		header('X-Total-Count: ' . count($data));
		echo json_encode($data);
	} else {
		http_response_code(400);
		echo '{"error":"Invalid Request"}';
	}
} catch (Exception $e) {
	http_response_code(500);
	echo '{"error":"'.$e->getMessage().'"}';
}

require '_end.php';
