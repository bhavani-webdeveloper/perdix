<?php

namespace App\Core\Visualization;

class Style {

    protected $styleData;

    public function __construct($styleData){
        $this->styleData = $styleData;
    }

    public static function fromStyleString($styleString){
        $obj = json_decode($styleString);
        $styleObj = new self($obj);
        return $styleObj;
    }

    /**
     * TODO-1
     * Loop through the style array, return an associative array(keyvalue) with key as the label.
     * 
     */
    public function getStylesByKey(){

    }
}