<?php
namespace App\Services;
use App\Core\Settings;

class CacheService {

	private static function getCacheFileName($key) {
		return "cache/$key.cache";
	}

	public static function getCache($key) {
		$file = CacheService::getCacheFileName($key);
		$current_time = time();
		if (file_exists($file)) {
			$cache_last_modified = filemtime($file); //time when the cache file was last modified
			if ($current_time < strtotime('+1 day', $cache_last_modified)) {
				$fileContent = file_get_contents($file);
				if (!empty($fileContent)) {
					return json_decode($fileContent);
				}
			}
		}
		return false;
	}

	public static function setCache($key, $value) {
		$file = CacheService::getCacheFileName($key);
		$fp = fopen($file, 'w');
		fwrite($fp, json_encode($value));
		fclose($fp);
	}

}