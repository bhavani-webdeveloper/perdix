<?php

use App\Responses\IRFResponse;

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