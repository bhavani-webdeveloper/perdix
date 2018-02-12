<?php

require '_init.php';
require '_Pages.php';
header("Access-Control-Request-Method: GET");

$PM_QUERY = "
SELECT p.id, p.uri, rpa.id rpa_id, rpa.page_config, p.title, p.icon_class, p.state, p.page_name
FROM ".DB_SCHEMA.".pages p
LEFT OUTER
JOIN ".DB_SCHEMA.".role_page_access rpa ON p.id = rpa.page_id AND rpa.role_id = 
";

$role_id = $_GET['roleId'];

$query = $PM_QUERY;
if (empty($role_id)) {
	die('{"error":"Role Id is mandatory"}');
} else {
	$query = $PM_QUERY . $role_id;
}

$result = $connection->query($query);

if (!$result) {
	http_response_code(404);
	echo 'Invalid query: ' . $connection->error;
	return;
} else {
	$data = array();
	while($pages = $result->fetch_object('Pages')) {
		$res = $pages->getDataJSON();
		if ($res) {
			array_push($data, $res);
		} else {
			//var_dump($pages);
		}
	}
	$result->close();
	$joinedData = join(',', $data);
	$json = "[$joinedData]";

	http_response_code(200);
	header('X-Total-Count: 100');
	echo $json;
}

require '_end.php';
