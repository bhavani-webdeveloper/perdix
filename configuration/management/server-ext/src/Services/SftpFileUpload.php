<?php

namespace App\Services;
use Hug\Sftp\Sftp;
use App\Exception\SFTPException;

set_error_handler(function($errno, $errstr, $errfile, $errline, array $errcontext) {
    // error was suppressed with the @-operator
    if (0 === error_reporting()) {
        return false;
    }

    throw new SFTPException($errstr);
});

class SftpFileUpload {
	private $host;
	private $userName;
	private $password;
	private $port;

	function __construct($host, $userName, $password, $port) {
		$this->host = $host;
		$this->userName = $userName;
		$this->password = $password;
		$this->port = $port;
	}

	public function fileUpload($localPath, $remotePath) {
		if(file_exists($localPath)) {
			try {
				if(!Sftp::upload($this->host, $this->userName, $this->password, $localPath, $remotePath, $this->port)) {
					throw new SFTPException("File is not upload to sftp path. Please check the sftp username, password or port");	
				}
			} catch(Exception $e) {
				echo $e->getMessage();
			}
		} else {		
			throw new SFTPException('file is not exist');
		}
	}
}

