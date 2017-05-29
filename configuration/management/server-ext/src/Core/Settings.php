<?php
/**
 * Created by PhpStorm.
 * User: Shahal.Tharique
 * Date: 26-05-2017
 * Time: 15:05
 */

namespace App\Core;


class Settings
{
    private static $instance;

    protected $_settings;

    public static function getInstance(){
        if (self::$instance==null){
            self::$instance = new Settings();
        }
        return self::$instance;
    }

    public function setSettings($settings){
        $this->_settings = $settings;
    }

    public function getSettings(){
        return $this->_settings;
    }


}