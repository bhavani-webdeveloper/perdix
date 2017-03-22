<?php

namespace App\Responses;

class IRFResponse extends \EllipseSynergie\ApiResponse\AbstractResponse{

    /**
     * Implement this !!!
     * This method return the final response output
     *
     * @param array $array
     * @param array $headers
     */
    public function withArray(array $array, array $headers = [])
    {
        foreach ($headers as $key => $value){
            header($key. ': ' . $value);
        }
        echo \GuzzleHttp\json_encode($array);
    }

    public function json(array $array, array $headers = []){
        $headers['Content-Type'] = 'application/json';
        return $this->withArray($array, $headers);
    }
}