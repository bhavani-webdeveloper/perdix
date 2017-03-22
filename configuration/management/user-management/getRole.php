<?php

require '_init.php';
header("Access-Control-Request-Method: GET");

$QUERY = "
SELECT
	r.id,
	r.name,
	r.access_level
FROM ".DB_SCHEMA.".roles r,
     ".DB_SCHEMA.".user_roles ur
WHERE r.id = ur.role_id
AND   lower(ur.user_id) = '";

try {
	if ($_SERVER['REQUEST_METHOD'] === 'GET') {
		if (empty($_GET['userId'])) {
			http_response_code(400);
			echo '{"error": "Required parameter user id is missing"}';
			return;
		}
		$q = $QUERY . strtolower($_GET['userId']) . "'";
		$stmt = $connection->prepare($q);
		$stmt->execute();
		$stmt->bind_result($id, $name, $access_level);
		$data = '';
		if ($stmt->fetch()) {
			$data = '{"id":'.$id.',"name":"'.$name.'","accessLevel":'.$access_level.'}';
		} else {
			$data = '{"error": "User Id '.$_GET['userId'].' does not have any roles mapped"}';
		}
		$stmt->close();
		http_response_code(200);
		echo $data;
	} else {
		http_response_code(400);
		echo '{"error":"Invalid Request"}';
	}
} catch (Exception $e) {
	http_response_code(500);
	echo '{"error":"'.$e->getMessage().'"}';
}

require '_end.php';
