<?php

class RolePageAccess {
	public function getDataJSON() {
		return json_encode(get_object_vars($this));
	}

	public $id = -1;
	public $name;
}