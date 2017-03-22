<?php
if(isset($_GET))
{
	header("Access-Control-Allow-Headers: Content-Type, accept, Authorization, X-Requested-With"); 
	header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT"); 
	header("Access-Control-Request-Headers: Content-Type, accept"); 
	header("Access-Control-Expose-Headers: X-Total-Count"); 
	header('Content-Type: application/json'); 

	if (!empty($_SERVER['HTTP_ORIGIN'])) { 
        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']); 
	} 

	if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") { 
        die(); 
	}
	
	$ServiceList = "";
	
	$ServiceList[] = array("title"=>"Manage Score","iconClass"=>"fa fa-line-chart","state"=>"Page.Engine","stateParams"=>array("pageName"=>"score.ManageScore"));
	$ServiceList[] = array("title"=>"Manage Parameters","iconClass"=>"fa fa-line-chart","state"=>"Page.Engine","stateParams"=>array("pageName"=>"score.ManageScoreParameters"));
	$ServiceList[] = array("title"=>"Manage Param Values","iconClass"=>"fa fa-line-chart","state"=>"Page.Engine","stateParams"=>array("pageName"=>"score.ManageParameterValues"));
	
	echo '{"title": "Scoring", "items": '. json_encode($ServiceList, JSON_UNESCAPED_SLASHES) .'}';
}
?>