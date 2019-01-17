<?php
namespace App\Exception;
use Exception;

class SFTPException extends Exception {
	function __construct($message, $code = 0, Exception $previous = null) {
		parent::__construct($this->format($message), $code, $previous);
	}

	private function format($message) {
		return "SFTP error: ".$message;
	}
}