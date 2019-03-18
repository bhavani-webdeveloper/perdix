<?php

require '_init.php';
require '_Pages.php';
header("Access-Control-Request-Method: GET");

$PM_QUERY = "
SELECT  *
FROM ".DB_SCHEMA.".role_report_access rra where rra.role_id = :roleId";
// "SELECT p.id, p.uri, rpa.id rpa_id, rpa.page_config
// FROM ".DB_SCHEMA.".pages p
// LEFT OUTER
// JOIN ".DB_SCHEMA.".role_page_access rpa ON p.id = rpa.page_id AND rpa.role_id = 
// ";

$role_id = (!empty($_GET['roleId'])) ? mysqli_real_escape_string($connection,$_GET['roleId']) : $_GET['roleId'];
if (empty($role_id)) {
	die('{"error":"Role Id is mandatory"}');
} else {
	$stmt = $connection->prepare($PM_QUERY);
	$stmt->bindParam(":roleId", $role_id);
	$stmt->execute();
	$result = $stmt->get_result();
}

if (!$result) {
	http_response_code(404);
	echo 'Invalid query: ' . $connection->error;
	return;
} else {
	$data = array();
	while($output = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		var_dump($output);
		$data[] = $output;
	}
	$query->close();
	http_response_code(200);
	header('X-Total-Count: 100');
	echo json_encode($data);
}

require '_end.php';
