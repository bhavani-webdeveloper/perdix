<?php

class Pages {
	public function getDataJSON() {
		return json_encode(get_object_vars($this));
	}

	public $id;
	public $uri;
	public $rpa_id;
	public $page_config;
}