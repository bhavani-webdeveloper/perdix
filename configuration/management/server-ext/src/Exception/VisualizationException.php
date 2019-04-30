<?php
namespace App\Exception;

use Exception;

class VisualizationException extends Exception
{

    protected $statusCode = 500;

    public function __construct($message, $statusCode, Exception $previous = null)
    {
        parent::__construct($this->format($message), $statusCode, $previous);
    }

    private function format($message)
    {
        return "Data Visualization Error: " . $message;
    }

    public function getStatusCode(){
        return $this->statusCode;
    }

    public function setStatusCode($code){
        $this->statusCode = $code;
    }
}
