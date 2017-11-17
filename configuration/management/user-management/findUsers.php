<?php

require '_init.php';

header("Access-Control-Request-Method: PUT");

$QUERY = "
SELECT u.user_id, u.user_name, ur.role_id, r.name role_name, ur.id user_role_id
FROM ".DB_SCHEMA.".users u
  LEFT JOIN ".DB_SCHEMA.".user_roles ur ON u.user_id = ur.user_id
  LEFT JOIN ".DB_SCHEMA.".roles r ON ur.role_id = r.id
WHERE u.user_id like concat(?, '%')
AND u.user_name like concat(?, '%')
";

try {
	$userId = '';
	$userName = '';
	if (!empty($_GET['userId']))
		$userId = $_GET['userId'];
	if (!empty($_GET['userName']))
		$userName = $_GET['userName'];

	if ($_SERVER['REQUEST_METHOD'] === 'GET') {
		$stmt = $connection->prepare($QUERY);
		$stmt->bind_param('ss', $userId, $userName);
		$stmt->execute();
		$stmt->bind_result($user_id, $user_name, $role_id, $role_name, $user_role_id);
		$data = [];
		while ($stmt->fetch()) {
			array_push($data, array('userId'=>$user_id, 'userName'=>$user_name, 'roleId'=>$role_id, 'roleName'=>$role_name, 'userRoleId'=>$user_role_id));
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
