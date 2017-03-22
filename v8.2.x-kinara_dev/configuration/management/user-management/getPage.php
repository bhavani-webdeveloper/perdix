<?php

require '_init.php';
require '_Roles.php';
header("Access-Control-Request-Method: GET");

$PM_QUERY = "
SELECT
	*
FROM ".DB_SCHEMA.".pages
WHERE uri = '
";

$uri = $_GET['uri'];

if (empty($uri)) {
	die('{"error":"URI is mandatory"}');
} else {
	$query = $PM_QUERY . $uri . "'";
}

$result = $connection->query($query);

if (!$result) {
	http_response_code(404);
	echo 'Invalid query: ' . $connection->error;
	return;
} else {
	$data = array();
	if($pages = $result->fetch_object('Pages')) {
		array_push($data, $pages->getDataJSON());
	}
	$result->close();
	$joinedData = join(',', $data);
	$json = "$joinedData";

	http_response_code(200);
	echo $json;
}

require '_end.php';
