<?php
namespace App\Services;
use ZipArchive;

class FolderConfig {
	public function createTempFolder($prefix='', $mode=0777, $separator='') {
		$dir = realpath(sys_get_temp_dir());
		if (substr($dir, -1) != '/') $dir .= '/';
		$oldmask = umask(0);
		do {
			$path = $dir.uniqid($prefix.$separator,true);
		} while (!mkdir($path, $mode));
		umask($oldmask);
 		return $path;
	}

	public function createFolder($folderName, $mode=0777) {
		$dir = realpath(sys_get_temp_dir());
		if (substr($dir, -1) != '/') $dir .= '/';
		$oldmask = umask(0);
		$path = $dir.$folderName;
		$count = 1;
		$pathCopy = $path;
		while (file_exists($path) && is_dir($path)) {
			$path = $pathCopy . "_". $count;
			$count++;
		}
		mkdir($path, $mode);
		umask($oldmask);
 		return $path;
	}

	public function createZip($folder, $mode=0777) {
		$zip = new ZipArchive;
		$zipFilename = $folder . '.zip';
		$res = $zip->open($zipFilename, ZipArchive::CREATE);

		if ($res === TRUE) {
			$files = glob($folder . "/*");
			foreach($files as $file) {
				$zip->addFile($file, basename($file));
			}
		    $zip->close();
		    chmod($folder . '.zip', $mode);
		    return $zipFilename;
		} else {
		   throw new \Exception($folder." can't zip");		    
		}
	}

	public function removeDir($dir) {
	    foreach(scandir($dir) as $file) {
	        if ('.' === $file || '..' === $file) continue;
	        if (is_dir("$dir/$file")) $this->removeDir("$dir/$file");
	        else $this->removeFile("$dir/$file");
	    }
	    rmdir($dir);
	}

	public function removeFile($file) {
		unlink($file);
	}
}