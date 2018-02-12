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

    public function accountInfo($authToken = ""){
        $settings = Settings::getInstance()->getSettings();
        if ($authToken ==""){
            $authToken = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
        }
        if ($authToken == '') {
            $url_user_id = isset($_GET['user_id']) ? $_GET['user_id'] : '';
            $authToken = isset($_GET['auth_token']) ? 'Bearer ' . $_GET['auth_token'] : '';
        }

        $url = $settings['perdix']['v8_url'] . "/api/account";
        $client = new GuzzleClient();
        $reqResAch = $client->request('GET', $url , [
            'headers' => [
                'Authorization' => $authToken
            ],
            'connect_timeout' => 3600,
            'timeout' => 3600
        ]);
        $responseBody = $reqResAch->getBody()->getContents();
        $parsedArr = \GuzzleHttp\json_decode($responseBody, true);

        return $parsedArr;
    }
}