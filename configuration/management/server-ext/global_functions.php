<?php

use App\Responses\IRFResponse;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Translation\FileLoader;
use Illuminate\Translation\Translator;
use Illuminate\Validation\DatabasePresenceVerifier;
use Illuminate\Validation\Factory;
use Illuminate\Container\Container;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\FirePHPHandler;


function get_response_obj(){
    // Instantiate the fractal manager
    $manager = new \League\Fractal\Manager;

// Set the request scope if you need embed data
//    $manager->parseIncludes(explode(',', $_GET['include']));

    $response = new IRFResponse($manager);

    return $response;
}

function base_path(){
    return __DIR__;
}

function get_validator(){
	$loader = new FileLoader(new Filesystem(), __DIR__ . DIRECTORY_SEPARATOR . 'lang');
    $translator = new Translator($loader, 'en');
    $validation = new Factory($translator, new Container);
    return $validation;
}

function get_logger(){
	// Create the logger
	$logger = new Logger('server_ext_logger');
	// Now add some handlers
	$logger->pushHandler(new StreamHandler(__DIR__.'/logs/server_ext.log', 15, Logger::DEBUG));
	
	return $logger;
}