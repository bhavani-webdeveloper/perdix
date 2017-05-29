<?php

namespace App\Services;
use App\Core\Settings;
use GuzzleHttp\Client as GuzzleClient;

/**
 * Created by PhpStorm.
 * User: Shahal.Tharique
 * Date: 26-05-2017
 * Time: 14:51
 */
class PerdixService
{
    public function login(){

        $settings = Settings::getInstance()->getSettings();
        $url = $settings['perdix']['v8_url'] . "/oauth/token";

        try{
            $client = new GuzzleClient();
            $reqRes = $client->request('POST', $url, [
                'form_params' => [
                    'username' => $settings['perdix']['username'],
                    'password' => $settings['perdix']['password'],
                    "grant_type" => "password",
                    "scope" => "read write",
                    "client_secret" => "mySecretOAuthSecret",
                    "client_id" => "application"
                ],
                'connect_timeout' => 3600,
                'timeout' => 3600
            ]);
        } catch (\Exception $e){
            throw $e;
        }

        $filePath = base_path() . DIRECTORY_SEPARATOR . '.perdixauthcache';
        $file = fopen($filePath, 'w');


        $responseBody = $reqRes->getBody()->getContents();
        $parsedArr = \GuzzleHttp\json_decode($responseBody, true);
        fwrite($file, $parsedArr['access_token']);
        fclose($file);
        $settings['perdix']['token'] = $parsedArr['access_token'];
        Settings::getInstance()->setSettings($settings);
    }
}